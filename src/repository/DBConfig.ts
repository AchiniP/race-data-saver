import DatabaseModel from "../models/DatabaseModel";
const { DATABASE_URL } = process.env;

export const dbConnection:DatabaseModel = {
  url: DATABASE_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
};

