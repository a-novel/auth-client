import { checkSession, createAnonymousSession, createSession, newRefreshToken, refreshSession } from "@/api";
import { useAccessToken, useSession } from "@/contexts";

import { useMutation, useQuery } from "@tanstack/react-query";

const sessionDataQueryKey = (token: string) => ["session", "check", { token }];

// =====================================================================================================================
// MUTATIONS
// =====================================================================================================================

export const useCreateSession = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: createSession,
    mutationKey: ["session", "create"],
    // Reset the other session data, such as claims.
    onSuccess: (res) => setSession({ accessToken: res.accessToken }),
  });
};

export const useCreateAnonymousSession = () => {
  const { setSession } = useSession();

  return useMutation({
    mutationFn: createAnonymousSession,
    mutationKey: ["session", "create"],
    // Reset the other session data, such as claims.
    onSuccess: (res) => setSession({ accessToken: res.accessToken }),
    retry: 2,
    retryDelay: 500,
  });
};

export const useRefreshSession = () => {
  const { session, setSession } = useSession();

  return useMutation({
    mutationFn: () =>
      refreshSession({ accessToken: session?.accessToken ?? "", refreshToken: session?.refreshToken ?? "" }),
    mutationKey: ["session", "refresh"],
    onSuccess: (res) => setSession((prevSession) => ({ ...prevSession, accessToken: res.accessToken })),
  });
};

export const useNewRefreshToken = () => {
  const { session, setSession } = useSession();

  return useMutation({
    mutationFn: () => newRefreshToken(session?.accessToken ?? ""),
    mutationKey: ["session", "new-refresh-token"],
    onSuccess: (res) => setSession((prevSession) => ({ ...prevSession, refreshToken: res })),
  });
};

// =====================================================================================================================
// QUERIES
// =====================================================================================================================

export const useCheckSession = () => {
  const accessToken = useAccessToken();

  return useQuery({
    queryFn: () => checkSession(accessToken),
    enabled: !!accessToken,
    queryKey: sessionDataQueryKey(accessToken),
    retry: 3,
    retryDelay: 1000,
  });
};
