export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum AppMessages {
  // Auth Messages
  USER_ALREADY_EXISTS = "User already exists",
  INVALID_CREDENTIALS = "Invalid credentials",
  UNAUTHORIZED = "Unauthorized",
  USER_NOT_FOUND = "User not found",
  LOGOUT_SUCCESS = "Logged out successfully",

  // PDF Messages
  PDF_NOT_FOUND = "PDF not found",
  UNAUTHORIZED_PDF_ACCESS = "Unauthorized to access this PDF",
  NO_VALID_PAGES = "No valid pages selected for extraction",
  PDF_ID_MISSING = "PDF file ID is missing. Please upload the file again.",

  // General Messages
  INTERNAL_SERVER_ERROR = "Something went wrong",
  NO_TOKEN = "No token provided",
  INVALID_TOKEN = "Invalid or expired token",
}
