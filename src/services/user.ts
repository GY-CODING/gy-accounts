import { UserProfile } from '@gycoding/nebula';

export async function getUser(): Promise<UserProfile> {
  try {
    const response = await fetch('/api/auth/profile');

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    const user: UserProfile = data;
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function updateUser(data: UserProfile) {
  try {
    const response = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update user data');
    }

    const updatedUser = await response.json();
    return updatedUser.gyCodingData;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}

export async function updateApiKey() {
  try {
    const response = await fetch('/api/auth/apikey', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update API KEY');
    }

    const updatedApiKey = await response.json();
    return updatedApiKey;
  } catch (error) {
    console.error('Error updating api key:', error);
    throw error;
  }
}
