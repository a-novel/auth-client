import { RequestPasswordResetForm as ResetPasswordFormType } from "@/api";
import { FORM_WIDTH } from "@/components/forms/common";
import { EmailInput, RenderTanstackFormErrors } from "@/components/inputs";
import { i18nPKG } from "@/shared/i18n";

import { ContainerSX, FONTS, InfoBox, SPACINGS } from "@a-novel/neon-ui";

import { MouseEventHandler } from "react";

import { MarkEmailReadOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { FormAsyncValidateOrFn, FormValidateOrFn, ReactFormExtendedApi } from "@tanstack/react-form";
import { Trans, useTranslation } from "react-i18next";
import { z } from "zod";

export interface ResetPasswordFormProps<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TSubmitMeta,
> {
  form: ReactFormExtendedApi<
    z.infer<typeof ResetPasswordFormType>,
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
  loginAction: MouseEventHandler<HTMLButtonElement>;
}

export const ResetPasswordForm = <
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof ResetPasswordFormType>>,
  TSubmitMeta,
>({
  form,
  loginAction,
}: ResetPasswordFormProps<
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
  const { t } = useTranslation("resetPassword", { i18n: i18nPKG });

  if (form.state.isSubmitSuccessful) {
    return (
      <Stack
        alignItems="stretch"
        direction="column"
        gap={SPACINGS.XLARGE}
        padding={SPACINGS.SMALL}
        width={FORM_WIDTH}
        maxWidth="100%"
      >
        <InfoBox icon={<MarkEmailReadOutlined />} color="success">
          <Typography variant="h6">{t("resetPassword:success.title")}</Typography>
          <Typography>
            <Trans
              i18n={i18nPKG}
              ns="resetPassword"
              i18nKey="resetPassword:success.content"
              values={{ mail: form.state.values.email }}
            />
            <br />
            <br />
            <i>{t("resetPassword:success.signature")}</i>
          </Typography>
        </InfoBox>

        <Button variant="text" type="button" color="primary" onClick={loginAction}>
          {t("resetPassword:form.backToLogin.action")}
        </Button>
      </Stack>
    );
  }

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
          {t("resetPassword:title")}
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
                label={t("resetPassword:fields.email.label")}
                placeholder={t("resetPassword:fields.email.placeholder")}
              />
            )}
          </form.Field>

          <div style={{ height: SPACINGS.MEDIUM }} />

          <Button color="primary" variant="gradient-glow" type="submit" disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? t("resetPassword:form.submitting") : t("resetPassword:form.submit")}
          </Button>

          <Stack direction="row" justifyContent="center" gap={SPACINGS.SMALL}>
            <Button variant="text" type="button" color="primary" onClick={loginAction}>
              {t("resetPassword:form.backToLogin.action")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <RenderTanstackFormErrors form={form} />
    </Stack>
  );
};
