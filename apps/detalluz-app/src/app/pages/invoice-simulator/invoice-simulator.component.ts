import { Component, OnInit } from "@angular/core";
import { Charges, Configuration, Consumption, Prices } from "@detalluz/api";
import { DateFormats, DayjsService, RouterLinkTyped } from "@detalluz/shared";
import {
  AuthService,
  ChargesService,
  ConfigurationService,
  ConsumptionService,
  PricesService,
} from "@detalluz/services";
import {
  InvoiceConfiguration,
  NoticeService,
  RangeSelectorForm,
} from "@detalluz/ui";
import { ActivatedRoute } from "@angular/router";
import { LocalizeFn } from "@angular/localize/init";

declare const $localize: LocalizeFn;

@Component({
  selector: "dtl-invoice-simulator",
  templateUrl: "./invoice-simulator.component.html",
  styleUrls: ["./invoice-simulator.component.sass"],
})
export class InvoiceSimulatorComponent implements OnInit {
  range: RangeSelectorForm = {};

  prices: Prices | null = null;

  charges: Charges | null = null;

  consumption: Consumption | null = null;

  configuration: Configuration | null = null;

  isAuthenticated = false;

  loginLink: RouterLinkTyped = [{ outlets: { dialog: ["login"] } }];
  loginLinkRelative = this.route.parent;

  invoiceConfiguration: InvoiceConfiguration = {
    peakHiredPower: 4.6,
    valleyHiredPower: 4.6,
  };

  private genericErrorMessage = $localize`:@@invoice-simulator.generic-error:Oops! An unexpected error occurred... Please try again later`;

  constructor(
    private route: ActivatedRoute,
    private pricesService: PricesService,
    private chargesService: ChargesService,
    private consumptionService: ConsumptionService,
    private configurationService: ConfigurationService,
    private dayjsService: DayjsService,
    private authService: AuthService,
    private noticeService: NoticeService,
  ) {}

  ngOnInit(): void {
    this.resetRange();
    this.getConfiguration();

    this.authService.watchAuthentication().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      this.updateTables();
    });
  }

  private getConfiguration(): void {
    this.configurationService.getConfiguration().subscribe({
      next: (configuration) => {
        this.configuration = configuration;
      },
      error: () => {
        this.noticeService.showErrorMessage(this.genericErrorMessage);
      },
    });
  }

  resetRange() {
    this.range = {
      initDate: this.dayjsService.today().add(-1, "month"),
      endDate: this.dayjsService.today().add(-1, "day"),
    };
  }

  updateTables() {
    if (!this.isAuthenticated || !this.range.initDate || !this.range.endDate) {
      return;
    }

    const initDate = this.dayjsService.format(
      this.range.initDate,
      DateFormats.ISO_LOCALDATE,
    );
    const endDate = this.dayjsService.format(
      this.range.endDate,
      DateFormats.ISO_LOCALDATE,
    );

    this.prices = null;
    this.charges = null;
    this.consumption = null;
    this.pricesService.getPrices(initDate, endDate).subscribe({
      next: (prices) => {
        this.prices = prices;
      },
      error: () => {
        this.noticeService.showErrorMessage(this.genericErrorMessage);
      },
    });
    this.chargesService.getCharges(initDate, endDate).subscribe({
      next: (charges) => {
        this.charges = charges;
      },
      error: () => {
        this.noticeService.showErrorMessage(this.genericErrorMessage);
      },
    });
    this.consumptionService.getConsumption(initDate, endDate).subscribe({
      next: (consumption) => {
        this.consumption = consumption;
      },
      error: () => {
        this.noticeService.showErrorMessage(this.genericErrorMessage);
      },
    });
  }
}
