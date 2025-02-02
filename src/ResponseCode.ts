export enum ResponseCode {
    SUCCESS = 200,
    SUCCESS_CREATED = 201,
    ERROR_BAD_REQUEST = 400,
    ERROR_UNAUTHORIZED = 401,
    ERROR_FORBIDDEN = 403,
    ERROR_NOT_FOUND = 404,
    SERVER_ERROR = 500
}

// "1xx" - information
// "2xx" - success
// "3xx" - redirection
// "4xx" - client errors
// "5xx" - server errors