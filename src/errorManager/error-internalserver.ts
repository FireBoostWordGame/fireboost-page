import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class InternalServerError extends ErrorEndpoint {
  constructor(cause: string) {
    super(
      HttpStatusKeysMore.INTERNALSERVERERROR,
      "Unknown error please try again later",
      cause
    );
  }
}
