import type { UsersEmailResendPostRequest } from "@/app/api/users/email/[email]/resend/post";
import { useMutation } from "@tanstack/react-query";
import { APP_URL } from "../../configs";

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async ({
      email,
      type,
    }: {
      email: string;
      type: UsersEmailResendPostRequest["type"];
    }) => {
      // Get Origin
      const origin = APP_URL;

      if (!origin) {
        throw new Error("MISSING_ORIGIN_VARIABLE_ON_ENV");
      }

      const response = await fetch(
        `${origin}/api/users/email/${encodeURIComponent(email)}/resend`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ type }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result;
    },
  });
};
