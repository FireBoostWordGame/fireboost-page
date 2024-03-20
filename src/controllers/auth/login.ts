import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import type {
  ControllerMethod,
  PayloadToken,
  UserCredentialsType,
} from "../../types";
import md5 from "md5";
import {
  HttpStatusKeysMore,
  SingJWTProps,
  TokenImplementation,
} from "../../types";
import HttpStatusManagement from "@/utils/http-status-management";
import { NotAcceptableError, UnauthorizedError } from "@/errorManager";
import { $Enums } from "@prisma/client";

export default class LoginController extends Controller {
  acceptKeys: string[] = ["password", "email", "type"];
  tokenService: TokenImplementation<SingJWTProps>;
  accessTypeMethod: Record<ControllerMethod, $Enums.Role | "any"> = {
    GET: "any",
    DELETE: "any",
    PATCH: "any",
    POST: "any",
    PUT: "any",
  };
  constructor(tokenService: TokenImplementation<SingJWTProps>) {
    super(false);
    this.tokenService = tokenService;
    // Add Method for the method run for father execute in GET request
    this.addPost(this.POST.bind(this));
  }

  private async POST(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    try {
      if (req.body.type === undefined || req.body.type === null) {
        req.body.type = "user";
      }
      if (!Object.keys(req.body).every((k) => this.acceptKeys.includes(k))) {
        throw new NotAcceptableError(
          `Error to format body please send ${this.acceptKeys.join(
            ", "
          )} whit the keys`,
          "Keys, Post Login"
        );
      }

      // let code = this.httpStatuses.getCode(HttpStatusKeysMore.ACCEPTED);
      const data = req.body as UserCredentialsType;
      let user: {
        email: string;
        password: string;
        role: $Enums.Role;
        id: string;
      } | null = null;
      let userContext = "User";
      if (data.type === "user") {
        // Search user whit email
        user = await this.db.user.findFirst({
          where: {
            email: data.email,
          },
        });
      } else if (data.type === "userbooster") {
        user = await this.db.userBooster.findFirst({
          where: {
            email: data.email,
          },
        });
        userContext = "User Booster";
      }

      if (user === null) {
        // code = this.httpStatuses.getCode(HttpStatusKeysMore.FORBIDDEN);
        throw new NotAcceptableError(
          `Error to Get User by Email ${data.email}, in ${userContext}`,
          "User whit Email not exist, Post Login"
        );
      }
      // Hash the password to need, beacause the database the password save encrypting in md5 method
      //TODO: Create Implementation for Hash strings to changes the md5 to other method not problem to accert
      const passwordEncryping = md5(data.password);
      //Verify password, to md5 hash every to the send the same string return the same hash string
      if (passwordEncryping === user.password) {
        // Cast whit role and id for send to generate token
        const payload: PayloadToken = {
          role: user.role,
          sub: user.id,
        };

        // recive the token ehit no error to create token
        const token = this.tokenService.singToken({
          role: user.role,
          payload,
        });

        const code = HttpStatusManagement.getCode(HttpStatusKeysMore.ACCEPTED);
        // Send to client the user and token
        return res
          .status(code.Code)
          .json({ code: `(${code.Meaning})`, user, token });
      } else {
        // code = this.httpStatuses.getCode(HttpStatusKeysMore.BADREQUEST);
        // Send to error 400 if the password not's same
        throw new UnauthorizedError("Pasword not is Equals, Post Login");
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}
