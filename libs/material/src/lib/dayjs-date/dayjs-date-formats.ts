import { MatDateFormats } from "@angular/material/core";

export const MAT_DAYJS_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: [
      "DD/MM/YYYY",
      "DD/MM",
      "DD.MM.YYYY",
      "DD.MM",
      "DDMMYYYY",
      "DDMM",
      "DD-MM-YYYY",
      "DD-MM",
      "YYYY-MM-DD",
    ],
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
