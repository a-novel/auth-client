import { useSession } from "@/contexts/session";
import { AuthForm, AuthFormProps } from "@/forms";

import { FC, ReactNode } from "react";

export interface SessionPrivateSuspenseProps extends Omit<AuthFormProps, "show"> {
  children?: ReactNode;
}

export const SessionPrivateSuspense: FC<SessionPrivateSuspenseProps> = ({ children, ...props }) => {
  const { session, synced } = useSession();
  const showForm = !session?.claims?.userID;

  // No flashing of the login form during SSR.
  if (!synced) {
    return null;
  }

  return (
    <>
      <AuthForm show={showForm} {...props} />
      {showForm ? null : children}
    </>
  );
};
