import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class NotAcceptableError extends ErrorEndpoint {
  constructor(message: string, cause: string) {
    super(HttpStatusKeysMore.NOTACCEPTABLE, message, cause);
  }
}
