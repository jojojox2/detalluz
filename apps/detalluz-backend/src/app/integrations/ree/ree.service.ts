import axios from "axios";
import dayjs from "dayjs";
import { Charges, HourlyPrice, Prices } from "@detalluz/api";
import { AppError } from "../../common/error";
import { ReeResponse, ReeValue } from "./ree.model";

const OPTIONS = {
  headers: {
    "Accept": "application/json; charset=utf-8",
    "x-api-key": process.env["REE_API_KEY"] || "",
  },
};

export async function getPVPCPrices(
  initDate: string,
  endDate: string,
): Promise<Prices> {
  console.debug(`Invoking: getPVPCPices(${initDate}, ${endDate})`);

  const reeInitDate = parseDate(initDate, 0);
  const reeEndDate = parseDate(endDate, 23);

  const url = `https://api.esios.ree.es/indicators/1001?start_date=${reeInitDate}&end_date=${reeEndDate}&geo_agg=sum&geo_ids[]=8741&time_trunc=hour&locale=es`;
  console.debug(`[URL] GET ${url}`);

  return axios.get<ReeResponse>(url, OPTIONS).then(
    (response) => {
      console.debug(`[RESPONSE] ${response.status} ${response.statusText}`);

      return {
        unit: "€/kWh",
        prices: parseValues(response.data),
      };
    },
    (error) => {
      console.error(`[ERROR] ${error}`);

      throw new AppError("Error while connecting with api.esios.ree.es", 500);
    },
  );
}

export async function getPVPCCharges(
  initDate: string,
  endDate: string,
): Promise<Charges> {
  console.debug(`Invoking: getPVPCCharges(${initDate}, ${endDate})`);

  const reeInitDate = parseDate(initDate, 0);
  const reeEndDate = parseDate(endDate, 23);

  const url = `https://api.esios.ree.es/indicators/1876?start_date=${reeInitDate}&end_date=${reeEndDate}&geo_agg=sum&geo_ids[]=8741&time_trunc=hour&locale=es`;
  console.debug(`[URL] GET ${url}`);

  return axios.get(url, OPTIONS).then(
    (response) => {
      console.debug(`[RESPONSE] ${response.status} ${response.statusText}`);

      return {
        unit: "€/kWh",
        charges: parseValues(response.data),
      };
    },
    (error) => {
      console.error(`[ERROR] ${error}`);

      throw new AppError("Error while connecting with api.esios.ree.es", 500);
    },
  );
}

function parseDate(date: string, hour = 0): string {
  return dayjs
    .tz(
      date + "T" + (hour < 10 ? "0" + hour : hour) + ":00:00",
      "Europe/Madrid",
    )
    .format("YYYY-MM-DDTHH:mm:ssZ");
}

function parseValues(response: ReeResponse): HourlyPrice[] {
  const priceList: HourlyPrice[] = [];

  response?.indicator?.values?.forEach((item: ReeValue) => {
    if (item?.datetime) {
      priceList.push({
        date: dayjs(item.datetime)
          .tz("Europe/Madrid")
          .format("YYYY-MM-DDTHH:mm:ss.mmmZ"),
        value: parseTokWh(item.value),
      });
    }
  });

  return priceList;
}

function parseTokWh(value: number): number {
  return Number((value / 1000).toPrecision(5));
}
