import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { UserProfile } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildAuthHeaders,
  errorMessage,
  fetchGyApi,
  getGyApiBaseUrl,
} from '@/server/gyApi';
import { logger } from '@/utils/logger';
import { LogMessage } from '@/utils/logs/logMessages';

type ProfileUpdate = Pick<UserProfile, 'username' | 'picture' | 'phoneNumber'>;

const profileUrl = () => `${getGyApiBaseUrl()}/accounts/user/profile`;

/** Collapses the first run of spaces: "+34   600" → "+34 600". */
const normalizePhone = (phone?: string) => phone?.trim().replace(/\s+/, ' ');

async function getProfile(): Promise<NextResponse> {
  const session = await getSession();
  try {
    const response = await fetchGyApi(profileUrl(), {
      method: 'GET',
      headers: buildAuthHeaders(session?.idToken),
    });
    return NextResponse.json((await response.json()) as UserProfile);
  } catch (error) {
    logger.error(
      LogMessage.PROFILE_RETRIEVE_FAILED,
      { userId: session?.user?.sub },
      error
    );
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

async function updateProfile(request: NextRequest): Promise<NextResponse> {
  const session = await getSession();
  const userId = session?.user?.sub;
  try {
    const { username, picture, phoneNumber } =
      (await request.json()) as ProfileUpdate;
    const response = await fetchGyApi(profileUrl(), {
      method: 'PUT',
      headers: buildAuthHeaders(session?.idToken),
      body: JSON.stringify({
        username,
        picture,
        phoneNumber: normalizePhone(phoneNumber),
      }),
    });
    const profile = (await response.json()) as UserProfile;
    logger.info(LogMessage.PROFILE_UPDATED, { userId });
    return NextResponse.json(profile);
  } catch (error) {
    logger.error(LogMessage.PROFILE_UPDATE_FAILED, { userId }, error);
    return NextResponse.json(
      { error: LogMessage.PROFILE_UPDATE_FAILED },
      { status: 500 }
    );
  }
}

export const GET = withApiAuthRequired(getProfile);
export const PUT = withApiAuthRequired(updateProfile);
