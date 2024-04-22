export * from "./user";
export * from "./token.d";
import type { $Enums } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

// Methods To Accept to application
export type ControllerMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type MultipleMethodSecurity = {
  method: ControllerFunction;
  accestType: $Enums.Role | "any";
};

//Multiple Functions Controller
export type MultipleMethods = {
  defaultF: MultipleMethodSecurity; // Key 'default' obligatoria
} & Record<string, MultipleMethodSecurity>; // Resto de las keys opcionales

//Type for function method Controller
// export type FunctionsMethods = ControllerFunction;
export type FunctionsMethods = ControllerFunction | MultipleMethods;

// Function to Handler Nextjs Recive
export type ControllerFunction<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => void | Promise<void>;

export interface PayloadToken {
  role: $Enums.Role;
  sub: string;
}

// Token Result For Verify token
export interface TokenResult {
  role: string;
  sub: string;
  exp: number;
  iat: number;
}

// Return type for hooks to verify the token
export interface IUseToken {
  role: string;
  sub: string;
  isExpired: boolean;
}

// Error Message to response in NextResponse
export type ResponseControllerNotFound<T = any> = {
  error: T;
};

export interface PaginationUrl {
  currentPage: string;
  nextPage: string;
}
export interface Pagination {
  skip: number;
  take: number;
  url: PaginationUrl;
}

//Error return in hendlerError function
export interface ErrorReturn {
  code: number;
  meaning: string;
  message: string;
  cause: string;
}
//Enum whit http Status Keys more utility
export enum HttpStatusKeysMore {
  OK = "OK",
  CREATED = "Created",
  ACCEPTED = "Accepted",
  NOCONTENT = "NoContent", //:id
  UNAUTHORIZED = "Unauthorized", // :d
  FORBIDDEN = "Forbidden", //:d
  NOTFOUND = "NotFound", //:d
  BADREQUEST = "BadRequest", //:d
  METHODNOTALLOWED = "MethodNotAllowed", //:d
  NOTACCEPTABLE = "NotAcceptable", //:d
  CONFLICT = "Conflict", //:d
  INTERNALSERVERERROR = "InternalServerError", //:d
  NOTIMPLEMENTED = "NotImplemented", //:d
}

//Enum whit http Status Keys
export enum HttpStatusKeys {
  CONTINUE = "Continue",
  SWITCHINGPROTOCOLS = "SwitchingProtocols",
  PROCESSING = "Processing",
  EARLYHINTS = "EarlyHints",
  OK = "OK",
  CREATED = "Created",
  ACCEPTED = "Accepted",
  NONAUTHORITATIVEINFORMATION = "NonAuthoritativeInformation",
  NOCONTENT = "NoContent",
  RESETCONTENT = "ResetContent",
  PARTIALCONTENT = "PartialContent",
  MULTISTATUS = "MultiStatus",
  ALREADYREPORTED = "AlreadyReported",
  IMUSED = "IMUsed",
  MULTIPLECHOICES = "MultipleChoices",
  MOVEDPERMANENTLY = "MovedPermanently",
  FOUNDPREVIOUSLYMOVEDTEMPORARILY = "FoundPreviouslyMovedTemporarily",
  SEEOTHER = "SeeOther",
  NOTMODIFIED = "NotModified",
  USEPROXY = "UseProxy",
  SWITCHPROXY = "SwitchProxy",
  TEMPORARYREDIRECT = "TemporaryRedirect",
  PERMANENTREDIRECT = "PermanentRedirect",
  BADREQUEST = "BadRequest",
  UNAUTHORIZED = "Unauthorized",
  PAYMENTREQUIRED = "PaymentRequired",
  FORBIDDEN = "Forbidden",
  NOTFOUND = "NotFound",
  METHODNOTALLOWED = "MethodNotAllowed",
  NOTACCEPTABLE = "NotAcceptable",
  PROXYAUTHENTICATIONREQUIRED = "ProxyAuthenticationRequired",
  REQUESTTIMEOUT = "RequestTimeout",
  CONFLICT = "Conflict",
  GONE = "Gone",
  LENGTHREQUIRED = "LengthRequired",
  PRECONDITIONFAILED = "PreconditionFailed",
  PAYLOADTOOLARGE = "PayloadTooLarge",
  URITOOLONG = "URITooLong",
  UNSUPPORTEDMEDIATYPE = "UnsupportedMediaType",
  RANGENOTSATISFIABLE = "RangeNotSatisfiable",
  EXPECTATIONFAILED = "ExpectationFailed",
  IMATEAPOT = "ImaTeapot",
  MISDIRECTEDREQUEST = "MisdirectedRequest",
  UNPROCESSABLEENTITY = "UnprocessableEntity",
  LOCKED = "Locked",
  FAILEDDEPENDENCY = "FailedDependency",
  TOOEARLY = "TooEarly",
  UPGRADEREQUIRED = "UpgradeRequired",
  PRECONDITIONREQUIRED = "PreconditionRequired",
  TOOMANYREQUESTS = "TooManyRequests",
  REQUESTHEADERFIELDSTOOLARGE = "RequestHeaderFieldsTooLarge",
  UNAVAILABLEFORLEGALREASONS = "UnavailableForLegalReasons",
  INTERNALSERVERERROR = "InternalServerError",
  NOTIMPLEMENTED = "NotImplemented",
  BADGATEWAY = "BadGateway",
  SERVICEUNAVAILABLE = "ServiceUnavailable",
  GATEWAYTIMEOUT = "GatewayTimeout",
  HTTPVERSIONNOTSUPPORTED = "HTTPVersionNotSupported",
  VARIANTALSONEGOTIATES = "VariantAlsoNegotiates",
  INSUFFICIENTSTORAGE = "InsufficientStorage",
  LOOPDETECTED = "LoopDetected",
  NOTEXTENDED = "NotExtended",
  NETWORKAUTHENTICATIONREQUIRED = "NetworkAuthenticationRequired",
}
// Body to http status information
export type HttpStatusInformation = { Code: number; Meaning: string };

// Type generic
export type HttpStatus = {
  [key: string]: HttpStatusInformation;
};

export interface IController {
  run(
    mt: ControllerMethod | undefined,
    req: NextApiRequest,
    res: NextApiResponse<any>
  ): Promise<void>;
}

// Handler Function to for function to call controller
export type HandlerFunctionApi<T> = (
  controller: IController
) => ControllerFunction<T>;
