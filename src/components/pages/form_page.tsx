import logo from "@/assets/images/banner.png?inline";

import { SPACINGS } from "@a-novel/neon-ui";

import { FC, ReactNode } from "react";

import { Button, Stack } from "@mui/material";

export interface FormPageProps {
  children: ReactNode;
  cancel?: {
    action: () => void;
    node: ReactNode;
  };
}

export const FormPage: FC<FormPageProps> = ({ children, cancel }) => (
  <Stack
    component="main"
    direction="column"
    alignItems="center"
    justifyContent="center"
    flexGrow={1}
    padding={SPACINGS.MEDIUM}
    gap={SPACINGS.XLARGE}
  >
    <Stack direction="column" alignItems="center" justifyContent="center" flexGrow={1} gap={SPACINGS.XLARGE}>
      <img style={{ width: "24rem", maxWidth: "100%" }} src={logo} alt="a-novel logo" />
      {children}
    </Stack>

    {cancel && (
      <Button sx={{ alignSelf: "flex-start", maxWidth: "100%" }} onClick={cancel.action} color="primary">
        {cancel.node}
      </Button>
    )}
  </Stack>
);
