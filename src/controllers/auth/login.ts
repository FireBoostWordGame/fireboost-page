import { NextApiRequest, NextApiResponse } from "next";
import Controller from "../controller";
import type { PayloadToken, UserLogin } from "@/types";
import md5 from "md5";
import { SingJWTProps, TokenImplementation } from "@/types/token";

export default class LoginController extends Controller {
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
      const data = req.body as UserLogin;
      // Search user whit email
      const user = await this.prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });
      if (user === null)
        return res
          .status(400)
          .json({ error: `Error to Get User by Email ${data.email}` });
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

        // Send to client the user and token
        return res.status(200).json({ user, token });
      } else {
        // Send to error 400 if the password not's same
        return res.status(400).json({ error: "Pasword not is Equals" });
      }
    } catch (error) {
      // Send to error 400 if the not user in the search
      return res
        .status(400)
        .json({ error: "Error to Get User " + (error as Error).message });
    }
  }
}
