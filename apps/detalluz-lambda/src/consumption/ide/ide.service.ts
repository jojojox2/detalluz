import { Consumption, HourlyPrice, UserData } from "@detalluz/api";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { AppError } from "../../common/error";
import { IdeConsumption, IdeDataItem, IdeLoginResponse } from "./ide.model";

const OPTIONS = {
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Accept": "application/json; charset=utf-8",
  },
};

export async function createSession(input: UserData): Promise<string> {
  console.debug(`Invoking: createSession(${input.username}, ***)`);

  const loginData = [
    input.username,
    input.password,
    null,
    "",
    "",
    "",
    "0",
    "",
    "s",
  ];

  const url = `https://www.i-de.es/consumidores/rest/loginNew/login`;
  console.debug(`[URL] POST ${url}`);

  return axios.post<IdeLoginResponse>(url, loginData, OPTIONS).then(
    (response) => {
      console.debug(`[RESPONSE] ${response.status} ${response.statusText}`);

      if (`${response.data?.success}` !== "true") {
        throw new AppError("Invalid username/password", 401);
      }

      return extractSessionId(response.headers["set-cookie"]);
    },
    (error) => {
      console.error(`[ERROR] ${error}`);

      throw new AppError("Error while connecting with www.i-de.es", 500);
    },
  );
}

export async function getConsumption(
  sessionId: string,
  initDate: string,
  endDate: string,
): Promise<Consumption> {
  console.debug(`Invoking: getConsumption(***, ${initDate}, ${endDate})`);

  const ideInitDate = parseDate(initDate);
  const ideEndDate = parseDate(endDate);

  const url = `https://www.i-de.es/consumidores/rest/consumoNew/obtenerDatosConsumoPeriodo/fechaInicio/${ideInitDate}00:00:00/fechaFinal/${ideEndDate}00:00:00/`;
  console.debug(`[URL] GET ${url}`);

  const authorizedOptions = {
    ...OPTIONS,
    ...{
      headers: {
        Cookie: `JSESSIONID=${sessionId}`,
      },
    },
  };

  return axios.get<IdeConsumption>(url, authorizedOptions).then(
    (response) => {
      console.debug(`[RESPONSE] ${response.status} ${response.statusText}`);

      return {
        unit: "Wh",
        consumption: parseValues(response.data),
      };
    },
    (error) => {
      console.error(`[ERROR] ${error}`);

      throw new AppError("Error while connecting with www.i-de.es", 500);
    },
  );
}

function extractSessionId(cookieHeaders: string[] | undefined): string {
  const sessionId = cookieHeaders
    ?.map((str) => {
      const keyValue = str.split(";")[0].split("=");

      return {
        key: keyValue[0],
        value: keyValue[1],
      };
    })
    .find((cookie) => cookie.key === "JSESSIONID")?.value;

  if (!sessionId) {
    throw new AppError("No session was created", 401);
  }

  return sessionId;
}

function parseDate(date: string): string {
  return dayjs(date).format("DD-MM-YYYY");
}

function parseValues(response: IdeConsumption): HourlyPrice[] {
  const consumptionList: HourlyPrice[] = [];

  const startDate = getConsumptionStartDate(response);

  if (
    startDate &&
    response?.y?.data?.length > 0 &&
    response.y.data[0]?.length > 0
  ) {
    const data = response.y.data[0];
    let date = dayjs(startDate);

    data.forEach((item: IdeDataItem) => {
      if (item) {
        consumptionList.push({
          date: date.format("YYYY-MM-DDTHH:mm:ss.mmmZ"),
          value: Number(item.valor),
        });
      }
      date = date.add(1, "h");
    });
  }

  return consumptionList;
}

function getConsumptionStartDate(response: IdeConsumption): Dayjs | null {
  if (response?.fechaPeriodo) {
    const tmpDate = dayjs(response.fechaPeriodo, "DD-MM-YYYYHH:mm:ss", true);

    if (tmpDate.isValid()) {
      return tmpDate;
    }
  }

  return null;
}
