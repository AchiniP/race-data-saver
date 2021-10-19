import {StatusCodes} from 'http-status-codes';

class ErrorBase extends Error {
  private readonly errorCode: number;
  private readonly httpStatusCode: StatusCodes;

  constructor(message, errorCode, httpStatusCode) {
    super(message);

    this.errorCode = errorCode;
    this.httpStatusCode = httpStatusCode;
  }

  getMessage() {
    return this.message;
  }

  getErrorCode() {
    return this.errorCode;
  }

  getHttpStatusCode() {
    return this.httpStatusCode;
  }
}

export default ErrorBase;
