import morgan from "morgan";
import winston from "winston";
import { env } from "./env";

const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${timestamp} ${level}: ${message}${metaString}`;
});

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format:
    env.NODE_ENV === "production"
      ? winston.format.combine(winston.format.timestamp(), winston.format.json())
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          logFormat
        ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

const httpLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :remote-addr",
  { stream }
);

export { logger, httpLogger };
