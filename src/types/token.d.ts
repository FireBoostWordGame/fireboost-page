import { $Enums } from "@prisma/client";
import { Jwt } from "jsonwebtoken";

// Format to Recive to sing token generate
export interface SingJWTProps {
  payload: Jwt.JwtPayload;
  role: RoleJwt;
}

// Interface to Token Sing In
export interface TokenImplementation<T> {
  singToken(data: T): string;
}

// Roles To accept JWT Implementations
export type RoleJwt = $Enums.Role;
