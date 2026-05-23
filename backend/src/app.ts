import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env, envDiagnostics } from "./config/env";
import { httpLogger, logger } from "./config/logger";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import apiRoutes from "./routes";
import { healthCheck } from "./controllers/health.controller";
import { asyncHandler } from "./utils/asyncHandler";
import { logResendStartup, isResendConfigured } from "./config/resend";
import { db } from "./config/db";

const app = express();

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin: ["https://scaler-amazon-clone-alpha.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(globalRateLimiter);

app.get("/health", asyncHandler(healthCheck));
app.use("/api/v1", apiRoutes);

app.use(errorHandler);

const port = env.PORT;

const bootstrap = async () => {
  logger.info("Environment diagnostics", {
    envFilePath: envDiagnostics.envFilePath,
    resendConfigured: envDiagnostics.resendConfigured,
    resendApiKeyPresent: envDiagnostics.resendApiKeyPresent,
    resendFromPresent: envDiagnostics.resendFromPresent,
  });
  logResendStartup();
  if (!isResendConfigured()) {
    logger.warn("Order confirmation emails will not send until Resend is configured");
  }

  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`Shutting down server (${signal})`);
    server.close(async () => {
      try {
        await db.shutdown();
      } catch (error) {
        logger.error("Failed to close database pool", { error });
      } finally {
        process.exit(0);
      }
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
};

void bootstrap();

export default app;
