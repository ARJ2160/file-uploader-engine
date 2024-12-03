import winston, { format } from "winston";
const { combine, colorize, simple } = format;

const commonTransportConfig = {
  maxsize: 5000000, // 5MB
  maxFiles: 5,
  tailable: true,
  zippedArchive: true,
};

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: combine(colorize(), simple()),
      ...commonTransportConfig,
    }),
    new winston.transports.File({
      filename: "combined.log",
      format: combine(colorize(), simple()),
      ...commonTransportConfig,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
