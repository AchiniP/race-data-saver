import {StatusCodes} from 'http-status-codes';

class ErrorBase extends Error {
  private readonly errorCode: number;
  private readonly httpStatusCode: StatusCodes;

  constructor(message: string, errorCode:number, httpStatusCode:StatusCodes) {
    super(message);

    this.errorCode = errorCode;
    this.httpStatusCode = httpStatusCode;
  }

  getMessage():string {
    return this.message;
  }

  getErrorCode():number {
    return this.errorCode;
  }

  getHttpStatusCode():StatusCodes {
    return this.httpStatusCode;
  }
}

export default ErrorBase;
