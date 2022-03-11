import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { SpinnerService } from "./spinner.service";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept<T, R>(
    req: HttpRequest<T>,
    next: HttpHandler,
  ): Observable<HttpEvent<R>> {
    const key = this.buildKey(req);
    this.spinnerService.show(key);

    return next.handle(req).pipe(
      tap((res) => {
        if (res instanceof HttpResponse) {
          this.spinnerService.hide(key);
        }
      }),
      catchError((res) => {
        if (res instanceof HttpErrorResponse) {
          this.spinnerService.hide(key);
        }
        return throwError(() => res);
      }),
    );
  }

  private buildKey<T>(req: HttpRequest<T>): string {
    return `HTTP ${req.method} ${req.url}`;
  }
}
