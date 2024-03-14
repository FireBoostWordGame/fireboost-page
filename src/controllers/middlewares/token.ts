import type { ControllerMethod } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import UseTokenVerify from "@/utils/useToken";
import { $Enums } from "@prisma/client";
import Controller from "../controller";
import { Middleware } from "./middleware";

export default class TokenMiddleware extends Middleware {
  constructor(protected readonly controller: Controller) {
    super(controller);
  }

  async run(
    mt: ControllerMethod | undefined,
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    const token = req.headers["token"];
    if (token === undefined || token === null || Array.isArray(token))
      return this.notFoundMiddleware(req, res);
    const tokenVer = UseTokenVerify(token);
    if (typeof tokenVer === "string") return this.notFoundMiddleware(req, res);
    if (tokenVer.isExpired)
      return this.notFoundMiddleware(req, res, "Token Expired");

    if (tokenVer.role !== $Enums.Role.ADMIN) {
      try {
        if (mt === null || mt === undefined) mt = "GET";
        const role = this.controller.accessTypeMethod[mt];
        if (role !== null) {
          if (tokenVer.role !== role) {
            return this.notFoundMiddleware(
              req,
              res,
              "Not Acces Role For this Endpoint"
            );
          }
        }
      } catch (error) {}
    }

    req.headers["userId"] = tokenVer.sub;
    return this.controller.run(mt, req, res);
  }
}
