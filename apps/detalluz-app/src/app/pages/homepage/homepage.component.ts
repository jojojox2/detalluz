import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { LocalizeFn } from "@angular/localize/init";
import { Prices } from "@detalluz/api";
import { PricesService } from "@detalluz/services";
import { DayjsService, DateFormats } from "@detalluz/shared";
import { NoticeService, RangeSelectorForm } from "@detalluz/ui";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

declare const $localize: LocalizeFn;

@UntilDestroy()
@Component({
  selector: "dtl-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"],
})
export class HomepageComponent implements OnInit {
  invoiceSimulatorLink = "/invoice-simulator";

  range: RangeSelectorForm = {};

  prices: Prices | null = null;

  mobile = false;

  private genericErrorMessage = $localize`:@@homepage.generic-error:Oops! An unexpected error occurred... Please try again later`;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private pricesService: PricesService,
    private dayjsService: DayjsService,
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
    this.updateTable();
  }

  resetRange() {
    this.range = {
      initDate: this.dayjsService.today().add(-6, "day"),
      endDate: this.dayjsService.today(),
    };
  }

  updateTable() {
    if (!this.range.initDate || !this.range.endDate) {
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
    this.pricesService.getPrices(initDate, endDate).subscribe({
      next: (prices) => {
        this.prices = prices;
      },
      error: () => {
        this.noticeService.showErrorMessage(this.genericErrorMessage);
      },
    });
  }
}
