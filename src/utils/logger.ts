import { createLogger, LogData, LogEnvironment } from '@gycoding/nebula';

const LOG_ORIGIN = 'GY-ACCOUNTS';

/**
 * Context of a log line. Known fields go to their own slot of the shared
 * format; any other key is kept inside `additionalData`.
 */
export interface LogContext {
  profileId?: string;
  /** Auth0 subject (server side). */
  userId?: string;
  additionalData?: Record<string, unknown>;
  [key: string]: unknown;
}

const LOG_ENVIRONMENTS = Object.values(LogEnvironment) as string[];

/** `LOG_ENV` (nebula) → `ENV` (this app) → `NEXT_PUBLIC_LOG_ENV` (browser) → build mode. */
export function resolveEnvironment(): LogEnvironment {
  const configured = (
    process.env.LOG_ENV ??
    process.env.ENV ??
    process.env.NEXT_PUBLIC_LOG_ENV
  )?.toUpperCase();
  if (configured && LOG_ENVIRONMENTS.includes(configured)) {
    return configured as LogEnvironment;
  }
  return process.env.NODE_ENV === 'production'
    ? LogEnvironment.PRO
    : LogEnvironment.LOCAL;
}

export function toLogData(context: LogContext = {}): LogData {
  const { profileId, userId, additionalData, ...extra } = context;
  return { profileId, userId, additionalData: { ...extra, ...additionalData } };
}

const baseLogger = createLogger({
  origin: LOG_ORIGIN,
  getEnvironment: resolveEnvironment,
});

/**
 * App logger. Lines follow the GYCODING format shared with the back:
 * `LEVEL message. - [{"data": {"env", "profileId", "userId", "additionalData"}}]`
 */
export const logger = {
  debug: (message: string, context?: LogContext) =>
    baseLogger.debug(message, toLogData(context)),
  info: (message: string, context?: LogContext) =>
    baseLogger.info(message, toLogData(context)),
  warn: (message: string, context?: LogContext) =>
    baseLogger.warn(message, toLogData(context)),
  error: (message: string, context?: LogContext, error?: unknown) =>
    baseLogger.error(message, toLogData(context), error),
};
