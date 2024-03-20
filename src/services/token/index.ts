import { ConflictError } from "@/errorManager";
import { RoleJwt, SingJWTProps, TokenImplementation } from "../../types/token";
import ConfigService from "../../utils/config/configService";
import * as jwt from "jsonwebtoken";

export default class JWTService implements TokenImplementation<SingJWTProps> {
  constructor(private readonly configService: ConfigService) {}
  singToken({ payload, role }: SingJWTProps): string {
    try {
      const expiresIn = this.getExperires(role);
      const secret = this.configService.get<string>(
        "jwt.secret_token",
        "1234654"
      );
      // console.log({
      //   payload,
      //   secret,
      //   expiresIn,
      // });
      return jwt.sign(payload, secret, { expiresIn });
    } catch (error) {
      // TODO: Implement accerts Exception to inherate to Error
      throw new ConflictError(
        "Error to generate token, please try again later",
        "Token SingIn"
      );
    }
  }

  private getExperires(type: RoleJwt): `${string}h` {
    let experiesAdmin = this.configService.get<`${string}h`>(
      "jwt.token_time_admin",
      "12h"
    );
    let experiesBooster = this.configService.get<`${string}h`>(
      "jwt.token_time_booster",
      "4h"
    );
    let experiesUser = this.configService.get<`${string}h`>(
      "jwt.token_time_user",
      "4h"
    );
    if (!experiesAdmin.endsWith("h")) experiesAdmin = `${experiesAdmin}h`;
    if (!experiesUser.endsWith("h")) experiesUser = `${experiesUser}h`;
    if (!experiesBooster.endsWith("h")) experiesBooster = `${experiesBooster}h`;

    const experiesForRoleJWT: Record<RoleJwt, `${string}h`> = {
      ADMIN: experiesAdmin,
      BOOSTER: experiesBooster,
      USER: experiesUser,
    };

    return experiesForRoleJWT[type];
  }
}
