import { Consumption, Contract, HourlyPrice, UserData } from "@detalluz/api";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { AppError } from "../../common/error";
import {
  EredesConsumptionItemResponse,
  EredesConsumptionParams,
  EredesContract,
  EredesLoginParams,
  EredesLoginResponse,
  EredesRequest,
  EredesResponse,
} from "./eredes.model";

const OPTIONS = {
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Accept": "application/json; charset=utf-8",
    "apikey": process.env["EREDES_API_KEY"] || "",
  },
};

export async function createSession(input: UserData): Promise<string> {
  console.debug(`Invoking: createSession(${input.username}, ***)`);

  const loginData: EredesRequest<EredesLoginParams> = {
    jsonrpc: "2.0",
    method: "login",
    id: generateId(),
    params: {
      document: input.username,
      password: Buffer.from(input.password).toString("base64"),
    },
  };

  const url = `https://srv.misconsumos.eredesdistribucion.es/services/es.edp.consumos.Login`;
  console.debug(`[URL] POST ${url}`);

  return axios.post<EredesResponse>(url, loginData, OPTIONS).then(
    (response) => {
      console.debug(`[RESPONSE] ${response.status} ${response.statusText}`);

      if (!response.data?.result) {
        throw new AppError("Could not connect with the server", 401);
      }

      const result: EredesLoginResponse = JSON.parse(response.data.result);

      if (!result.accessToken) {
        throw new AppError("Invalid username/password", 401);
      }

      return result.accessToken;
    },
    (error) => {
      console.error(`[ERROR] ${error}`);

      throw new AppError(
        "Error while connecting with srv.misconsumos.eredesdistribucion.es",
        500,
      );
    },
  );
}

export async function getConsumption(
  sessionId: string,
  initDate: string,
  endDate: string,
  id: string,
): Promise<Consumption> {
  console.debug(
    `Invoking: getConsumption(***, ${initDate}, ${endDate}, ${id})`,
  );

  const eredesInitDate = parseDate(initDate);
  const eredesEndDate = parseDate(endDate);
  const idParts = id.split("-");
  const cups = idParts[0];
  const sector = idParts[1];

  const requestBody: EredesRequest<EredesConsumptionParams> = {
    jsonrpc: "2.0",
    method: "getConsumos",
    id: generateId(),
    params: {
      cups: cups,
      fechaInicio: eredesInitDate,
      fechaFin: eredesEndDate,
      sector: sector,
    },
  };

  const url = `https://srv.misconsumos.eredesdistribucion.es/services/es.edp.consumos.Consumos`;
  console.debug(`[URL] POST ${url}`);

  const authorizedOptions = {
    ...OPTIONS,
    ...{
      headers: {
        ...OPTIONS.headers,
        sessionkey: sessionId,
      },
    },
  };

  return axios.post<EredesResponse>(url, requestBody, authorizedOptions).then(
    (response) => {
      console.debug(`[RESPONSE] ${response.status} ${response.statusText}`);

      const result: EredesConsumptionItemResponse[] = JSON.parse(
        response.data.result,
      );

      return {
        unit: "Wh",
        consumption: parseValues(result),
      };
    },
    (error) => {
      console.error(`[ERROR] ${error}`);

      throw new AppError(
        "Error while connecting with srv.misconsumos.eredesdistribucion.es",
        500,
      );
    },
  );
}

export async function getContracts(sessionId: string): Promise<Contract[]> {
  console.debug(`Invoking: getContracts(***)`);

  const url = `https://srv.misconsumos.eredesdistribucion.es/services/es.edp.consumos.Suministro`;
  console.debug(`[URL] POST ${url}`);

  const requestBody: EredesRequest = {
    jsonrpc: "2.0",
    method: "getListadoSuministros",
    id: generateId(),
  };

  const authorizedOptions = {
    ...OPTIONS,
    ...{
      headers: {
        ...OPTIONS.headers,
        sessionkey: sessionId,
      },
    },
  };

  return axios.post<EredesResponse>(url, requestBody, authorizedOptions).then(
    (response) => {
      console.debug(`[RESPONSE] ${response.status} ${response.statusText}`);

      const result: EredesContract[] = JSON.parse(response.data.result);

      return parseContracts(result);
    },
    (error) => {
      console.error(`[ERROR] ${error}`);

      throw new AppError(
        "Error while connecting with srv.misconsumos.eredesdistribucion.es",
        500,
      );
    },
  );
}

function generateId(): number {
  return new Date().getTime();
}

function parseDate(date: string): string {
  return dayjs(date).format("DD/MM/YYYY");
}

function parseValues(response: EredesConsumptionItemResponse[]): HourlyPrice[] {
  const consumptionList: HourlyPrice[] = [];

  if (response?.length > 0) {
    let date: Dayjs | null = null;
    response.forEach((item) => {
      if (!date) {
        date = getDate(item.datetime);
      }
      if (date) {
        if (item.estimated === "r") {
          consumptionList.push({
            date: date
              .tz("Europe/Madrid", false)
              .format("YYYY-MM-DDTHH:mm:ss.mmmZ"),
            value: item.consumo * 1000,
          });
        }

        date = date.add(1, "h");
      }
    });
  }

  return consumptionList;
}

function getDate(value: string): Dayjs | null {
  if (value) {
    const tmpDate = dayjs.tz(value, "DD/MM/YYYY HH:mm", "Europe/Madrid");

    if (tmpDate.isValid()) {
      return tmpDate.subtract(1, "h").utc(false);
    }
  }

  return null;
}

function parseContracts(response: EredesContract[]): Contract[] {
  const contracts: Contract[] = [];

  if (response) {
    for (const item of response) {
      if (item.ACTIVO === "S") {
        const contract: Contract = {
          id: `${item.CUPS}-${item.SECTOR}`,
          cups: item.CUPS,
          address: item.DIR,
        };

        contracts.push(contract);
      }
    }
  }

  return contracts;
}
