export interface EredesRequest<T = unknown> {
  jsonrpc: string;
  method: string;
  id: number;
  params?: T;
}

export interface EredesResponse {
  jsonrpc: string;
  result: string;
  id: number;
}

export interface EredesLoginParams {
  document: string;
  password: string;
}

export interface EredesLoginResponse {
  accessToken: string;
}

export interface EredesConsumptionParams {
  cups: string;
  fechaInicio: string;
  fechaFin: string;
  sector: string;
}

export interface EredesConsumptionItemResponse {
  datetime: string;
  estimated: string;
  consumo: number;
}

export interface EredesContract {
  CUPS: string;
  DIR: string;
  ACTIVO: string;
  SECTOR: string;
}
