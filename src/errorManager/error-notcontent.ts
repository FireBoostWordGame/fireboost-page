import { HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class NoContentError extends ErrorEndpoint {
  constructor(resourcetosolicity: string, cause: string) {
    super(
      HttpStatusKeysMore.NOCONTENT,
      `Not Content for ${resourcetosolicity}`,
      cause
    );
  }
}
