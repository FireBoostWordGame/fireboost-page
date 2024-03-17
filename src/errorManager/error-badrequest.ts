import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class BadRequestError extends ErrorEndpoint {
  constructor(message: string, cause: string) {
    super(HttpStatusKeysMore.BADREQUEST, message, cause);
  }
}
