import { BINDINGS_VALIDATION } from "@/api";
import { LoginForm, LoginFormProps } from "@/components/forms";

import { FC } from "react";

import { Meta, StoryObj } from "@storybook/react";
import { FormApi, useForm } from "@tanstack/react-form";

const RenderComponents: FC<LoginFormProps<any, any, any, any, any, any, any, any, any>> = (props) => {
  const form = useForm({
    defaultValues: {
      email: props.form.state.values.email,
      password: props.form.state.values.password,
    },
  });

  form.store.state.isSubmitting = props.form.store.state.isSubmitting;
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
  return <LoginForm form={form} registerAction={() => null} resetPasswordAction={() => null} />;
};

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
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
        password: "",
      },
    }),
  },
};

export const WithValues: Story = {
  args: {
    form: new FormApi({
      defaultValues: {
        email: "user@provider.com",
        password: "123456",
      },
    }),
  },
};

export const ValuesTooLong: Story = {
  args: {
    form: new FormApi({
      defaultValues: {
        email: String("a").repeat(BINDINGS_VALIDATION.EMAIL.MAX),
        password: String("a").repeat(BINDINGS_VALIDATION.PASSWORD.MAX),
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
          password: "123456",
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
        password: {
          errors: [
            "The password does not comply with our requirements.",
            "The password must contain special characters.",
          ],
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
          password: "123456",
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
          password: "123456",
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
        password: {
          errors: [],
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

export const LoginError: Story = {
  args: {
    form: (() => {
      const api = new FormApi({
        defaultValues: {
          email: "user@provider.com",
          password: "123456",
        },
      });

      // @ts-ignore
      api.store.state.errors = ["An unexpected error occurred, please retry later."];

      return api;
    })(),
  },
};
