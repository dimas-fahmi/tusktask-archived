import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AuthResponse,
  oAuthSignIn,
  signIn,
  signOut,
} from "../../supabase/auth/actions";
import { useEffect } from "react";
import { createBrowserClient } from "../../supabase/instances/client";
import { useRouter } from "next/navigation";

// Session
export const useSession = () => {
  // Create Supabase Client
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  // Query session
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => supabase.auth.getSession(),
    refetchOnWindowFocus: false,
  });

  // Subscribe to auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      sessionQuery.refetch();
    });

    return () => subscription.unsubscribe();
  }, [queryClient, supabase, sessionQuery]);

  return sessionQuery;
};

// SignIn With Email & Password
export const useSignIn = () => {
  // Init Query Client
  const queryClient = useQueryClient();

  // Init Router
  const router = useRouter();

  // Mutation
  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await signIn(email, password);

      if (!response?.success) {
        throw response;
      }

      return response;
    },
    onMutate: () => {
      // Reset parameters
      router.replace("/auth");
    },
    onSuccess: () => {
      // Sent back to homepage
      //  TODO: Sent to last request pathname (low)
      router.push("/");
    },
    onError: (error: AuthResponse) => {
      // Sent error to auth page
      router.replace(
        `/auth?code=${error?.code ?? "unknown_error"}&message=${encodeURIComponent(error?.message ?? "Unknown error")}`
      );
    },
    onSettled: () => {
      // Invalidate Session
      queryClient.invalidateQueries({
        queryKey: ["auth", "session"],
      });
    },
  });

  return signInMutation;
};

// SignIn with oAuth
export const useOAuth = () => {
  // Init Query Client
  const queryClient = useQueryClient();

  // Init router
  const router = useRouter();

  return useMutation({
    mutationFn: oAuthSignIn,
    onError: (error: AuthResponse) => {
      // Sent error to auth page
      router.replace(
        `/auth?code=${error?.code ?? "unknown_error"}&message=${encodeURIComponent(error?.message ?? "Unknown error")}`
      );
    },
    onSettled: () => {
      // Invalidate session
      queryClient.invalidateQueries({
        queryKey: ["auth", "session"],
      });
    },
  });
};

// SignOut
export const useSignOut = () => {
  // Init Query client
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      // Invalidate session
      queryClient.invalidateQueries({
        queryKey: ["auth", "session"],
      });
    },
  });
};

// Bundle
const useAuth = () => {
  return { useSession, useSignIn, useSignOut, useOAuth };
};

export default useAuth;
