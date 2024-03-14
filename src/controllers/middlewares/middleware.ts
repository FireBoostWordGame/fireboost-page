import { $Enums } from "@prisma/client";
import Controller from "../controller";
import type { ControllerMethod, IController } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

export abstract class Middleware extends Controller implements IController {
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | null>;
  constructor(protected readonly controller: Controller) {
    super();
    this.accessTypeMethod = this.controller.accessTypeMethod;
  }

  abstract run(
    mt: ControllerMethod | undefined,
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void>;

  protected notFoundMiddleware(
    _: NextApiRequest,
    res: NextApiResponse<{ error: string }>,
    message: string = ""
  ): void {
    res.status(400).json({ error: "Unauthorized Token " + message });
  }
}
