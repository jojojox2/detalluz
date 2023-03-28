import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";
import { Db, MongoClient } from "mongodb";

export const Detalluz: {
  db?: Db;
} = {};

export function init(): void {
  initDayjs();
  initDatabase();
}

function initDayjs(): void {
  dayjs.extend(customParseFormat);
  dayjs.locale("es");
  dayjs.extend(utc);
  dayjs.extend(timezone);
}

function initDatabase(): void {
  const dbUri = process.env["MONGODB_URI"];

  if (dbUri) {
    const client = new MongoClient(dbUri);
    Detalluz.db = client.db("detalluz");
  } else {
    console.warn(
      "MONGODB_URI property not found! No database connection will be created",
    );
  }
}
