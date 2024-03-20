import type { ControllerMethod } from "../../types";
import { NextApiRequest, NextApiResponse } from "next";
import UseTokenVerify from "../../utils/useToken";
import { $Enums } from "@prisma/client";
import Controller from "../controller";
import { Middleware } from "./middleware";
import { ErrorEndpoint, UnauthorizedError } from "@/errorManager";

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
    if (
      token === undefined ||
      token === null ||
      Array.isArray(token) ||
      typeof token !== "string"
    )
      throw new UnauthorizedError(this.notFoundMiddleware(""));
    const tokenVer = UseTokenVerify(token);
    if (typeof tokenVer === "string")
      throw new UnauthorizedError(this.notFoundMiddleware(""));
    if (tokenVer.isExpired)
      throw new UnauthorizedError(this.notFoundMiddleware("Token Expired"));

    if (tokenVer.role !== $Enums.Role.ADMIN) {
      try {
        if (mt === null || mt === undefined) mt = "GET";
        const role = this.controller.accessTypeMethod[mt];
        if (role !== null) {
          if (tokenVer.role !== role) {
            throw new UnauthorizedError(
              this.notFoundMiddleware("Not Acces Role For this Endpoint")
            );
          }
        }
      } catch (error: unknown) {
        if (error instanceof ErrorEndpoint) {
          throw new UnauthorizedError(this.notFoundMiddleware(error.message));
        } else {
          throw new UnauthorizedError("Unknow");
        }
      }
    }
    try {
      if (
        tokenVer.role === $Enums.Role.ADMIN ||
        tokenVer.role === $Enums.Role.ADMIN
      ) {
        const user = await this.db.user.findFirst({
          where: {
            id: tokenVer.sub,
          },
        });
        if (user !== undefined && user !== null) {
          if (user.role !== tokenVer.role) {
            tokenVer.role = user.role;
          }
        }
      } else {
        const userBooster = await this.db.userBooster.findFirst({
          where: {
            id: tokenVer.sub,
          },
        });
        if (userBooster !== undefined && userBooster !== null) {
          if (userBooster.role !== tokenVer.role) {
            tokenVer.role = userBooster.role;
          }
        }
      }
    } catch (error) {
      throw new UnauthorizedError("Error to verify User");
    }
    req.headers["userId"] = tokenVer.sub;
    req.headers["role"] = tokenVer.role;
    return this.controller.run(mt, req, res);
  }

  private notFoundMiddleware(message: string): string {
    return "Unauthorized Token: " + message;
  }
}
