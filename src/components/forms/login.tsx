import { LoginForm as LoginFormType } from "@/api";
import { FORM_WIDTH } from "@/components/forms/common";
import { EmailInput, PasswordInput, RenderTanstackFormErrors } from "@/components/inputs";
import { i18nPKG } from "@/shared/i18n";

import { ContainerSX, FONTS, SPACINGS } from "@a-novel/neon-ui";

import { MouseEventHandler } from "react";

import { Button, Stack, Typography } from "@mui/material";
import { FormAsyncValidateOrFn, FormValidateOrFn, ReactFormExtendedApi } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export interface LoginFormProps<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TSubmitMeta,
> {
  form: ReactFormExtendedApi<
    z.infer<typeof LoginFormType>,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >;
  resetPasswordAction: MouseEventHandler<HTMLButtonElement>;
  registerAction: MouseEventHandler<HTMLButtonElement>;
}

export const LoginForm = <
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginFormType>>,
  TSubmitMeta,
>({
  form,
  resetPasswordAction,
  registerAction,
}: LoginFormProps<
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnServer,
  TSubmitMeta
>) => {
  const { t } = useTranslation("login", { i18n: i18nPKG });

  return (
    <Stack
      alignItems="stretch"
      direction="column"
      gap={SPACINGS.XLARGE}
      padding={SPACINGS.SMALL}
      width={FORM_WIDTH}
      maxWidth="100%"
    >
      <Stack
        alignItems="stretch"
        direction="column"
        spacing={SPACINGS.LARGE}
        padding={SPACINGS.LARGE}
        borderRadius={SPACINGS.MEDIUM}
        sx={ContainerSX}
      >
        <Typography
          textAlign="center"
          fontFamily={FONTS.BUNGEE}
          variant="h2"
          component="h1"
          margin={0}
          padding={0}
          color="primary"
        >
          {t("login:title")}
        </Typography>
        <Stack
          component="form"
          direction="column"
          spacing={SPACINGS.MEDIUM}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit().catch(console.error);
          }}
        >
          <form.Field name="email">
            {(field) => (
              <EmailInput
                field={field}
                label={t("login:fields.email.label")}
                placeholder={t("login:fields.email.placeholder")}
              />
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <PasswordInput
                field={field}
                label={t("login:fields.password.label")}
                helperText={
                  <>
                    {t("login:fields.password.helper.text")}
                    <Button variant="text" type="button" color="primary" onClick={resetPasswordAction}>
                      {t("login:fields.password.helper.action")}
                    </Button>
                  </>
                }
              />
            )}
          </form.Field>

          <div style={{ height: SPACINGS.MEDIUM }} />

          <Button color="primary" variant="gradient-glow" type="submit" disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? t("login:form.submitting") : t("login:form.submit")}
          </Button>

          <Stack direction="row" justifyContent="center" gap={SPACINGS.SMALL}>
            <Typography component="label">{t("login:form.register.label")}</Typography>
            <Button variant="text" type="button" color="primary" onClick={registerAction}>
              {t("login:form.register.action")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <RenderTanstackFormErrors form={form} />
    </Stack>
  );
};
