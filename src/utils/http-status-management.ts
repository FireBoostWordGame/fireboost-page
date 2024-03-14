import {
  HttpStatus,
  HttpStatusInformation,
  HttpStatusKeys,
  HttpStatusKeysMore,
} from "@/types";

const httpStatuses: HttpStatus = {
  Continue: { Code: 100, Meaning: "Continue" },
  SwitchingProtocols: { Code: 101, Meaning: "Switching Protocols" },
  Processing: { Code: 102, Meaning: "Processing" },
  EarlyHints: { Code: 103, Meaning: "Early Hints" },
  OK: { Code: 200, Meaning: "OK" },
  Created: { Code: 201, Meaning: "Created" },
  Accepted: { Code: 202, Meaning: "Accepted" },
  NonAuthoritativeInformation: {
    Code: 203,
    Meaning: "Non-Authoritative Information",
  },
  NoContent: { Code: 204, Meaning: "No Content" },
  ResetContent: { Code: 205, Meaning: "Reset Content" },
  PartialContent: { Code: 206, Meaning: "Partial Content" },
  MultiStatus: { Code: 207, Meaning: "Multi-Status" },
  AlreadyReported: { Code: 208, Meaning: "Already Reported" },
  IMUsed: { Code: 226, Meaning: "IM Used" },
  MultipleChoices: { Code: 300, Meaning: "Multiple Choices" },
  MovedPermanently: { Code: 301, Meaning: "Moved Permanently" },
  FoundPreviouslyMovedTemporarily: {
    Code: 302,
    Meaning: 'Found (Previously "Moved Temporarily")',
  },
  SeeOther: { Code: 303, Meaning: "See Other" },
  NotModified: { Code: 304, Meaning: "Not Modified" },
  UseProxy: { Code: 305, Meaning: "Use Proxy" },
  SwitchProxy: { Code: 306, Meaning: "Switch Proxy" },
  TemporaryRedirect: { Code: 307, Meaning: "Temporary Redirect" },
  PermanentRedirect: { Code: 308, Meaning: "Permanent Redirect" },
  BadRequest: { Code: 400, Meaning: "Bad Request" },
  Unauthorized: { Code: 401, Meaning: "Unauthorized" },
  PaymentRequired: { Code: 402, Meaning: "Payment Required" },
  Forbidden: { Code: 403, Meaning: "Forbidden" },
  NotFound: { Code: 404, Meaning: "Not Found" },
  MethodNotAllowed: { Code: 405, Meaning: "Method Not Allowed" },
  NotAcceptable: { Code: 406, Meaning: "Not Acceptable" },
  ProxyAuthenticationRequired: {
    Code: 407,
    Meaning: "Proxy Authentication Required",
  },
  RequestTimeout: { Code: 408, Meaning: "Request Timeout" },
  Conflict: { Code: 409, Meaning: "Conflict" },
  Gone: { Code: 410, Meaning: "Gone" },
  LengthRequired: { Code: 411, Meaning: "Length Required" },
  PreconditionFailed: { Code: 412, Meaning: "Precondition Failed" },
  PayloadTooLarge: { Code: 413, Meaning: "Payload Too Large" },
  URITooLong: { Code: 414, Meaning: "URI Too Long" },
  UnsupportedMediaType: { Code: 415, Meaning: "Unsupported Media Type" },
  RangeNotSatisfiable: { Code: 416, Meaning: "Range Not Satisfiable" },
  ExpectationFailed: { Code: 417, Meaning: "Expectation Failed" },
  ImaTeapot: { Code: 418, Meaning: "I'm a Teapot" },
  MisdirectedRequest: { Code: 421, Meaning: "Misdirected Request" },
  UnprocessableEntity: { Code: 422, Meaning: "Unprocessable Entity" },
  Locked: { Code: 423, Meaning: "Locked" },
  FailedDependency: { Code: 424, Meaning: "Failed Dependency" },
  TooEarly: { Code: 425, Meaning: "Too Early" },
  UpgradeRequired: { Code: 426, Meaning: "Upgrade Required" },
  PreconditionRequired: { Code: 428, Meaning: "Precondition Required" },
  TooManyRequests: { Code: 429, Meaning: "Too Many Requests" },
  RequestHeaderFieldsTooLarge: {
    Code: 431,
    Meaning: "Request Header Fields Too Large",
  },
  UnavailableForLegalReasons: {
    Code: 451,
    Meaning: "Unavailable For Legal Reasons",
  },
  InternalServerError: { Code: 500, Meaning: "Internal Server Error" },
  NotImplemented: { Code: 501, Meaning: "Not Implemented" },
  BadGateway: { Code: 502, Meaning: "Bad Gateway" },
  ServiceUnavailable: { Code: 503, Meaning: "Service Unavailable" },
  GatewayTimeout: { Code: 504, Meaning: "Gateway Timeout" },
  HTTPVersionNotSupported: { Code: 505, Meaning: "HTTP Version Not Supported" },
  VariantAlsoNegotiates: { Code: 506, Meaning: "Variant Also Negotiates" },
  InsufficientStorage: { Code: 507, Meaning: "Insufficient Storage" },
  LoopDetected: { Code: 508, Meaning: "Loop Detected" },
  NotExtended: { Code: 510, Meaning: "Not Extended" },
  NetworkAuthenticationRequired: {
    Code: 511,
    Meaning: "Network Authentication Required",
  },
};

export default class HttpStatusManagement {
  private readonly statuses = httpStatuses;

  public getCode(
    key: HttpStatusKeysMore | HttpStatusKeys
  ): HttpStatusInformation {
    return this.statuses[key];
  }
}
