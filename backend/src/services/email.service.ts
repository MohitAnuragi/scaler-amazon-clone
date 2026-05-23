import { env } from "../config/env";
import { logger } from "../config/logger";
import {
  buildOrderConfirmationEmailHtml,
  buildOrderConfirmationEmailSubject,
  buildOrderConfirmationEmailText,
} from "./email/orderConfirmation.template";
import type { OrderConfirmationEmailPayload } from "./email/types";
import { sendResendEmail } from "../config/resend";

export type { OrderConfirmationEmailPayload } from "./email/types";

export const sendOrderConfirmationEmail = async (
  payload: OrderConfirmationEmailPayload
): Promise<void> => {
  const from = env.RESEND_FROM;
  const subject = buildOrderConfirmationEmailSubject(payload);
  const text = buildOrderConfirmationEmailText(payload);
  const html = buildOrderConfirmationEmailHtml(payload);

  logger.info("Sending order confirmation email", {
    orderNumber: payload.orderNumber,
    orderId: payload.orderId,
    to: payload.to,
  });

  try {
    const messageId = await sendResendEmail({
      from: from ?? "",
      to: payload.to,
      subject,
      text,
      html,
    });

    logger.info("Order confirmation email sent", {
      messageId,
      orderNumber: payload.orderNumber,
      orderId: payload.orderId,
      to: payload.to,
    });
  } catch (error) {
    logger.error("Order confirmation email send failed", {
      error,
      orderNumber: payload.orderNumber,
      orderId: payload.orderId,
      to: payload.to,
    });
    throw error;
  }
};
