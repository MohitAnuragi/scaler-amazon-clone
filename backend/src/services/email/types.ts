export type OrderEmailItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productImageUrl?: string | null;
};

export type OrderConfirmationEmailPayload = {
  to: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
  totalAmount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  estimatedDeliveryDate: string;
  items: OrderEmailItem[];
  address: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
    phone: string;
  };
};
