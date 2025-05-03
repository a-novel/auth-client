import { isUnauthorizedError } from "@/api";
import { useAccessToken, useSession } from "@/contexts/session";
import { useCheckSession, useCreateAnonymousSession } from "@/hooks";
import { i18nPKG } from "@/shared/i18n";

import { StatusPage } from "@a-novel/neon-ui";

import { FC, ReactNode, useCallback, useEffect, useRef } from "react";

import { HeartBrokenOutlined, RssFeedOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export interface SessionSuspenseProps {
  children?: ReactNode;
}

const LOGIN_ATTEMPTS_INTERVAL = 1000; // 1 second

/**
 * Hold the rendering of the children until a proper session is available. If no session is available locally,
 * a new anonymous session is created.
 *
 * The session status is refreshed on a regular basis, plus everytime a children node encounters a session
 * error (401). In such case, the session is refreshed and the children are re-rendered.
 */
export const SessionSuspense: FC<SessionSuspenseProps> = ({ children }) => {
  const { t } = useTranslation("session", { i18n: i18nPKG });

  const queryClient = useQueryClient();

  const session = useCheckSession();
  const { synced } = useSession();
  const accessToken = useAccessToken();
  const { mutate: doLogin, ...createAnonymousSession } = useCreateAnonymousSession();

  // Prevent concurrent updates by blocking further updates for a given timeframe.
  const lastUpdate = useRef(0);

  const login = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdate.current < LOGIN_ATTEMPTS_INTERVAL) return;

    lastUpdate.current = now;
    doLogin();
  }, [doLogin]);

  // Services should return a 401 status code to indicate missing / invalid session. When this happens, we
  // trigger a new session update.
  useEffect(() => {
    queryClient.getQueryCache().subscribe((event) => {
      if (isUnauthorizedError(event.query.state.error)) login();
    });
  }, [queryClient, login]);

  // Same logic as above but for mutations (react query has a separate cache for both).
  useEffect(() => {
    queryClient.getMutationCache().subscribe((event) => {
      if (isUnauthorizedError(event.mutation?.state.error)) login();
    });
  }, [queryClient, login]);

  // Login with an anonymous if no session is available.
  useEffect(() => {
    if (synced && !accessToken && !createAnonymousSession.isError && !createAnonymousSession.isPending) login();
  }, [login, accessToken, createAnonymousSession.isError, createAnonymousSession.isPending, synced]);

  // Rendering.

  if (createAnonymousSession.isError || (!session.isPending && session.isError)) {
    return (
      <StatusPage
        icon={<HeartBrokenOutlined />}
        color="error"
        footer={
          <Button color="error" onClick={() => login()}>
            {t("session:actions.retry")}
          </Button>
        }
      >
        <Typography>{t("session:status.error")}</Typography>
      </StatusPage>
    );
  }

  if (!accessToken) {
    return (
      <StatusPage color="primary" icon={<RssFeedOutlined />}>
        <Typography>{t("session:status.loading")}</Typography>
      </StatusPage>
    );
  }

  return children;
};
