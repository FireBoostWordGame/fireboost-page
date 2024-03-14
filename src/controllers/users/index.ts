import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import { $Enums } from "@prisma/client";
import type { ControllerMethod } from "@/types";

export default class UserController extends Controller {
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | null> = {
    GET: $Enums.Role.USER,
    DELETE: null,
    PATCH: null,
    POST: null,
    PUT: null,
  };
  constructor() {
    super();
    this.addGet(this.GET.bind(this));
  }

  private async GET(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    try {
      console.log("User Controller Get");

      return res.status(200).json({ message: "Get User's" });
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Error to Get User" + (error as Error).message });
    }
  }
}
