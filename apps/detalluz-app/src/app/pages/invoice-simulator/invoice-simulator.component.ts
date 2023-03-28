import { Component, OnInit } from "@angular/core";
import {
  Charges,
  Configuration,
  Consumption,
  Contract,
  Prices,
} from "@detalluz/api";
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
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

declare const $localize: LocalizeFn;

@UntilDestroy()
@Component({
  selector: "dtl-invoice-simulator",
  templateUrl: "./invoice-simulator.component.html",
  styleUrls: ["./invoice-simulator.component.scss"],
})
export class InvoiceSimulatorComponent implements OnInit {
  contract: Contract | null = null;

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

  mobile = false;
  consumptionPanelOpened = false;
  pricesPanelOpened = false;

  private genericErrorMessage = $localize`:@@invoice-simulator.generic-error:Oops! An unexpected error occurred... Please try again later`;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private pricesService: PricesService,
    private chargesService: ChargesService,
    private consumptionService: ConsumptionService,
    private configurationService: ConfigurationService,
    private dayjsService: DayjsService,
    private authService: AuthService,
    private noticeService: NoticeService,
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.mobile = result.matches;
      });
  }

  ngOnInit(): void {
    this.resetRange();

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

  contractSelected(contract: Contract): void {
    this.contract = contract;
    this.updateTables();
  }

  resetRange() {
    this.range = {
      initDate: this.dayjsService.today().add(-1, "month"),
      endDate: this.dayjsService.today().add(-1, "day"),
    };
  }

  updateTables() {
    if (
      !this.isAuthenticated ||
      !this.contract ||
      !this.range.initDate ||
      !this.range.endDate
    ) {
      return;
    }

    this.getConfiguration();

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
    this.consumptionService
      .getConsumption(initDate, endDate, this.contract.id)
      .subscribe({
        next: (consumption) => {
          this.consumption = consumption;
        },
        error: () => {
          this.noticeService.showErrorMessage(this.genericErrorMessage);
        },
      });
  }
}
