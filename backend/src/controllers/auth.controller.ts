import { Request, Response } from "express";
import { LoginSchema, SignupSchema } from "../models/auth.model";
import { authService } from "../services/auth.service";
import { ApiResponse } from "../utils/apiResponse";

export const login = async (req: Request, res: Response) => {
  const { email, password } = LoginSchema.parse(req.body);
  const result = await authService.login(email, password);
  res.json(new ApiResponse(result, "Login successful"));
};

export const signup = async (req: Request, res: Response) => {
  const payload = SignupSchema.parse(req.body);
  const result = await authService.signup(
    payload.email,
    payload.password,
    payload.firstName,
    payload.lastName
  );
  res.status(201).json(new ApiResponse(result, "Account created"));
};

export const getMe = async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user!.id);
  res.json(new ApiResponse(user, "Profile fetched"));
};
