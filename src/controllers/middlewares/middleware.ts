import { $Enums } from "@prisma/client";
import Controller from "../controller";
import type { ControllerMethod, IController } from "../../types";
import { NextApiRequest, NextApiResponse } from "next";
import PrismaService from "@/services/prisma";

export abstract class Middleware extends PrismaService implements IController {
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | "any">;
  constructor(protected readonly controller: Controller) {
    super();
    this.accessTypeMethod = this.controller.accessTypeMethod;
  }

  abstract run(
    mt: ControllerMethod | undefined,
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void>;
}
