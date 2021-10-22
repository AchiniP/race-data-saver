import {AxiosRequestConfig} from "axios";
import Config from '../config/AppConfig';

export const STATUS_DB_CONNECT = 'connect';
export const STATUS_DB_SAVE = 'save';
export const STATUS_START_SERVICE = 'start';
export const STATUS_RETRY_SERVICE = 'retry';
export const FETCH_DATA_REQ_OBJ = (token: string):AxiosRequestConfig => {
  return {
    method: 'GET',
    url: `${Config.EXTERNAL_API}/results`,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };
};
export const AUTH_REQ_OBJECT = ():AxiosRequestConfig =>{
  return  {
    method: 'POST',
    url: `${Config.EXTERNAL_API}/auth`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      email: Config.ADMIN_USER_NAME,
      password: Config.ADMIN_PASSWORD
    }
}
};
