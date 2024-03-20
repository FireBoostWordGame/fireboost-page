import { HttpStatusKeys, HttpStatusKeysMore } from "@/types";
import { ErrorEndpoint } from "./error-base";

export class PrismaError extends ErrorEndpoint {
  constructor(message: string, cause: string) {
    super(
      HttpStatusKeys.NOTACCEPTABLE,
      `DataBase Prisma Error: ${message}`,
      cause
    );
  }
}
