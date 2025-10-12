import { useMutation } from "@tanstack/react-query";
import { createBrowserClient } from "../../supabase/instances/client";
import type { UserMetadata } from "../../types/supabase";
import { useSession } from "../auth/useAuth";

export const useMutateUserMetadata = () => {
  const { refetch: refetchSession } = useSession();

  return useMutation({
    mutationFn: async (req: UserMetadata) => {
      const supabase = createBrowserClient();

      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...req,
        },
      });

      if (error) {
        throw error;
      }

      return data;
    },
    onSettled: () => {
      // Always refetch session
      refetchSession();
    },
  });
};
