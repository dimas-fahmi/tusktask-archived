import { useMutation } from "@tanstack/react-query";
import { createBrowserClient } from "../../supabase/instances/client";
import { UserMetadata } from "../../types/supabase";

export const useMutateUserMetadata = () => {
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
  });
};
