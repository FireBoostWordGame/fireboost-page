import { $Enums } from "@prisma/client";
import Controller from "../controller";
import type { ControllerMethod, IController } from "../../types";
import { NextApiRequest, NextApiResponse } from "next";

export abstract class Middleware implements IController {
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | null>;
  constructor(protected readonly controller: Controller) {
    this.accessTypeMethod = this.controller.accessTypeMethod;
  }

  abstract run(
    mt: ControllerMethod | undefined,
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void>;

  protected notFoundMiddleware(message: string): string {
    return "Unauthorized Token " + message;
  }
}
