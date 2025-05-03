import { RequestRegistrationForm as RequestRegistrationFormType } from "@/api";
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

export interface RegisterFormProps<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TSubmitMeta,
> {
  form: ReactFormExtendedApi<
    z.infer<typeof RequestRegistrationFormType>,
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

export const RequestRegistrationForm = <
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationFormType>>,
  TSubmitMeta,
>({
  form,
  loginAction,
}: RegisterFormProps<
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
  const { t } = useTranslation("register", { i18n: i18nPKG });

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
          <Typography variant="h6">{t("register:success.title")}</Typography>
          <Typography>
            <Trans
              i18n={i18nPKG}
              ns="register"
              i18nKey="register:success.content"
              values={{ mail: form.state.values.email }}
            />
            <br />
            <br />
            <i>{t("register:success.signature")}</i>
          </Typography>
        </InfoBox>

        <Button variant="text" type="button" color="primary" onClick={loginAction}>
          {t("register:form.toLogin.action")}
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
          {t("register:title")}
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
                label={t("register:fields.email.label")}
                placeholder={t("register:fields.email.placeholder")}
              />
            )}
          </form.Field>

          <div style={{ height: SPACINGS.MEDIUM }} />

          <Button color="primary" variant="gradient-glow" type="submit" disabled={form.state.isSubmitting}>
            {form.state.isSubmitting ? t("register:form.submitting") : t("register:form.submit")}
          </Button>

          <Stack direction="row" justifyContent="center" gap={SPACINGS.SMALL}>
            <Typography component="label">{t("register:form.login.label")}</Typography>
            <Button variant="text" type="button" color="primary" onClick={loginAction}>
              {t("register:form.login.action")}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <RenderTanstackFormErrors form={form} />
    </Stack>
  );
};
