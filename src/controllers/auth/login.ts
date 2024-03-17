import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import type { PayloadToken, UserLogin } from "../../types";
import md5 from "md5";
import {
  HttpStatusKeysMore,
  SingJWTProps,
  TokenImplementation,
} from "../../types";
import HttpStatusManagement from "@/utils/http-status-management";
import { NotAcceptableError, UnauthorizedError } from "@/errorManager";

export default class LoginController extends Controller {
  acceptKeys: string[] = ["password", "email"];
  tokenService: TokenImplementation<SingJWTProps>;
  constructor(tokenService: TokenImplementation<SingJWTProps>) {
    super();
    this.tokenService = tokenService;
    // Add Method for the method run for father execute in GET request
    this.addPost(this.POST.bind(this));
  }

  private async POST(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void> {
    try {
      if (
        !Object.keys(req.body)
          .map((k) => this.acceptKeys.includes(k))
          .every(Boolean)
      ) {
        throw new NotAcceptableError(
          "Error to format body please send password, and email whit the keys",
          "Keys, Post Login"
        );
      }
      // let code = this.httpStatuses.getCode(HttpStatusKeysMore.ACCEPTED);
      const data = req.body as UserLogin;
      // Search user whit email
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });
      if (user === null) {
        // code = this.httpStatuses.getCode(HttpStatusKeysMore.FORBIDDEN);
        throw new NotAcceptableError(
          `Error to Get User by Email ${data.email}`,
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
