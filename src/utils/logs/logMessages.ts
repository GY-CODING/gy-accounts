/** Log messages of GY Accounts. The logger adds the closing full stop. */
export enum LogMessage {
  // ── Session ──
  SESSION_RETRIEVED = 'Session retrieved',
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

  // ── Client ──
  USER_FETCH_FAILED = 'User data could not be fetched',
  USER_UPDATE_FAILED = 'User data could not be updated',

  // ── Generic ──
  METHOD_NOT_ALLOWED = 'Method not allowed',
  UNKNOWN_ERROR = 'Unknown error',
}
