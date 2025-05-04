import { BINDINGS_VALIDATION, isForbiddenError, isUserNotFoundError } from "@/api";
import { LoginForm as LoginFormComponent } from "@/components/forms";
import { useCreateSession } from "@/hooks";
import { i18nPKG } from "@/shared/i18n";

import { FC, MouseEventHandler } from "react";

import { useForm } from "@tanstack/react-form";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export interface LoginFormProps {
  /**
   * The action used to switch to the reset password form.
   */
  resetPasswordAction: MouseEventHandler<HTMLButtonElement>;
  /**
   * The action used to switch to the register form.
   */
  registerAction: MouseEventHandler<HTMLButtonElement>;
  /**
   * Action to run after successful login.
   */
  onLogin: () => void;
}

type FormTFunction = TFunction<readonly ["login", "input"]>;

/**
 * Extends the original form with translated error messages.
 */
const formValidator = (t: FormTFunction) =>
  z.object({
    email: z
      .string()
      .min(
        BINDINGS_VALIDATION.EMAIL.MIN,
        t("input:text.errors.tooShort", {
          count: BINDINGS_VALIDATION.EMAIL.MIN,
          field: t("login:fields.email.errors.field"),
        })
      )
      .max(
        BINDINGS_VALIDATION.EMAIL.MAX,
        t("input:text.errors.tooLong", {
          count: BINDINGS_VALIDATION.EMAIL.MAX,
          field: t("login:fields.email.errors.field"),
        })
      )
      .email(t("login:fields.email.errors.invalid")),
    password: z
      .string()
      .min(
        BINDINGS_VALIDATION.PASSWORD.MIN,
        t("input:text.errors.tooShort", {
          count: BINDINGS_VALIDATION.EMAIL.MIN,
          field: t("login:fields.password.errors.field"),
        })
      )
      .max(
        BINDINGS_VALIDATION.PASSWORD.MAX,
        t("input:text.errors.tooLong", {
          count: BINDINGS_VALIDATION.EMAIL.MAX,
          field: t("login:fields.password.errors.field"),
        })
      ),
  });

/**
 * Handle error from login form submit. Properly sets field errors for tanstack depending on the returned value.
 */
const handleSubmitError = (t: FormTFunction) => (error: any) => {
  if (isForbiddenError(error)) {
    return {
      fields: { password: t("login:fields.password.errors.invalid") },
    };
  }

  if (isUserNotFoundError(error)) {
    return {
      fields: { email: t("login:fields.email.errors.notFound") },
    };
  }

  return t("login:form.errors.generic");
};

export const LoginForm: FC<LoginFormProps> = ({ resetPasswordAction, registerAction, onLogin }) => {
  const { t } = useTranslation(["login", "input"], { i18n: i18nPKG });

  const createSession = useCreateSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: formValidator(t),
      // Tanstack does not officially support setting field-level errors from the main submit handler.
      // We thus send the form through the onSubmitAsync validator (this normally only runs after successful
      // onSubmit). This allows us to set field-level errors according to the server response.
      //
      // More information on this topic.
      // https://github.com/TanStack/form/discussions/623
      onSubmitAsync: ({ value }) =>
        createSession
          .mutateAsync(value)
          .then(() => null)
          .catch(handleSubmitError(t)),
    },
    onSubmit: onLogin,
  });

  console.log(form.state);

  return <LoginFormComponent form={form} resetPasswordAction={resetPasswordAction} registerAction={registerAction} />;
};
