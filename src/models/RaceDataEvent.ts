import * as mongoose from 'mongoose';
import {IRaceEvent} from "./RaceEventResponseModel";

interface raceModelInterface extends mongoose.Model<RaceEventDoc> {
  build(attr: IRaceEvent): RaceEventDoc
}

/**
 * Race Event Interface
 */
interface RaceEventDoc extends mongoose.Document {
  event: string;
  horse: {
    id: number,
    name: string,
  };
  time: number;
}

/**
 * Race Event DB schema
 */
const RaceEventSchema = new mongoose.Schema({
  event: {
    type: String
  },
  horse: {
    id: {
      type: Number
    },
    name: {
      type: String
    },
  },
  time: {
    type: Number
  },
});

RaceEventSchema.statics.build = (attr: IRaceEvent) => {
  return new RaceEventModel(attr)
}

const RaceEventModel = mongoose.model<RaceEventDoc, raceModelInterface>('race_event', RaceEventSchema)

export { RaceEventModel }
