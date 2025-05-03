import { ReactComponent as GearLoader } from "@/assets/icons/spinners/gear.svg";

import { BINDINGS_VALIDATION } from "@/api";
import { getInputStatus, RenderTanstackErrors, RenderTooLongWarning } from "@/components/inputs/input.tanstack";

import { SPACINGS } from "@a-novel/neon-ui";

import { FC } from "react";

import { EmailOutlined } from "@mui/icons-material";
import { IconButton, Stack, TextField } from "@mui/material";
import { FieldApi } from "@tanstack/react-form";

export interface EmailInputProps {
  field: FieldApi<any, any, string, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
  placeholder: string;
}

export const EmailInput: FC<EmailInputProps> = ({ field, label, placeholder }) => {
  const status = getInputStatus(field);

  return (
    <Stack direction="column" gap={SPACINGS.SMALL}>
      <TextField
        id={field.name}
        label={
          <>
            <EmailOutlined />
            {label}
          </>
        }
        error={status === "error"}
        type="email"
        placeholder={placeholder}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value.substring(0, BINDINGS_VALIDATION.EMAIL.MAX))}
        disabled={field.form.state.isSubmitting}
        slotProps={{
          htmlInput: { maxLength: BINDINGS_VALIDATION.EMAIL.MAX },
          input: {
            endAdornment: field.state.meta.isValidating ? (
              <IconButton sx={{ pointerEvents: "none" }}>
                <GearLoader />
              </IconButton>
            ) : undefined,
          },
        }}
      />
      <RenderTooLongWarning field={field} maxLength={BINDINGS_VALIDATION.EMAIL.MAX} />
      <RenderTanstackErrors field={field} />
    </Stack>
  );
};
