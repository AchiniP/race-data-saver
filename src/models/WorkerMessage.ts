import {IRaceEvent} from "./RaceEventResponseModel";

/**
 * Model for message passing between worker thread
 */
export interface WorkerMessage {
   status: string,
   data: IRaceEvent
}

