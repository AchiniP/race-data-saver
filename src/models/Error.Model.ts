import {StatusCodes} from "http-status-codes";

export interface ErrorResponse {
  response: {
    status: StatusCodes
  }
}

