import { genericSetup } from "#/utils/setup";
import { StandardWrapper } from "#/utils/wrapper";

import { SESSION_STORAGE_KEY, SessionProvider } from "@/contexts/session";
import { SessionPrivateSuspense } from "@/contexts/session.private.suspense";
import { MockSession } from "@/contexts/session.test";
import { AuthFormProps } from "@/forms";

import { render, waitFor } from "@testing-library/react";
import { it, describe, expect, vi } from "vitest";

vi.mock("@/forms", async (importOriginal: () => any) => {
  const original = await importOriginal();

  return {
    ...(original as any),
    AuthForm: ({ show }: AuthFormProps) => (show ? <div>Auth Form</div> : null),
  };
});

describe("session private provider", () => {
  genericSetup({});

  it("renders login form when not authenticated", async () => {
    const screen = render(
      <SessionProvider>
        <SessionPrivateSuspense>
          <div>Hello world!</div>
        </SessionPrivateSuspense>
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    await waitFor(() => {
      expect(screen.queryByText("Auth Form")).not.toBeNull();
      expect(screen.queryByText("Hello world!")).toBeNull();
    });
  });

  it("renders children when authenticated", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

    const screen = render(
      <SessionProvider>
        <SessionPrivateSuspense>
          <div>Hello world!</div>
        </SessionPrivateSuspense>
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    await waitFor(() => {
      expect(screen.queryByText("Auth Form")).toBeNull();
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  it("renders login form when authenticated anonymously", async () => {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        accessToken: "access-token",
      })
    );

    const screen = render(
      <SessionProvider>
        <SessionPrivateSuspense>
          <div>Hello world!</div>
        </SessionPrivateSuspense>
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    await waitFor(() => {
      expect(screen.queryByText("Auth Form")).not.toBeNull();
      expect(screen.queryByText("Hello world!")).toBeNull();
    });
  });
});
