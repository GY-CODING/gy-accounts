/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendLog, LogLevel, LogMessage } from '@/utils/logs/logHelper';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { UserProfile } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

function getBaseApiUrl() {
  const env = process.env.ENVIRONMENT;

  const urlMap: Record<string, string | undefined> = {
    DEVELOP: process.env.GY_API_DEVELOP,
    PRODUCTION: process.env.GY_API_PRODUCTION,
  };

  const url = urlMap[env || '']?.replace(/['"]/g, '');

  if (!url) throw new Error(LogMessage.CONFIG_GY_API_MISSING);

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

async function handleGet(API_URL: string, headers: any) {
  const res = await fetchFromGyCoding(API_URL, { method: 'GET', headers });

  const profile: UserProfile = await res.json();

  return NextResponse.json(profile);
}

async function handlePut(request: NextRequest, API_URL: string, headers: any) {
  const body = await request.json();
  const user = (await getSession())?.user;
  const { username, picture, phoneNumber } = body;

  const normalizedPhone = phoneNumber?.trim().replace(/\s+/, ' ');

  try {
    const response = await fetchFromGyCoding(API_URL, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ username, picture, phoneNumber: normalizedPhone }),
    });

    const data = await response.json();
    await sendLog(LogLevel.INFO, LogMessage.PROFILE_UPDATED, {
      user: user?.sub,
    });
    return NextResponse.json(data);
  } catch (err: any) {
    await sendLog(LogLevel.ERROR, LogMessage.PROFILE_UPDATE_FAILED);
    console.error(err);
    return NextResponse.json(
      { error: LogMessage.PROFILE_UPDATE_FAILED },
      { status: 500 }
    );
  }
}

async function handler(request: NextRequest) {
  try {
    const { idToken } = (await getSession()) ?? {};
    const baseUrl = getBaseApiUrl();
    const API_URL = `${baseUrl}/accounts/user/profile`;
    const headers = getHeaders(idToken);

    switch (request.method) {
      case 'GET':
        return await handleGet(API_URL, headers);

      case 'PUT':
        return await handlePut(request, API_URL, headers);

      default:
        return NextResponse.json(
          { error: 'Method not allowed' },
          { status: 405 }
        );
    }
  } catch (error) {
    console.error('Error in /api/auth/profile', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : LogMessage.UNKNOWN_ERROR,
      },
      { status: 500 }
    );
  }
}

export const GET = withApiAuthRequired(handler);
export const PUT = withApiAuthRequired(handler);
