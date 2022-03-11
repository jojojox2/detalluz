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
