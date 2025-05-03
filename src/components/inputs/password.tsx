import { BINDINGS_VALIDATION } from "@/api";
import { getInputStatus, RenderTanstackErrors, RenderTooLongWarning } from "@/components/inputs/input.tanstack";

import { SPACINGS } from "@a-novel/neon-ui";

import { ReactNode, useState } from "react";

import { PasswordOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { IconButton, Stack, TextField } from "@mui/material";
import { FieldApi } from "@tanstack/react-form";

export interface PasswordInputProps {
  field: FieldApi<any, any, string, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
  helperText?: ReactNode;
}

export const PasswordInput = ({ field, label, helperText }: PasswordInputProps) => {
  const status = getInputStatus(field);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack direction="column" gap={SPACINGS.SMALL}>
      <TextField
        id={field.name}
        label={
          <>
            <PasswordOutlined />
            {label}
          </>
        }
        helperText={helperText}
        error={status === "error"}
        type={showPassword ? "text" : "password"}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value.substring(0, BINDINGS_VALIDATION.PASSWORD.MAX))}
        disabled={field.form.state.isSubmitting}
        slotProps={{
          htmlInput: { maxLength: BINDINGS_VALIDATION.PASSWORD.MAX },
          input: {
            endAdornment: (
              <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
              </IconButton>
            ),
          },
        }}
      />
      <RenderTooLongWarning field={field} maxLength={BINDINGS_VALIDATION.PASSWORD.MAX} />
      <RenderTanstackErrors field={field} />
    </Stack>
  );
};
