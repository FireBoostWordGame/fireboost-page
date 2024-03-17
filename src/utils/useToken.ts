import { IUseToken, TokenResult } from "../types";
import * as jwt from "jsonwebtoken";

export default function UseTokenVerify(token: string): IUseToken | string {
  try {
    const retoken = jwt.decode(token) as TokenResult;
    const currentDate = new Date();
    const expiresDate = new Date(retoken.exp * 1000);
    return {
      isExpired: +expiresDate <= +currentDate / 1000,
      role: retoken.role,
      sub: retoken.sub,
    };
  } catch (error) {
    return "Token Invalid";
  }
}
