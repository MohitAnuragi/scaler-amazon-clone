import { Router } from "express";
import {
  getOrderById,
  getOrderByNumber,
  getOrderHistory,
  placeOrder,
} from "../controllers/order.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { PlaceOrderSchema } from "../models/order.model";
import { OrderIdParamSchema, OrderNumberParamSchema } from "../models/common.model";
import { orderRateLimiter } from "../middlewares/rateLimiter.middleware";

const router = Router();

router.get("/", asyncHandler(getOrderHistory));
router.get(
  "/number/:orderNumber",
  validate(OrderNumberParamSchema, "params"),
  asyncHandler(getOrderByNumber)
);
router.get("/:orderId", validate(OrderIdParamSchema, "params"), asyncHandler(getOrderById));
router.post(
  "/",
  orderRateLimiter,
  validate(PlaceOrderSchema),
  asyncHandler(placeOrder)
);

export default router;
