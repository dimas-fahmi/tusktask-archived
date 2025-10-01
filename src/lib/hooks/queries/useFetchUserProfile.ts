import { useSession } from "../auth/useAuth";
import { useFetchProfile } from "./useFetchProfile";

export const useFetchUserProfile = () => {
  // Get Session
  const { data: session, isFetching: isFetchingSession } = useSession();

  // Start Fetching When
  const startFetching =
    session && session?.user?.id && !isFetchingSession ? true : false;

  // Query Profile
  const query = useFetchProfile(
    {
      id: session?.user?.id,
    },
    startFetching
  );

  return query;
};
