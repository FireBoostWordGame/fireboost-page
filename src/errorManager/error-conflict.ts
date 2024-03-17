import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class ConflictError extends ErrorEndpoint {
  constructor(message: string, cause: string) {
    super(HttpStatusKeysMore.CONFLICT, message, cause);
  }
}
