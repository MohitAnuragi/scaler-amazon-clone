import { logger } from "../config/logger";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error: unknown) => {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: string }).code ?? "");
    return code === "ER_LOCK_DEADLOCK" || code === "ER_LOCK_WAIT_TIMEOUT";
  }

  return error instanceof Error && /deadlock|lock wait/i.test(error.message);
};

export const retryTransaction = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      if (attempt > maxRetries || !isRetryableError(error)) {
        throw error;
      }

      const delay = 100 * Math.pow(2, attempt - 1);
      logger.warn(`Retrying transaction (attempt ${attempt})`, { delay });
      await wait(delay);
    }
  }
};
