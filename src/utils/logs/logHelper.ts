import { sendLog as _sendLog, LogLevel, type LogData } from '@gycoding/nebula';

const LOG_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '\x1b[36m',
  [LogLevel.INFO]: '\x1b[32m',
  [LogLevel.WARN]: '\x1b[33m',
  [LogLevel.ERROR]: '\x1b[31m',
};
const RESET = '\x1b[0m';

function logConsole(level: LogLevel, message: string, data: LogData): void {
  const hasExtra = Object.keys(data).length > 0;
  const extra = hasExtra ? ` ${JSON.stringify(data)}` : '';

  if (process.env.LOG_ENV?.toUpperCase() === 'LOCAL') {
    const color = LOG_COLORS[level];
    console.log(`${color}[${level}]${RESET} ${message}${extra}`);
  } else {
    console.log(`[GY-ACCOUNTS] [${level}] ${message}${extra}`);
  }
}



enum LogMessage {
  // ── Session ──
  SESSION_RETRIEVED = 'Session retrieved [{id}]',
  SESSION_NOT_FOUND = 'No active session found',

  // ── Config ──
  CONFIG_GY_API_MISSING = 'GY_API environment variable is not defined',

  // ── Profile ──
  PROFILE_RETRIEVED = 'Profile retrieved',
  PROFILE_RETRIEVE_FAILED = 'Profile could not be retrieved',
  PROFILE_UPDATED = 'Profile updated',
  PROFILE_UPDATE_FAILED = 'Profile could not be updated',

  // ── API Key ──
  APIKEY_UPDATED = 'API key updated',
  APIKEY_UPDATE_FAILED = 'API key could not be updated',

  // ── Generic ──
  METHOD_NOT_ALLOWED = 'Method not allowed',
  UNKNOWN_ERROR = 'Unknown error',
}

/**
 * Application-scoped wrapper around the shared `sendLog` from @gycoding/nebula.
 * Automatically sets the origin to GY-ACCOUNTS.
 */
export async function sendLog(
  level: LogLevel,
  message: string,
  data: LogData = {}
): Promise<void> {
  logConsole(level, message, data);
  return _sendLog(level, message, 'ACCOUNTS-DASHBOARD', data);
}

export { LogLevel, LogMessage };

/**
 * Descriptive, domain-specific log messages.
 *
 * Naming convention:  DOMAIN_ACTION(_RESULT)
 *   - DOMAIN  → the bounded context (SESSION, CONFIG, PROFILE, APIKEY)
 *   - ACTION  → what happened (RETRIEVED, UPDATED, …)
 *   - RESULT  → optional qualifier (FAILED, NOT_FOUND)
 */