import { Request, Response } from "express";
import { db } from "../config/db";
import { ApiResponse } from "../utils/apiResponse";

export const healthCheck = async (_req: Request, res: Response) => {
  let dbStatus = "down";
  try {
    await db.ping();
    dbStatus = "up";
  } catch {
    dbStatus = "down";
  }

  res.json(
    new ApiResponse(
      {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        dbStatus,
      },
      "Health check"
    )
  );
};
