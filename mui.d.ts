import "@mui/material";

declare module "@mui/material" {
  interface ButtonPropsVariantOverrides {
    gradient: true;
    glow: true;
    "gradient-glow": true;
    text: true;
    "list-item": true;
  }
}
