import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDayjsDateModule } from "./dayjs-date/dayjs-date-adapter.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTreeModule } from "@angular/material/tree";
import { MatTabsModule } from "@angular/material/tabs";

export * from "./dayjs-date/dayjs-date-adapter.module";

const modules = [
  BrowserAnimationsModule,
  FlexLayoutModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDayjsDateModule,
  MatDialogModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatExpansionModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatTableModule,
  MatTabsModule,
  MatTreeModule,
  MatSelectModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
