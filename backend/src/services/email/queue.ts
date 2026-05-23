import { logger } from "../../config/logger";
import { sendOrderConfirmationEmail } from "../email.service";
import type { OrderConfirmationEmailPayload } from "./types";

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 1000;

const inflightOrderIds = new Set<string>();

const scheduleRetry = (payload: OrderConfirmationEmailPayload, attempt: number) => {
  const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
  logger.warn("Retrying order confirmation email", {
    orderNumber: payload.orderNumber,
    attempt,
    delay,
  });

  setTimeout(() => {
    void runJob(payload, attempt);
  }, delay);
};

const runJob = async (payload: OrderConfirmationEmailPayload, attempt: number) => {
  logger.info("Running order confirmation email job", {
    orderNumber: payload.orderNumber,
    orderId: payload.orderId,
    attempt,
    to: payload.to,
  });

  try {
    await sendOrderConfirmationEmail(payload);
    logger.info("Order confirmation email job completed", {
      orderNumber: payload.orderNumber,
      orderId: payload.orderId,
      to: payload.to,
      attempt,
    });
    inflightOrderIds.delete(payload.orderId);
    return;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    const isConfigIssue =
      /resend is not configured|missing|credential|auth|401|403|timeout|network|fetch/i.test(
        errorMessage
      );

    if (attempt < MAX_ATTEMPTS) {
      if (isConfigIssue) {
        logger.error("Order confirmation email failed due to SMTP configuration", {
          error,
          orderNumber: payload.orderNumber,
          orderId: payload.orderId,
          to: payload.to,
          attempt,
        });
        inflightOrderIds.delete(payload.orderId);
        return;
      }

      scheduleRetry(payload, attempt + 1);
      return;
    }

    logger.error("Order confirmation email failed after retries", {
      error,
      orderNumber: payload.orderNumber,
      to: payload.to,
    });
    inflightOrderIds.delete(payload.orderId);
  }
};

export const enqueueOrderConfirmationEmail = (payload: OrderConfirmationEmailPayload) => {
  if (inflightOrderIds.has(payload.orderId)) {
    logger.info("Skipped duplicate order confirmation email enqueue", {
      orderNumber: payload.orderNumber,
      orderId: payload.orderId,
    });
    return;
  }

  inflightOrderIds.add(payload.orderId);
  logger.info("Enqueued order confirmation email", {
    orderNumber: payload.orderNumber,
    orderId: payload.orderId,
    to: payload.to,
  });
  void runJob(payload, 1);
};
