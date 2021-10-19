/**
 * Race Event Response
 */
import {AxiosResponse} from "axios";

export interface RaceEventResponse extends AxiosResponse{
  data: IRaceEvent
}

/**
 * Race Event Response Data Model
 */
export interface IRaceEvent {
  event: string;
  horse: {
    id: number,
    name: string,
  };
  time: number;
}


