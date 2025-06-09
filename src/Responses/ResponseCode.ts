export enum ResponseCode {
    Success = 200,
    SuccessCreated = 201,
    ErrorBadRequest = 400,
    ErrorUnauthorized = 401,
    ErrorForbidden = 403,
    ErrorNotFound = 404,
    ErrorConflict = 409,
    ServerError = 500
}