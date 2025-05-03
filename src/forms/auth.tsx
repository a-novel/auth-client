import { FormPage, FormPageProps } from "@/components/pages";
import { LoginForm, RegisterForm, ResetPasswordForm } from "@/forms";
import { i18nPKG } from "@/shared/i18n";

import { FC, useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

export interface AuthFormProps extends Omit<FormPageProps, "children"> {
  show?: boolean;
  setTitle?: (title: string | undefined) => void;
}

export const AuthForm: FC<AuthFormProps> = ({ show, setTitle, ...props }) => {
  const { t } = useTranslation("form", { i18n: i18nPKG });

  const [form, setForm] = useState<"login" | "register" | "resetPassword">();

  const toLoginForm = useCallback(() => setForm("login"), []);
  const toRegisterForm = useCallback(() => setForm("register"), []);
  const toResetPasswordForm = useCallback(() => setForm("resetPassword"), []);
  const closeForm = useCallback(() => setForm(undefined), []);

  useEffect(() => {
    setForm(show ? "login" : undefined);
  }, [show]);

  useEffect(() => {
    setTitle?.(show ? t(`form:title.${form}`) : undefined);
  }, [t, form, show, setTitle]);

  if (form === "login") {
    return (
      <FormPage {...props}>
        <LoginForm resetPasswordAction={toResetPasswordForm} registerAction={toRegisterForm} onLogin={closeForm} />
      </FormPage>
    );
  }

  if (form === "register") {
    return (
      <FormPage {...props}>
        <RegisterForm loginAction={toLoginForm} />
      </FormPage>
    );
  }

  if (form === "resetPassword") {
    return (
      <FormPage {...props}>
        <ResetPasswordForm loginAction={toLoginForm} />
      </FormPage>
    );
  }

  return null;
};
