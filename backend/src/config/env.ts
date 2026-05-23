import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { z } from "zod";

const envCandidates = [
  path.resolve(process.cwd(), "backend", ".env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "..", "..", ".env"),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

dotenv.config(envPath ? { path: envPath } : undefined);

const withMysqlDefaults = (): NodeJS.ProcessEnv => {
  const raw = { ...process.env };
  if (raw.MYSQL_HOST) return raw;

  const legacyUrl = raw.DATABASE_URL;
  if (!legacyUrl) return raw;

  try {
    const normalized = legacyUrl.replace(/^postgresql:/i, "mysql:");
    const url = new URL(normalized);
    return {
      ...raw,
      MYSQL_HOST: url.hostname,
      MYSQL_PORT: url.port || (legacyUrl.startsWith("postgresql") ? "5432" : "3306"),
      MYSQL_USER: decodeURIComponent(url.username),
      MYSQL_PASSWORD: decodeURIComponent(url.password),
      MYSQL_DATABASE: url.pathname.replace(/^\//, ""),
    };
  } catch {
    return raw;
  }
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  MYSQL_HOST: z.string().min(1, "MYSQL_HOST is required"),
  MYSQL_PORT: z.coerce.number().int().default(3306),
  MYSQL_USER: z.string().min(1, "MYSQL_USER is required"),
  MYSQL_PASSWORD: z.string().min(1, "MYSQL_PASSWORD is required"),
  MYSQL_DATABASE: z.string().min(1, "MYSQL_DATABASE is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
  LOG_LEVEL: z.string().default("info"),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
}).superRefine((data, ctx) => {
  const emailConfigured = Boolean(data.RESEND_API_KEY || data.RESEND_FROM);

  const looksPlaceholder = (value?: string) =>
    Boolean(value) &&
    /your|placeholder|example|changeme|app password|google app password/i.test(value ?? "");

  if (!emailConfigured) {
    return;
  }

  if (!data.RESEND_API_KEY) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["RESEND_API_KEY"],
      message: "RESEND_API_KEY is required when email is configured",
    });
  }

  if (!data.RESEND_FROM) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["RESEND_FROM"],
      message: "RESEND_FROM is required when email is configured",
    });
  }

  if (looksPlaceholder(data.RESEND_API_KEY)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["RESEND_API_KEY"],
      message: "RESEND_API_KEY appears to be a placeholder value",
    });
  }

  if (looksPlaceholder(data.RESEND_FROM)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["RESEND_FROM"],
      message: "RESEND_FROM appears to be a placeholder value",
    });
  }
});

const parsed = envSchema.safeParse(withMysqlDefaults());

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(formatted)}`);
}

export const env = parsed.data;
export const envFilePath = envPath ?? null;
export const envDiagnostics = {
  envFilePath,
  resendConfigured: Boolean(parsed.data.RESEND_API_KEY && parsed.data.RESEND_FROM),
  resendApiKeyPresent: Boolean(parsed.data.RESEND_API_KEY),
  resendFromPresent: Boolean(parsed.data.RESEND_FROM),
};
