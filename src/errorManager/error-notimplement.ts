import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class NotImplementedError extends ErrorEndpoint {
  constructor(path: string, cause: string = "") {
    super(
      HttpStatusKeysMore.NOTIMPLEMENTED,
      `Not Implemented "${path}"`,
      cause
    );
  }
}
