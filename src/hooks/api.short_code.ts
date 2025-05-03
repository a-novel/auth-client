import {
  requestEmailUpdate,
  RequestEmailUpdateForm,
  requestPasswordReset,
  RequestPasswordResetForm,
  requestRegistration,
  RequestRegistrationForm,
} from "@/api";
import { useAccessToken } from "@/contexts";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

// =====================================================================================================================
// MUTATIONS
// =====================================================================================================================

export const useRequestRegistration = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof RequestRegistrationForm>) => requestRegistration(accessToken, form),
    mutationKey: ["credentials", "request-registration"],
  });
};

export const useRequestEmailUpdate = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof RequestEmailUpdateForm>) => requestEmailUpdate(accessToken, form),
    mutationKey: ["credentials", "request-email-update"],
  });
};

export const useRequestPasswordReset = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof RequestPasswordResetForm>) => requestPasswordReset(accessToken, form),
    mutationKey: ["credentials", "request-password-reset"],
  });
};
