import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class NoFoundError extends ErrorEndpoint {
  constructor(message: string, cause: string) {
    super(HttpStatusKeysMore.NOTFOUND, `Not Found: ${message}`, cause);
  }
}
