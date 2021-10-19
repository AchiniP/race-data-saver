import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {StatusCodes} from 'http-status-codes';
import Logger from "../utils/Logger";
import {IRaceEvent} from '../models/RaceEventResponseModel'
import {AuthResponseData} from '../models/AuthResultModel'
import {RaceEventModel} from "../models/RaceDataEvent";

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
  }).then(resp => handleResponse(resp))
    .catch(error => handleError(error));
}

/**
 * Convert Race Data Response to Race Data model
 * @param raceDataResponse
 */
const buildRaceEvent = (raceDataResponse: AxiosResponse<IRaceEvent>) => {
  LOG.debug("Building race event to save in DB: ");
  const { data } = raceDataResponse;
  const {event, horse, time} = data;
  // const {id, name} = horse;
  console.log(event, horse, time)
  return new RaceEventModel({
    event,
    horse,
    time
  });
}

/**
 * Action on Success Response
 * @param response
 */
const handleResponse = async (response: AxiosResponse<IRaceEvent>) => {
  if (response.status === StatusCodes.OK) {
    LOG.info('Saving RaceEvent');
    const raceEvent = buildRaceEvent(response);
    raceEvent.save();
  }
  if (response.status === StatusCodes.NO_CONTENT) {
    LOG.info('[REPOSITORY][RACE_API]: No events to save');
  }
  await fetchRaceData();
}

/**
 * Action on Error Response
 * @param error
 */
const handleError = async (error: AxiosError) => {
  LOG.error(`Error occurred when fetching results: ${error}`);
  if (error.response && error.response.status === StatusCodes.UNAUTHORIZED) {
    await fetchAuthToken();
  }
  // retry
  await fetchRaceData();
}

export default {
  fetchRaceData
};
