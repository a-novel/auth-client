import {
  createUser,
  emailExists,
  EmailExistsParams,
  RegisterForm,
  resetPassword,
  ResetPasswordForm,
  updateEmail,
  UpdateEmailForm,
  updatePassword,
  UpdatePasswordForm,
  updateRole,
  UpdateRoleForm,
} from "@/api";
import { useAccessToken } from "@/contexts";

import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";

// =====================================================================================================================
// MUTATIONS
// =====================================================================================================================

export const useCreateUser = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof RegisterForm>) => createUser(accessToken, form),
    mutationKey: ["credentials", "create"],
  });
};

export const useUpdateEmail = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof UpdateEmailForm>) => updateEmail(accessToken, form),
    mutationKey: ["credentials", "update-email"],
  });
};

export const useUpdatePassword = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof UpdatePasswordForm>) => updatePassword(accessToken, form),
    mutationKey: ["credentials", "update-password"],
  });
};

export const useUpdateRole = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof UpdateRoleForm>) => updateRole(accessToken, form),
    mutationKey: ["credentials", "update-role"],
  });
};

export const useResetPassword = () => {
  const accessToken = useAccessToken();

  return useMutation({
    mutationFn: (form: z.infer<typeof ResetPasswordForm>) => resetPassword(accessToken, form),
    mutationKey: ["credentials", "reset-password"],
  });
};

// =====================================================================================================================
// QUERIES
// =====================================================================================================================

export const useEmailExists = (params: z.infer<typeof EmailExistsParams>) => {
  const accessToken = useAccessToken();

  return useQuery({
    queryFn: () => emailExists(accessToken, params),
    enabled: !!accessToken,
    queryKey: ["credentials", "email-exists", params, accessToken],
  });
};
