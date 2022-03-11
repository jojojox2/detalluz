import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpinnerService {
  private progressPending: {
    [key: string]: boolean;
  } = {};
  private defaultKey = "default";

  private statusSubject = new BehaviorSubject<boolean>(this.isActive());

  public show(key?: string): void {
    this.progressPending[key || this.defaultKey] = true;
    this.statusSubject.next(this.isActive());
  }

  public hide(key?: string): void {
    delete this.progressPending[key || this.defaultKey];
    this.statusSubject.next(this.isActive());
  }

  public watch(): Observable<boolean> {
    return this.statusSubject;
  }

  private isActive(): boolean {
    return Object.values(this.progressPending).find((it) => it) || false;
  }
}
