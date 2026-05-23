import { env } from "./env";
import { logger } from "./logger";

const RESEND_API_URL = "https://api.resend.com/emails";

type ResendEmailRequest = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

type ResendEmailResponse = {
  id?: string;
  message?: string;
  name?: string;
};

const getResendConfigSummary = () => ({
  configured: Boolean(env.RESEND_API_KEY && env.RESEND_FROM),
  from: env.RESEND_FROM ?? null,
  apiKeyPresent: Boolean(env.RESEND_API_KEY),
});

const getResendSetupHint = (errorMessage: string) => {
  const message = errorMessage.toLowerCase();

  if (message.includes("401") || message.includes("unauthorized")) {
    return "Check RESEND_API_KEY.";
  }

  if (message.includes("403") || message.includes("forbidden")) {
    return "Check that RESEND_FROM is verified in Resend.";
  }

  if (message.includes("400") || message.includes("invalid")) {
    return "Check RESEND_FROM and the recipient email address.";
  }

  if (message.includes("network") || message.includes("timeout") || message.includes("fetch")) {
    return "Check outbound network access to api.resend.com.";
  }

  return null;
};

export const isResendConfigured = () => Boolean(env.RESEND_API_KEY && env.RESEND_FROM);

export const logResendStartup = () => {
  if (isResendConfigured()) {
    logger.info("Resend email configuration ready", getResendConfigSummary());
    return;
  }

  logger.warn("Resend email is not configured", getResendConfigSummary());
};

export const sendResendEmail = async (payload: ResendEmailRequest): Promise<string> => {
  if (!isResendConfigured()) {
    logger.warn("Resend email client is not configured", getResendConfigSummary());
    throw new Error("Resend is not configured. Set RESEND_API_KEY and RESEND_FROM in backend/.env");
  }

  logger.info("Sending order confirmation email through Resend", {
    from: payload.from,
    to: payload.to,
    subject: payload.subject,
  });

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  const body = (await response.json().catch(() => ({}))) as ResendEmailResponse;

  if (!response.ok) {
    const errorMessage = body.message || `Resend request failed with status ${response.status}`;
    const hint = getResendSetupHint(errorMessage);
    logger.error("Resend email send failed", {
      status: response.status,
      errorMessage,
      from: payload.from,
      to: payload.to,
      ...(hint ? { hint } : {}),
    });
    throw new Error(errorMessage);
  }

  const messageId = body.id ?? "";
  logger.info("Resend email sent", {
    messageId,
    from: payload.from,
    to: payload.to,
  });
  return messageId;
};
