export interface DateRange {
  initDate?: string;
  endDate?: string;
}
export interface DateRangeWithId extends DateRange {
  id?: string;
}

export interface HourlyPrice {
  date: string;
  value?: number;
}

export interface UserData {
  target: string;
  username: string;
  password: string;
}

export interface Token {
  token: string;
}

export interface Message {
  message: string;
  errors?: string[];
}
