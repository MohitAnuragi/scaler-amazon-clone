import type { OrderConfirmationEmailPayload } from "./types";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

const isPresent = (value: string | null | undefined): value is string => Boolean(value);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const noImageUrl =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/480px-No-Image-Placeholder.svg.png";

const formatAddress = (payload: OrderConfirmationEmailPayload) => {
  const lines = [
    payload.address.fullName,
    payload.address.addressLine1,
    payload.address.addressLine2,
    `${payload.address.city}, ${payload.address.state} ${payload.address.pincode}`,
    payload.address.country,
    `Phone: ${payload.address.phone}`,
  ].filter(isPresent);

  return lines.map((line) => escapeHtml(line)).join("<br />");
};

const formatAddressText = (payload: OrderConfirmationEmailPayload) => {
  const lines = [
    payload.address.fullName,
    payload.address.addressLine1,
    payload.address.addressLine2,
    `${payload.address.city}, ${payload.address.state} ${payload.address.pincode}`,
    payload.address.country,
    `Phone: ${payload.address.phone}`,
  ].filter(isPresent);

  return lines.join("\n");
};

const getImageUrl = (url?: string | null) => url?.trim() || noImageUrl;

export const buildOrderConfirmationEmailSubject = (payload: OrderConfirmationEmailPayload) =>
  `Your Amazon.in order ${payload.orderNumber} is confirmed`;

export const buildOrderConfirmationEmailHtml = (payload: OrderConfirmationEmailPayload) => {
  const itemRows = payload.items
    .map((item) => {
      const imageUrl = escapeHtml(getImageUrl(item.productImageUrl));
      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #eaeded;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <tr>
                <td width="92" valign="top" style="padding-right:12px;">
                  <img src="${imageUrl}" alt="${escapeHtml(item.productName)}" width="80" height="80" style="display:block;width:80px;height:80px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />
                </td>
                <td valign="top" style="font-family:Arial,sans-serif;color:#0f1111;">
                  <div style="font-size:15px;font-weight:700;line-height:1.4;">${escapeHtml(item.productName)}</div>
                  <div style="font-size:13px;color:#565959;margin-top:4px;">Qty ${item.quantity} &middot; ${formatCurrency(item.unitPrice)} each</div>
                </td>
                <td valign="top" align="right" style="font-family:Arial,sans-serif;color:#0f1111;font-size:15px;font-weight:700;white-space:nowrap;">
                  ${formatCurrency(item.subtotal)}
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(buildOrderConfirmationEmailSubject(payload))}</title>
      </head>
      <body style="margin:0;padding:0;background:#f3f3f3;font-family:Arial,sans-serif;color:#111;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f3f3f3;">
          <tr>
            <td align="center" style="padding:24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;border-collapse:collapse;background:#ffffff;border:1px solid #ddd;border-radius:4px;overflow:hidden;">
                <tr>
                  <td style="background:#131921;padding:22px 24px;color:#ffffff;">
                    <div style="font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                      amazon<span style="color:#ff9900;">.in</span>
                    </div>
                    <div style="font-size:13px;margin-top:6px;color:#d5d9d9;">Order confirmation</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;">
                    <div style="font-size:16px;line-height:1.6;margin-bottom:16px;">Hi ${escapeHtml(payload.customerName)},</div>
                    <div style="font-size:14px;line-height:1.6;color:#0f1111;margin-bottom:18px;">
                      Thanks for your order. We&apos;re getting it ready now.
                    </div>

                    <div style="border:1px solid #eaeded;border-radius:6px;padding:16px 18px;margin-bottom:18px;background:#f8f9fa;">
                      <div style="font-size:13px;color:#565959;">Order number</div>
                      <div style="font-size:22px;font-weight:700;color:#067d62;margin-top:4px;">${escapeHtml(payload.orderNumber)}</div>
                      <div style="font-size:13px;color:#565959;margin-top:4px;">Order ID: ${escapeHtml(payload.orderId)}</div>
                      <div style="font-size:13px;color:#565959;margin-top:4px;">Estimated delivery: ${escapeHtml(payload.estimatedDeliveryDate)}</div>
                    </div>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                      ${itemRows}
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:18px;border-top:1px solid #eaeded;">
                      <tr>
                        <td style="padding-top:16px;font-size:14px;color:#565959;">Subtotal</td>
                        <td align="right" style="padding-top:16px;font-size:14px;color:#111;">${formatCurrency(payload.subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:10px;font-size:14px;color:#565959;">Tax</td>
                        <td align="right" style="padding-top:10px;font-size:14px;color:#111;">${formatCurrency(payload.taxAmount)}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:10px;font-size:14px;color:#565959;">Shipping</td>
                        <td align="right" style="padding-top:10px;font-size:14px;color:#111;">${payload.shippingAmount === 0 ? "FREE" : formatCurrency(payload.shippingAmount)}</td>
                      </tr>
                      <tr>
                        <td style="padding-top:14px;font-size:16px;font-weight:700;color:#111;">Order total</td>
                        <td align="right" style="padding-top:14px;font-size:18px;font-weight:700;color:#111;">${formatCurrency(payload.totalAmount)}</td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:22px;">
                      <tr>
                        <td style="padding:16px;border:1px solid #eaeded;border-radius:6px;background:#f8f9fa;">
                          <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Delivering to</div>
                          <div style="font-size:14px;line-height:1.6;color:#111;">${formatAddress(payload)}</div>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:18px;">
                      <tr>
                        <td style="font-size:14px;color:#565959;line-height:1.6;">
                          <strong style="color:#111;">Payment summary:</strong> ${escapeHtml(payload.paymentMethod)} &middot; ${escapeHtml(payload.paymentStatus)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f3f3f3;padding:16px 24px;font-size:12px;color:#565959;line-height:1.6;">
                    You&apos;ll receive another update when your order ships. If you have any questions, reply to this email for support.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const buildOrderConfirmationEmailText = (payload: OrderConfirmationEmailPayload) => {
  const items = payload.items
    .map((item) => `${item.productName} | Qty ${item.quantity} | ${formatCurrency(item.subtotal)}`)
    .join("\n");

  return [
    `Hi ${payload.customerName},`,
    ``,
    `Thanks for your order.`,
    ``,
    `Order number: ${payload.orderNumber}`,
    `Order ID: ${payload.orderId}`,
    `Estimated delivery: ${payload.estimatedDeliveryDate}`,
    ``,
    `Items:`,
    items,
    ``,
    `Subtotal: ${formatCurrency(payload.subtotal)}`,
    `Tax: ${formatCurrency(payload.taxAmount)}`,
    `Shipping: ${payload.shippingAmount === 0 ? "FREE" : formatCurrency(payload.shippingAmount)}`,
    `Order total: ${formatCurrency(payload.totalAmount)}`,
    ``,
    `Delivering to:`,
    formatAddressText(payload),
    ``,
    `Payment summary: ${payload.paymentMethod} / ${payload.paymentStatus}`,
    ``,
    `amazon.in`,
  ]
    .filter(Boolean)
    .join("\n");
};
