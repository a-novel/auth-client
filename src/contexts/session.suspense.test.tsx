import { MockQueryClient } from "#/mocks/query_client";
import "#/mocks/react_it18next";
import { genericSetup } from "#/utils/setup";
import { QueryWrapper } from "#/utils/wrapper";

import { UnauthorizedError } from "@/api";
import { SessionSuspense } from "@/contexts";
import { SESSION_STORAGE_KEY, SessionProvider } from "@/contexts/session";
import { MockSession } from "@/contexts/session.test";

import { useEffect } from "react";

import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { act, render, renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, expect, it } from "vitest";

let nockAPI: nock.Scope;

describe("session suspense", () => {
  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("loads a session initially, if none is present", async () => {
    const nockLogin = nockAPI.put("/session/anon").reply(200, {
      accessToken: "access-token",
    });

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockLogin.done();
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  it("does nothing, if an initial session is present", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it("does not render until session is available", async () => {
    const nockLogin = nockAPI.put("/session/anon").delay(500).reply(200, {
      accessToken: "access-token",
    });

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(() => {
      expect(screen.queryByText(/session:status\.loading/)).not.toBeNull();
      expect(screen.queryByText("Hello world!")).toBeNull();
    });

    await waitFor(
      () => {
        nockLogin.done();
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  it("renders an error on login error", async () => {
    const nockLogin = nockAPI
      // Default behavior is to retry 3 times.
      .put("/session/anon")
      .reply(500)
      .put("/session/anon")
      .reply(500)
      .put("/session/anon")
      .reply(500);

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockLogin.done();
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.queryByText(/session:status\.error/)).not.toBeNull();
      expect(screen.queryByText("Hello world!")).toBeNull();
    });

    const retryButton = screen.getByRole("button", { name: /session:actions\.retry/ });

    const nockLoginRetry = nockAPI.put("/session/anon").reply(200, {
      accessToken: "access-token",
    });

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    act(() => {
      retryButton.click();
    });

    await waitFor(() => {
      nockLoginRetry.done();
      nockSession.done();
    });

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  describe("retries login", () => {
    const cases: Record<
      string,
      {
        useTriggerRetry: (initialProps: any) => any;
      }
    > = {
      "on query error": {
        useTriggerRetry: () =>
          useQuery({
            queryKey: ["test", "unauthorized"],
            queryFn: () => {
              throw new UnauthorizedError("401");
            },
          }),
      },
      "on mutation error": {
        useTriggerRetry: () => {
          const { mutate } = useMutation({
            mutationKey: ["test", "unauthorized"],
            mutationFn: () => {
              throw new UnauthorizedError("401");
            },
          });

          useEffect(() => {
            mutate();
          }, [mutate]);
        },
      },
      "on concurrent errors": {
        useTriggerRetry: () => {
          const { mutate } = useMutation({
            mutationKey: ["test", "unauthorized"],
            mutationFn: () => {
              throw new UnauthorizedError("401");
            },
          });

          useEffect(() => {
            mutate();
          }, [mutate]);

          useQuery({
            queryKey: ["test", "unauthorized", "query-1"],
            queryFn: () => {
              throw new UnauthorizedError("401");
            },
          });

          useQuery({
            queryKey: ["test", "unauthorized", "query-2"],
            queryFn: () => {
              throw new UnauthorizedError("401");
            },
          });
        },
      },
    };

    for (const [name, data] of Object.entries(cases)) {
      it(name, async () => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

        let nockSession = nockAPI
          .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
          .reply(200, {
            userID: "00000000-0000-0000-0000-000000000001",
            roles: ["auth:anon"],
          });

        const queryClient = new QueryClient(MockQueryClient);

        const screen = render(
          <SessionProvider>
            <SessionSuspense>
              <div>Hello world!</div>
            </SessionSuspense>
          </SessionProvider>,
          { wrapper: QueryWrapper(queryClient) }
        );

        await waitFor(
          () => {
            nockSession.done();
          },
          { timeout: 2000 }
        );

        await waitFor(
          () => {
            expect(screen.queryByText("Hello world!")).not.toBeNull();
          },
          { timeout: 2000 }
        );

        const nockLogin = nockAPI.put("/session/anon").reply(200, {
          accessToken: "new-access-token",
        });

        nockSession = nockAPI
          .get("/session", undefined, { reqheaders: { Authorization: "Bearer new-access-token" } })
          .reply(200, {
            userID: "00000000-0000-0000-0000-000000000002",
            roles: ["auth:anon"],
          });

        renderHook(data.useTriggerRetry, {
          wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
        });

        await waitFor(() => {
          nockLogin.done();
          nockSession.done();
        });

        await waitFor(() => {
          expect(screen.queryByText("Hello world!")).not.toBeNull();
        });
      });
    }
  });
});
