import { BINDINGS_VALIDATION, LangEnum } from "@/api";
import { ResetPasswordForm, ResetPasswordFormProps } from "@/components/forms";

import { FC } from "react";

import { Meta, StoryObj } from "@storybook/react";
import { FormApi, useForm } from "@tanstack/react-form";

const RenderComponents: FC<ResetPasswordFormProps<any, any, any, any, any, any, any, any, any>> = (props) => {
  const form = useForm({
    defaultValues: {
      email: props.form.state.values.email,
      lang: LangEnum.En,
    },
  });

  form.store.state.isSubmitting = props.form.store.state.isSubmitting;
  form.store.state.isSubmitSuccessful = props.form.store.state.isSubmitSuccessful;
  form.store.state.errors = props.form.store.state.errors;

  // Hijack the function responsible from triggering form changes, so the UI is not interactive.
  const InitialFormField = form.Field;
  form.Field = function HijackedField({ children, ...fieldProps }) {
    return (
      <InitialFormField {...fieldProps}>
        {(field) => {
          field.handleChange = () => {};
          /* eslint-disable react/prop-types */
          field.store.state.meta = props.form.state.fieldMeta[field.name] ?? field.store.state.meta;
          /* eslint-disable react/prop-types */
          field.form.store.state.isSubmitting = props.form.store.state.isSubmitting;
          return children(field);
        }}
      </InitialFormField>
    );
  };
  return <ResetPasswordForm form={form} loginAction={() => null} />;
};

const meta: Meta<typeof ResetPasswordForm> = {
  component: ResetPasswordForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    form: { control: { disable: true } },
  },
  tags: ["autodocs"],
  render: (args) => <RenderComponents {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    form: new FormApi({
      defaultValues: {
        email: "",
      },
    }),
  },
};

export const WithValues: Story = {
  args: {
    form: new FormApi({
      defaultValues: {
        email: "user@provider.com",
      },
    }),
  },
};

export const ValuesTooLong: Story = {
  args: {
    form: new FormApi({
      defaultValues: {
        email: String("a").repeat(BINDINGS_VALIDATION.EMAIL.MAX),
      },
    }),
  },
};

export const FieldErrors: Story = {
  args: {
    form: (() => {
      const api = new FormApi({
        defaultValues: {
          email: "user@provider.com",
        },
      });

      api.store.state.fieldMeta = {
        email: {
          errors: ["The email does not comply with our requirements."],
          errorSourceMap: {},
          isValid: false,
          isTouched: true,
          isDirty: true,
          isBlurred: false,
          errorMap: {},
          isValidating: false,
          isPristine: false,
        },
      };

      return api;
    })(),
  },
};

export const Submitting: Story = {
  args: {
    form: (() => {
      const api = new FormApi({
        defaultValues: {
          email: "user@provider.com",
        },
      });

      api.store.state.isSubmitting = true;

      return api;
    })(),
  },
};

export const FieldsValidating: Story = {
  args: {
    form: (() => {
      const api = new FormApi({
        defaultValues: {
          email: "user@provider.com",
        },
      });

      api.store.state.fieldMeta = {
        email: {
          errors: [],
          errorSourceMap: {},
          isValid: false,
          isTouched: true,
          isDirty: true,
          isBlurred: false,
          errorMap: {},
          isValidating: true,
          isPristine: false,
        },
      };

      return api;
    })(),
  },
};

export const ResetPasswordError: Story = {
  args: {
    form: (() => {
      const api = new FormApi({
        defaultValues: {
          email: "user@provider.com",
        },
      });

      // @ts-ignore
      api.store.state.errors = ["An unexpected error occurred, please retry later."];

      return api;
    })(),
  },
};

export const Success: Story = {
  args: {
    form: (() => {
      const api = new FormApi({
        defaultValues: {
          email: "user@provider.com",
        },
      });

      // @ts-ignore
      api.store.state.isSubmitSuccessful = true;

      return api;
    })(),
  },
};
