import { Request, Response } from "express";
import { addressService } from "../services/address.service";
import { ApiResponse } from "../utils/apiResponse";
import { ensureString } from "../utils/helpers";

export const getAddresses = async (req: Request, res: Response) => {
  const addresses = await addressService.getAddresses(req.user!.id);
  res.json(new ApiResponse(addresses, "Addresses fetched"));
};

export const addAddress = async (req: Request, res: Response) => {
  const address = await addressService.addAddress({
    ...req.body,
    userId: req.user!.id,
  });
  res.status(201).json(new ApiResponse(address, "Address added"));
};

export const updateAddress = async (req: Request, res: Response) => {
  const address = await addressService.updateAddress(
    req.user!.id,
    ensureString(req.params.addressId)!,
    req.body
  );
  res.json(new ApiResponse(address, "Address updated"));
};

export const deleteAddress = async (req: Request, res: Response) => {
  await addressService.deleteAddress(
    req.user!.id,
    ensureString(req.params.addressId)!
  );
  res.json(new ApiResponse({ deleted: true }, "Address deleted"));
};

export const setDefaultAddress = async (req: Request, res: Response) => {
  const address = await addressService.setDefaultAddress(
    req.user!.id,
    ensureString(req.params.addressId)!
  );
  res.json(new ApiResponse(address, "Default address set"));
};
