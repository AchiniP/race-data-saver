import axios from "axios";
import Logger from "../middleware/Logger";
import ErrorBase from "../middleware/error/ErrorBase";
import RequestModel from '../models/RequestModel'

const LOG = new Logger('RaceApiService.ts');

const fetchAuthToken = async () => {
  LOG.info('[REPOSITORY][RACE_API] Fetching Auth Token from Race API');
  const REQ_OBJ: RequestModel = {
    method: 'POST',
    url: `${EXTERNAL_API}/auth`,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email: ADMIN_USER_NAME,
      password: ADMIN_PASSWORD
    }
  };
  const result = await axios(REQ_OBJ).then(resp => resp.data)
    .catch(async error => {
      LOG.error('[REPOSITORY][RACE_API] Error occurred when fetching auth token ' + error);
      if (error.response && error.response.status === 503) {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchAuthToken();
      }
      throw new ErrorBase('Error Occurred While Fetching AuthToken', 10002, error.response.status);
    });
  const {token} = result;
  Cache.setInCache('token', token);
}
