import axios, {AxiosRequestConfig} from 'axios';
 import Logger from "../utils/Logger";
import {IRaceEvent} from '../models/RaceEventResponseModel'
import {AuthResponseData} from '../models/AuthResultModel'

const LOG = new Logger('RaceApiService');
let ADMIN_USER_NAME: string | undefined, ADMIN_PASSWORD: string | undefined, EXTERNAL_API: string | undefined;
({EXTERNAL_API, ADMIN_USER_NAME, ADMIN_PASSWORD} = process.env);
let TOKEN: string | undefined;

const AUTH_REQ_OBJ: AxiosRequestConfig = {
  url: `${EXTERNAL_API}/auth`,
  data: {
    email: ADMIN_USER_NAME,
    password: ADMIN_PASSWORD
  },
};

/**
 * Fetch Auth Token from external API
 */
const fetchAuthToken = async () => {
  await axios.post<AuthResponseData>(AUTH_REQ_OBJ.url, AUTH_REQ_OBJ.data).then(res => {
    const {data} = res;
    const {token} = data;
    TOKEN = token;
  })
    .catch(async error => {
      LOG.error('Error occurred when fetching auth token ' + error);
      await fetchAuthToken();
    });
};

/**
 * Fetch Race Data from external API
 */
const fetchRaceData = async () => {
  LOG.info('Fetching results from Race API');
  if (!TOKEN) {
    await fetchAuthToken();
  }
  return await axios.get<IRaceEvent>(`${EXTERNAL_API}/results`, {
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
    }
  });
}

export default {
  fetchRaceData,
  fetchAuthToken
};
