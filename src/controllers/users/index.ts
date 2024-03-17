import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import { $Enums } from "@prisma/client";
import { HttpStatusKeysMore, type ControllerMethod } from "../../types";
import HttpStatusManagement from "@/utils/http-status-management";
import { BadRequestError, ErrorEndpoint } from "@/errorManager";

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
    this.addGet(this.GETAll.bind(this), "all");
  }

  private async GET(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
      console.log(`User Controller Get Unique ${req.query["id"]}`);

      return res.status(code.Code).json({ message: "Get User" });
    } catch (error: unknown) {
      if (error instanceof ErrorEndpoint) {
        throw new BadRequestError(
          `Error to Get User ${error.message}`,
          "User Get by id"
        );
      } else {
        throw new BadRequestError(`Error to Get User`, "User Get by id");
      }
    }
  }

  private async GETAll(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    let code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
    try {
      console.log("User Controller Get All");

      return res.status(code.Code).json({ message: "Get User's" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestError(
          `Error to Get all User ${error.message}`,
          "Get all User"
        );
      } else {
        throw new BadRequestError(`Error to Get all User`, "Get all User");
      }
    }
  }
}
