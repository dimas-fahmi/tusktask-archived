import type { UsersProfilesPatchRequest } from "@/app/api/users/profiles/patch";
import { useMutation } from "@tanstack/react-query";

export const useMutateUserProfile = () => {
  return useMutation({
    mutationFn: async (req: UsersProfilesPatchRequest) => {
      const response = await fetch("/api/users/profiles", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(req),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
  });
};
