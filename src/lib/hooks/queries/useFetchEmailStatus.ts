"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEmailStatus } from "../../utils/fetchers/fetchEmailStatus";
import { emailSchema } from "../../zod/schemas/authSchema";

export const useFetchEmailStatus = (email?: string | null) => {
  const validation = emailSchema.safeParse(email);

  // Prevent fetching if email is invalid
  if (!validation.success) {
    email = null;
  }

  const query = useQuery({
    queryKey: ["email", email],
    queryFn: () => fetchEmailStatus(email),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!email,
    refetchOnWindowFocus: false,
    retry: 0,
  });

  return query;
};
