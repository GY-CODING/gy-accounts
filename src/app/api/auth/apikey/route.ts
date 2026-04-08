/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendLog, LogLevel, LogMessage } from '@/utils/logs/logHelper';
import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

// ----------------------------------
// Helpers idénticos al otro archivo
// ----------------------------------

function getBaseApiUrl() {
  const env = process.env.GY_API;

  if (!env) {
    throw new Error(LogMessage.CONFIG_GY_API_MISSING);
  }

  const url = env.replace(/['"]/g, '');

  if (!url) {
    throw new Error(LogMessage.CONFIG_GY_API_MISSING);
  }

  return url;
}

function getHeaders(idToken?: string) {
  if (!idToken) throw new Error('Missing idToken');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${idToken}`,
  };
}

async function fetchFromGyCoding(url: string, options: RequestInit) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const message = `GyCoding API Error: ${response.status} - ${response.statusText}`;
    throw new Error(message);
  }

  return response;
}

// ----------------------------------
// Handler PATCH adaptado
// ----------------------------------

export async function PATCH() {
  try {
    const session = await getSession();
    const { idToken, user } = session ?? {};

    await sendLog(LogLevel.INFO, LogMessage.SESSION_RETRIEVED, {
      user: user?.sub,
    });

    if (!session || !user) {
      return NextResponse.json(
        { error: LogMessage.SESSION_NOT_FOUND },
        { status: 401 }
      );
    }

    const baseUrl = getBaseApiUrl();
    const API_URL = `${baseUrl}/accounts/user/metadata/apikey`;
    const headers = getHeaders(idToken);

    await fetchFromGyCoding(API_URL, {
      method: 'PATCH',
      headers,
    });

    await sendLog(LogLevel.INFO, LogMessage.APIKEY_UPDATED, {
      user: user.sub,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/auth/metadata/apikey', error);

    await sendLog(LogLevel.ERROR, LogMessage.APIKEY_UPDATE_FAILED, {
      error: error instanceof Error ? error.message : error,
    });

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : LogMessage.UNKNOWN_ERROR,
      },
      { status: 500 }
    );
  }
}

export async function generateStaticParams() {
  return [];
}
