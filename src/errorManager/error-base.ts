import {
  ErrorReturn,
  HttpStatusInformation,
  HttpStatusKeys,
  HttpStatusKeysMore,
} from "@/types";
import HttpStatusManagement from "@/utils/http-status-management";

export abstract class ErrorEndpoint extends Error {
  private code: HttpStatusInformation;
  constructor(
    private readonly codeName: HttpStatusKeys | HttpStatusKeysMore,
    public message: string,
    public cause: string
  ) {
    super(message, {
      cause,
    });
    this.code = HttpStatusManagement.getCode(this.codeName);
  }

  getErrorObject(): ErrorReturn {
    return {
      code: this.code.Code,
      meaning: this.code.Meaning,
      message: this.message,
      cause: this.cause,
    };
  }
}
