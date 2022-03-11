import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgScrollbarModule } from "ngx-scrollbar";
import { MaterialModule } from "@detalluz/material";
import { NoticeComponent } from "./notice.component";

export { Notice, NoticeType } from "./notice.model";
export { NoticeService } from "./notice.service";

@NgModule({
  declarations: [NoticeComponent],
  imports: [CommonModule, MaterialModule, NgScrollbarModule],
  exports: [NoticeComponent],
})
export class NoticeModule {}
