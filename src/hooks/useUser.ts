/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserProfile } from '@gycoding/nebula';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { getUser, updateApiKey, updateUser } from '../services/user';

interface useUserProps {
  data: UserProfile | undefined;
  isLoading: boolean;
  error: Error | null;
  update: (data: UserProfile) => Promise<void>;
  isLoadingUpdate: boolean;
  isErrorUpdate: boolean;
  isUpdated: boolean;
  setIsUpdated: (value: boolean) => void;
  setIsErrorUpdate: (value: boolean) => void;
  refreshApiKey: () => void;
  isUpdatingAPIKEY: boolean;
  isErrorUpdateAPIKEY: boolean;
  isUpdatedAPIKEY: boolean;
  setIsUpdatedAPIKEY: (value: boolean) => void;
  setIsErrorUpdateAPIKEY: (value: boolean) => void;
}

export function useUser(): useUserProps {
  const { data, isLoading, error } = useSWR('/api/auth/profile', getUser);
  const [isErrorUpdate, setIsErrorUpdate] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isUpdatingAPIKEY, setIsUpdatingAPIKEY] = useState(false);
  const [isErrorUpdateAPIKEY, setIsErrorUpdateAPIKEY] = useState(false);
  const [isUpdatedAPIKEY, setIsUpdatedAPIKEY] = useState(false);

  const update = async (updateData: UserProfile) => {
    setIsLoadingUpdate(true);
    try {
      await updateUser(updateData);
      await mutate('/api/auth/profile', async () => await getUser(), {
        revalidate: true,
      });
      setIsUpdated(true);
      setIsErrorUpdate(false);
    } catch (err) {
      console.error('Failed to update user:', err);
      setIsErrorUpdate(true);
      setIsUpdated(false);
      throw err;
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  const refreshApiKey = async () => {
    setIsUpdatingAPIKEY(true);
    try {
      await updateApiKey();
      await mutate('/api/auth/profile', async () => await getUser(), {
        revalidate: true,
      });
      setIsErrorUpdateAPIKEY(false);
      setIsUpdatedAPIKEY(true);
    } catch (err) {
      console.error('Failed to update user:', err);
      setIsErrorUpdateAPIKEY(true);
      setIsUpdatedAPIKEY(false);
      throw err;
    } finally {
      setIsUpdatingAPIKEY(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    update,
    isLoadingUpdate,
    isErrorUpdate,
    setIsErrorUpdate,
    isUpdated,
    setIsUpdated,
    refreshApiKey,
    isErrorUpdateAPIKEY,
    isUpdatedAPIKEY,
    isUpdatingAPIKEY,
    setIsUpdatedAPIKEY,
    setIsErrorUpdateAPIKEY,
  };
}
