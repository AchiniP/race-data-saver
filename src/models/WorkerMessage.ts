import {IRaceEvent} from "./RaceEventResponseModel";

export interface WorkerMessage {
   status: string,
   data: IRaceEvent
}

