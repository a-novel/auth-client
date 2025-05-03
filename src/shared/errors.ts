import { ZodError } from "zod";

export const printError = (err: any): string => {
  if (typeof err === "string") {
    return err;
  }

  if (typeof err === "object" && (err instanceof Error || err.prototype instanceof Error)) {
    if (err.cause) {
      return `${err.message} \n\tCaused by: ${printError(err.cause)}`;
    }

    return err.message;
  }

  if (typeof err === "object" && (err instanceof ZodError || err.prototype instanceof ZodError)) {
    return err.message;
  }

  return JSON.stringify(err);
};
