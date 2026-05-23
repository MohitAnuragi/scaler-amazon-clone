import { Router } from "express";
import productRouter from "./product.routes";
import cartRouter from "./cart.routes";
import orderRouter from "./order.routes";
import addressRouter from "./address.routes";
import categoryRouter from "./category.routes";
import authRouter from "./auth.routes";
import wishlistRouter from "./wishlist.routes";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/cart", requireAuth, cartRouter);
router.use("/orders", requireAuth, orderRouter);
router.use("/addresses", requireAuth, addressRouter);
router.use("/categories", categoryRouter);
router.use("/wishlist", requireAuth, wishlistRouter);

export default router;
