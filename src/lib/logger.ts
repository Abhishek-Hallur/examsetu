import pino from "pino";

const globalForLogger = globalThis as unknown as {
  logger: pino.Logger | undefined;
};

export const logger =
  globalForLogger.logger ??
  pino({
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: { colorize: true },
          }
        : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForLogger.logger = logger;
