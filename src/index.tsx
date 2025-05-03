import {
  SessionPrivateSuspense,
  SessionPrivateSuspenseProps,
  SessionProvider,
  SessionSuspense,
  SyncI18n,
  SyncSessionClaims,
} from "./contexts";

import { ComponentProps, ComponentType, FC, ReactNode } from "react";

export * from "./api";
export * from "./hooks";
export { useSession, useAccessToken } from "./contexts";

export const AuthPlatformProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <SyncI18n />
    <SessionProvider>
      <SyncSessionClaims />
      <SessionSuspense>{children}</SessionSuspense>
    </SessionProvider>
  </>
);

export const withPrivateSession = (
  Component: ComponentType,
  formProps: Omit<SessionPrivateSuspenseProps, "children">
) => {
  const WrappedComponent = (props: ComponentProps<typeof Component>) => (
    <SessionPrivateSuspense {...formProps}>
      <Component {...props} />
    </SessionPrivateSuspense>
  );

  WrappedComponent.displayName = `withPrivateSession(${Component.displayName})`;
  return WrappedComponent;
};
