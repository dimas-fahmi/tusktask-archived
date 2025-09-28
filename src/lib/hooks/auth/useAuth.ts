import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AuthResponse,
  signIn,
  signOut,
  signup,
} from "../../supabase/auth/actions";
import { useEffect } from "react";
import { createBrowserClient } from "../../supabase/instances/client";
import { useRouter } from "next/navigation";
import { AuthProvider, OAUTH_PROVIDERS } from "../../configs";
import { parseAuthError } from "../../utils/parseAuthError";

// Session
export const useSession = () => {
  // Create Supabase Client
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  // Query session
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      return data?.session;
    },
    staleTime: 1000 * 60 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 5,
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
  const { refetch } = useSession();

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
      refetch();
    },
  });

  return signInMutation;
};

// SignIn with oAuth
export const useOAuth = () => {
  // Init Query Client
  const { refetch } = useSession();

  // Init router
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      provider,
      params,
    }: {
      provider: AuthProvider;
      params?: string;
    }): Promise<AuthResponse> => {
      // Create Client
      const supabase = createBrowserClient();

      // Validate
      if (!OAUTH_PROVIDERS.includes(provider)) {
        return {
          success: false,
          code: "bad_request",
          message: "Invalid oAuth provider",
        };
      }

      // Request
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback${params ? `?${params}` : ""}`,
        },
      });

      if (error) {
        return parseAuthError(error);
      }

      return {
        success: true,
        code: "success",
        message: "Successfully signed in",
      };
    },
    onError: (error: AuthResponse) => {
      // Sent error to auth page
      router.replace(
        `/auth?code=${error?.code ?? "unknown_error"}&message=${encodeURIComponent(error?.message ?? "Unknown error")}`
      );
    },
    onSettled: () => {
      // Invalidate session
      refetch();
    },
  });
};

// SignUp
export const useSignUp = () => {
  // Init Router
  const router = useRouter();

  return useMutation({
    mutationFn: async (req: {
      email: string;
      password: string;
      passwordConfirmation: string;
    }) => {
      const response = await signup(req);

      if (!response?.success) {
        throw response;
      }

      return response;
    },
    onError: (error: AuthResponse) => {
      router.push(
        `/auth/register?code=${error?.code ?? "unknown_error"}&message=${encodeURIComponent(error?.message ?? "Unknown error")}`
      );
    },
    onSuccess: (_data, request) => {
      router.push(
        `/auth/email/confirmation?code=success&message=${encodeURIComponent("Welcome to TuskTask")}&email=${request.email}`
      );
    },
  });
};

// SignOut
export const useSignOut = () => {
  // Session
  const { refetch } = useSession();

  // Router
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      // Refetch Session
      refetch();

      // Refresh
      router.refresh();
    },
  });
};

// Bundle
const useAuth = () => {
  return { useSession, useSignIn, useSignOut, useOAuth, useSignUp };
};

export default useAuth;
