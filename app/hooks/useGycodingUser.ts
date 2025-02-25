import type { User, UserUpdateData } from "../types/user";
import { getUser, updateUser } from "../service/user";
import useSWR, { mutate } from "swr";
import { useState } from "react";

interface useGYUser {
  data: User | undefined;
  isLoading: boolean;
  error: any;
  update: (data: UserUpdateData) => Promise<void>;
  isLoadingUpdate: boolean;
}

export function useGycodingUser(): useGYUser {
  const { data, isLoading, error } = useSWR("/api/auth/get", getUser);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const update = async (updateData: UserUpdateData) => {
    setIsLoadingUpdate(true);
    try {
      const updatedUser = await updateUser(updateData);
      await mutate("/api/auth/get", async () => await getUser(), {
        revalidate: true,
      });
    } catch (err) {
      console.error("Failed to update user:", err);
      throw err;
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    update,
    isLoadingUpdate,
  };
}
