import * as mongoose from 'mongoose';
import {IRaceEvent} from "./RaceEventResponseModel";


interface todoModelInterface extends mongoose.Model<RaceEventDoc> {
  build(attr: IRaceEvent): RaceEventDoc
}

interface RaceEventDoc extends mongoose.Document {
  event: string;
  horse: {
    id: number,
    name: string,
  };
  time: number;
}

// @ts-ignore
const RaceEventSchema = mongoose.Schema({
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

const RaceEventModel = mongoose.model<RaceEventDoc, todoModelInterface>('race_event', RaceEventSchema)

export { RaceEventModel }
