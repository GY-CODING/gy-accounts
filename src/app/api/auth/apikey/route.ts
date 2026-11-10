import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import {
  buildAuthHeaders,
  errorMessage,
  fetchGyApi,
  getGyApiBaseUrl,
} from '@/server/gyApi';
import { logger } from '@/utils/logger';
import { LogMessage } from '@/utils/logs/logMessages';

/** Asks GY Accounts for a new API key for the session user. */
export async function PATCH(): Promise<NextResponse> {
  const session = await getSession();
  const userId = session?.user?.sub;

  if (!session || !userId) {
    logger.warn(LogMessage.SESSION_NOT_FOUND, {
      additionalData: { route: '/api/auth/apikey' },
    });
    return NextResponse.json(
      { error: LogMessage.SESSION_NOT_FOUND },
      { status: 401 }
    );
  }

  try {
    await fetchGyApi(`${getGyApiBaseUrl()}/accounts/user/metadata/apikey`, {
      method: 'PATCH',
      headers: buildAuthHeaders(session.idToken),
    });
    logger.info(LogMessage.APIKEY_UPDATED, { userId });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    logger.error(LogMessage.APIKEY_UPDATE_FAILED, { userId }, error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
