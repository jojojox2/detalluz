import { TestBed } from "@angular/core/testing";

import { SpinnerService } from "./spinner.service";

describe("SpinnerService", () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should update spinner status on show", (done) => {
    const watcher = service.watch();
    let firstEvent = true;

    watcher.subscribe((status) => {
      if (firstEvent) {
        firstEvent = false;
        expect(status).toBe(false);
      } else {
        expect(status).toBe(true);
        done();
      }
    });

    service.show();
  });

  it("should update spinner status on hide", (done) => {
    service.show();
    const watcher = service.watch();
    let firstEvent = true;

    watcher.subscribe((status) => {
      if (firstEvent) {
        firstEvent = false;
        expect(status).toBe(true);
      } else {
        expect(status).toBe(false);
        done();
      }
    });

    service.hide();
  });

  it("should update spinner status with different keys", (done) => {
    const watcher = service.watch();
    let eventNumber = 0;

    watcher.subscribe((status) => {
      switch (eventNumber++) {
        case 0:
          expect(status).toBe(false);
          break;
        case 1:
          expect(status).toBe(true);
          break;
        case 2:
          expect(status).toBe(true);
          break;
        case 3:
          expect(status).toBe(true);
          break;
        case 4:
          expect(status).toBe(false);
          done();
          break;
      }
    });

    service.show("key1");
    service.show("key2");
    service.hide("key2");
    service.hide("key1");
  });
});
