import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { DateFormats, DayjsService } from "@detalluz/shared";

export interface DatetimeValue {
  date: string;
  value?: number;
}

interface DateWithHourlyValues {
  date: string;
  values: (HourlyValue | HourlyValue[])[];
  count?: number | null | undefined;
  sum?: number | null | undefined;
  mean?: number | null | undefined;
}

interface HourlyValue {
  hour: string;
  value: number | null | undefined;
}

interface TotalValues {
  sum: (number | null | undefined)[];
  mean: (number | null | undefined)[];
  totalSum?: number | null | undefined;
  totalMean?: number | null | undefined;
}

interface DateHourIndex {
  date: string;
  hour: string;
}

interface MaxMin {
  max?: number;
  min?: number;
}

interface ValuesRanges {
  values: MaxMin;
  meanColumn: MaxMin;
  meanRow: MaxMin;
  sumColumn: MaxMin;
  sumRow: MaxMin;
}

type TotalDisplay = "none" | "sum" | "mean";

@Component({
  selector: "dtl-datetime-values-table",
  templateUrl: "./datetime-values-table.component.html",
  styleUrls: ["./datetime-values-table.component.scss"],
})
export class DatetimeValuesTableComponent implements OnInit, OnChanges {
  @Input() values?: DatetimeValue[] = [];
  @Input() unit?: string;

  @Input() invertColors = false;
  @Input() totalDisplay: TotalDisplay = "none";
  @Input() footer = false;
  @Input() dateFormat = "EEE dd MMM YY";
  @Input() longDateFormat = "EEEE dd MMMM YYYY";
  @Input() valueFormat = "1.2-2";
  @Input() valueTooltipFormat = "1.2-5";

  hourColumns: string[] = [...Array(24).keys()].map((v) =>
    `${v}h`.padStart(3, "0"),
  );
  displayedColumns: string[] = ["date", ...this.hourColumns];
  dataSource: DateWithHourlyValues[] = [];

  private ranges: ValuesRanges = this.cleanRanges();
  total: TotalValues = this.cleanTotals();

  constructor(private dayjsService: DayjsService) {}

  ngOnInit(): void {
    this.updateTable();
  }

  ngOnChanges(): void {
    this.updateTable();
  }

  private updateTable(): void {
    this.updateVisibleColumnsAndRows();
    this.createDataSource();
  }

  private updateVisibleColumnsAndRows() {
    switch (this.totalDisplay) {
      case "sum":
        this.displayedColumns = ["date", ...this.hourColumns, "sum"];
        break;
      case "mean":
        this.displayedColumns = ["date", ...this.hourColumns, "mean"];
        break;
      case "none":
      default:
        this.displayedColumns = ["date", ...this.hourColumns];
    }
  }

  private createDataSource() {
    this.dataSource = [];
    this.ranges = this.cleanRanges();
    this.total = this.cleanTotals();

    if (!this.values || this.values.length === 0) {
      return;
    }

    const dataSource: DateWithHourlyValues[] = [];

    // Map values to table
    for (const input of this.values) {
      const dateHour = this.getDateHourIndex(input.date);

      if (!dateHour) {
        continue;
      }

      let date = dataSource.find((it) => it.date === dateHour.date);

      if (!date) {
        date = {
          date: dateHour.date,
          values: [],
          sum: 0,
        };
        dataSource.push(date);
      }

      const indexHour = Number(dateHour.hour.substring(0, 2));
      const currentHourlyValue = date.values[indexHour];
      const newHourlyValue = {
        hour: dateHour.hour,
        value: input.value,
      };

      if (!currentHourlyValue) {
        date.values[indexHour] = newHourlyValue;
      } else if (currentHourlyValue != null && input.value != null) {
        if (Array.isArray(currentHourlyValue)) {
          currentHourlyValue.push(newHourlyValue); // TODO check if push or shift
        } else {
          date.values[indexHour] = [currentHourlyValue, newHourlyValue];
        }

        (<HourlyValue[]>date.values[indexHour]).sort((a, b) => {
          const aDate = this.dayjsService.parse(
            a.hour,
            DateFormats.HOUR_WITH_TIMEZONE,
            false,
          );
          const bDate = this.dayjsService.parse(
            b.hour,
            DateFormats.HOUR_WITH_TIMEZONE,
            false,
          );

          return aDate?.diff(bDate, "hour") || 0;
        });
      }

      this.updateRange("values", input.value);
    }

    // Sort rows in ascending dates
    dataSource.sort(
      (a, b) =>
        this.dayjsService
          .parse(a.date, DateFormats.ISO_LOCALDATE)
          ?.diff(b.date, "day") || 0,
    );

    // Calculate mean/sum columns
    dataSource.forEach((date) => {
      const values: number[] = date.values
        .flat()
        .map((hourlyValue: HourlyValue) => hourlyValue?.value)
        .filter((value: number | null | undefined): value is number => {
          return value !== null && value !== undefined;
        });

      date.count = values.length;
      if (date.count > 0) {
        date.sum = values.reduce((sum, current) => sum + current);
        date.mean = date.sum / values.length;

        this.updateRange("sumColumn", date.sum);
        this.updateRange("meanColumn", date.mean);
      }
    });

    // Calculate subtotal sum/mean for each column
    const hourIndex = [...Array(24).keys()];
    hourIndex.forEach((index) => {
      const values: number[] = dataSource
        .map((date) => date.values[index])
        .flat()
        .map((hourlyValue: HourlyValue) => hourlyValue?.value)
        .filter((value: number | null | undefined): value is number => {
          return value !== null && value !== undefined;
        });

      if (values.length > 0) {
        const sum = this.getSum(values);
        this.total.sum[index] = sum;
        this.total.mean[index] = sum / values.length;

        this.updateRange("sumRow", this.total.sum[index]);
        this.updateRange("meanRow", this.total.mean[index]);
      }
    });

    // Calculate total sum and mean
    this.total.totalSum = this.getSum(this.total.sum);
    let count = 0,
      sum = 0;

    dataSource.forEach((date) => {
      if (date.count != null) {
        count += date.count;

        if (date.sum != null) {
          sum += date.sum;
        }
      }
    });

    if (count > 0) {
      this.total.totalSum = sum;
      this.total.totalMean = sum / count;
    }

    this.dataSource = dataSource;
  }

  private getDateHourIndex(dateString: string): DateHourIndex | null {
    const date = this.dayjsService.parse(dateString, DateFormats.ISO, false);
    if (!date || !date.isValid()) {
      return null;
    }
    return {
      date: date.format(DateFormats.ISO_LOCALDATE),
      hour: date.format(DateFormats.HOUR_WITH_TIMEZONE),
    };
  }

  private cleanRanges(): ValuesRanges {
    return {
      values: {},
      meanColumn: {},
      meanRow: {},
      sumColumn: {},
      sumRow: {},
    };
  }

  private cleanTotals(): TotalValues {
    return {
      sum: [],
      mean: [],
    };
  }

  private updateRange(
    target: keyof ValuesRanges,
    value: number | null | undefined,
  ) {
    if (value != null) {
      const currentMin = this.ranges[target].min;
      const currentMax = this.ranges[target].max;

      if (currentMin == null || value < currentMin) {
        this.ranges[target].min = value;
      }
      if (currentMax == null || value > currentMax) {
        this.ranges[target].max = value;
      }
    }
  }

  private getSum(values: (number | null | undefined)[]): number {
    return values
      .filter((value: number | null | undefined): value is number => {
        return value !== null && value !== undefined;
      })
      .reduce((sum, current) => sum + current);
  }

  getHsl(
    value: number | null | undefined,
    target: keyof ValuesRanges = "values",
  ): string {
    if (
      value == null ||
      this.ranges[target].min == null ||
      this.ranges[target].max == null
    ) {
      return "";
    }

    const relativeValue =
      (value - <number>this.ranges[target].min) /
      (<number>this.ranges[target].max - <number>this.ranges[target].min); // 0 to 1

    const hue = this.invertColors
      ? 120 * relativeValue // 0 to 120, red to green
      : 120 * (1 - relativeValue); // 120 to 0, green to red
    const saturation = "100%";
    const lightness = "75%";
    const alpha = 0.75;

    return `hsl(${hue}, ${saturation}, ${lightness}, ${alpha})`;
  }
}
