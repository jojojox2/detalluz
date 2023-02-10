export interface IdeLoginResponse {
  success: string;
}

export interface IdeConsumption {
  fechaPeriodo: string;
  y: IdeYAxis;
}

export interface IdeYAxis {
  data: IdeDataItem[][];
}

export interface IdeDataItem {
  valor: string;
}

export interface IdeManagedCostumers {
  listaSalida: string[][];
}

export interface IdeManagedContracts {
  datos: IdeManagedContract[];
}

export interface IdeManagedContract {
  direccion: string;
  cups: string;
  codContrato: string;
}
