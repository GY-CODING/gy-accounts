import { LogMessage } from '@/utils/logs/logMessages';

/** `GY_API` without wrapping quotes (some deploy environments add them). */
export function getGyApiBaseUrl(): string {
  const url = process.env.GY_API?.replace(/['"]/g, '');
  if (!url) throw new Error(LogMessage.CONFIG_GY_API_MISSING);
  return url;
}

export function buildAuthHeaders(idToken?: string): HeadersInit {
  if (!idToken) throw new Error('Missing idToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  };
}

/** `fetch` against the GY APIs that throws on any non-2xx status. */
export async function fetchGyApi(
  url: string,
  init: RequestInit
): Promise<Response> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(
      `GYCODING API Error: ${response.status} - ${response.statusText}`
    );
  }
  return response;
}

export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : LogMessage.UNKNOWN_ERROR;
