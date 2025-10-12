import { useSession } from "../auth/useAuth";
import { useFetchProfile } from "./useFetchProfile";

export const useFetchUserProfile = () => {
  // Get Session
  const { data: session, isFetching: isFetchingSession } = useSession();

  // Start Fetching When
  const startFetching = !!session?.user?.id && !isFetchingSession;

  // Query Profile
  const query = useFetchProfile(
    {
      id: session?.user?.id,
    },
    startFetching,
  );

  return query;
};
