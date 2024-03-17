import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class UnauthorizedError extends ErrorEndpoint {
  constructor(cause: string = "Faild Token") {
    super(HttpStatusKeysMore.UNAUTHORIZED, "You are not authorized", cause);
  }
}
