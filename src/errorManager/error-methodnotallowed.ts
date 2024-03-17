import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class MethodNotAllowedError extends ErrorEndpoint {
  constructor(path: string, cause: string = "") {
    super(
      HttpStatusKeysMore.METHODNOTALLOWED,
      `Not Method for this path "${path}", please verify route`,
      cause
    );
  }
}
