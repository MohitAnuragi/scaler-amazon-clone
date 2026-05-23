import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { ApiResponse } from "../utils/apiResponse";
import { ensureString } from "../utils/helpers";

export const placeOrder = async (req: Request, res: Response) => {
  const result = await orderService.placeOrder(
    req.user!.id,
    req.body.addressId,
    req.body.paymentMethod,
    req.body.notes,
    req.user?.email
  );
  res.status(201).json(new ApiResponse(result, "Order placed"));
};

export const getOrderHistory = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const result = await orderService.getOrderHistory(req.user!.id, page, limit);
  res.json(new ApiResponse(result, "Order history fetched"));
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await orderService.getOrderDetail(
    req.user!.id,
    ensureString(req.params.orderId)!
  );
  res.json(new ApiResponse(order, "Order fetched"));
};

export const getOrderByNumber = async (req: Request, res: Response) => {
  const order = await orderService.getOrderByNumber(
    req.user!.id,
    ensureString(req.params.orderNumber)!
  );
  res.json(new ApiResponse(order, "Order fetched"));
};
