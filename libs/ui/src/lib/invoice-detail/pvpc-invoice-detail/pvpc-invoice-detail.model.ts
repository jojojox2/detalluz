import {
  InvoiceEntry,
  InvoicePeriodEntry,
  InvoiceRangedEntry,
} from "../invoice-detail.model";

export interface PVPCInvoice extends InvoiceEntry {
  powerCosts: PVPCPowerCosts;
  energyCosts: PVPCEnergyCosts;
  electricityTax: InvoiceEntry;
  subtotal: InvoiceEntry;

  meterRental: InvoiceEntry;
  total: InvoiceEntry;

  vat: InvoiceEntry;
}

export interface PVPCPowerCosts extends InvoiceEntry {
  distributionTolls: InvoiceRangedEntry<InvoicePeriodEntry>;
  charges: InvoiceRangedEntry<InvoicePeriodEntry>;
  marketingMargin: InvoiceRangedEntry<InvoiceEntry>;
}

export interface PVPCEnergyCosts extends InvoiceEntry {
  tolls: InvoiceRangedEntry<InvoicePeriodEntry>;
  charges: InvoiceRangedEntry<InvoicePeriodEntry>;
  consumedEnergy: InvoiceEntry;
}
