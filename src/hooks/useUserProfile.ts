import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../db/firebase";
import { fetchUserProfile } from "../services/fetchUserProfile";
import { UserProfile } from "../types/userProfile";

const useUserProfile = () => {
  const [user] = useAuthState(auth);
  const userId = user?.uid || "";

  const {
    data: userData,
    isLoading,
    error,
    isSuccess,
  } = useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null; // 🔹 Evita ejecutar la consulta si no hay usuario
      return fetchUserProfile(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    currency: userData?.currency || "",
    userData,
    isLoading,
    isSuccess,
    error,
  };
};

export default useUserProfile;
