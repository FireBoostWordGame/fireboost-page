import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class ForbidenError extends ErrorEndpoint {
  constructor(cause: string = "") {
    super(HttpStatusKeysMore.FORBIDDEN, "Access prohibited", cause);
  }
}
