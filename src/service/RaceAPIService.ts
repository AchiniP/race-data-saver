import axios, {AxiosResponse} from 'axios';
import Logger from "../utils/Logger";
import {AuthResponseData} from '../models/AuthResultModel'
import {AUTH_REQ_OBJECT, FETCH_DATA_REQ_OBJ} from "../utils/AppConstants";

const LOG = new Logger('RaceApiService');
let TOKEN: string | undefined;

/**
 * Fetch Auth Token from external API
 */
const fetchAuthToken = async ():Promise<void> => {
  await axios.request(AUTH_REQ_OBJECT()).then((res:AxiosResponse<AuthResponseData>) => {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchRaceData = async ():Promise<any> => {
  LOG.info('Fetching results from Race API');
  if (!TOKEN) {
    await fetchAuthToken();
  }
  return axios.request(FETCH_DATA_REQ_OBJ(TOKEN));
}

export default {
  fetchRaceData,
  fetchAuthToken
};
