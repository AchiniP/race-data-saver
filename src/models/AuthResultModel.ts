import {AxiosResponse} from "axios";

/**
 * Auth Response Model
 */
export interface AuthResponse extends AxiosResponse{
  data: AuthResponseData
}

/**
 * Auth Response Data Model
 */
export interface AuthResponseData {
  token: string
}
