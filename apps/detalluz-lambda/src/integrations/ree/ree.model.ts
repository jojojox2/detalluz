export interface ReeResponse {
  indicator: ReeIndicator;
}

export interface ReeIndicator {
  values: ReeValue[];
}

export interface ReeValue {
  value: number;
  datetime: string;
}
