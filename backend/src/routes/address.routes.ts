import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../controllers/address.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middlewares/validate.middleware";
import { AddressSchema } from "../models/order.model";
import { AddressIdParamSchema } from "../models/common.model";

const router = Router();

router.get("/", asyncHandler(getAddresses));
router.post("/", validate(AddressSchema), asyncHandler(addAddress));
router.patch(
  "/:addressId",
  validate(AddressIdParamSchema, "params"),
  validate(AddressSchema.partial()),
  asyncHandler(updateAddress)
);
router.delete(
  "/:addressId",
  validate(AddressIdParamSchema, "params"),
  asyncHandler(deleteAddress)
);
router.patch(
  "/:addressId/default",
  validate(AddressIdParamSchema, "params"),
  asyncHandler(setDefaultAddress)
);

export default router;
