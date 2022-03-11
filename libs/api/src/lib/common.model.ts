export interface DateRange {
  initDate?: string;
  endDate?: string;
}

export interface HourlyPrice {
  date: string;
  value?: number;
}

export interface UserData {
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
