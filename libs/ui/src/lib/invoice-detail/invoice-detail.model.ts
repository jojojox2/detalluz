import { HourlyPrice, Period } from "@detalluz/api";
import { Dayjs } from "dayjs";

export interface InvoiceConcept {
  title: string;
  calculationDetail?: string;
  value?: number;
  subconcepts?: InvoiceConcept[];
  type?: "total" | "subtotal";
}

export interface InvoiceEntry {
  initDate: Dayjs;
  endDate: Dayjs;
  value?: number;
  calculationDetail?: string;
  hourlyValues?: HourlyPrice[];
}

export interface InvoicePeriodEntry
  extends InvoiceEntry,
    Partial<Record<Period, InvoiceEntry>> {}

export interface InvoiceRangedEntry<T extends InvoiceEntry>
  extends InvoiceEntry {
  ranges: T[];
}
