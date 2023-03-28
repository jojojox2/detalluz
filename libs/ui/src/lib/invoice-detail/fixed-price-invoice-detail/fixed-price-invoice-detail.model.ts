import {
  InvoiceEntry,
  InvoicePeriodEntry,
  InvoiceRangedEntry,
} from "../invoice-detail.model";

export interface FixedPriceInvoice extends InvoiceEntry {
  powerCosts: FixedPricePowerCosts;
  energyCosts: FixedPriceEnergyCosts;
  subtotal: InvoiceEntry;

  meterRental: InvoiceEntry;
  total: InvoiceEntry;

  vat: InvoiceEntry;
}

export interface FixedPricePowerCosts extends InvoiceEntry {
  hiredPower: InvoiceRangedEntry<InvoicePeriodEntry>;
}

export interface FixedPriceEnergyCosts extends InvoiceEntry {
  consumedEnergy: InvoiceRangedEntry<InvoiceEntry>;
  communityElectricityTax: InvoiceRangedEntry<InvoiceEntry>;
}
