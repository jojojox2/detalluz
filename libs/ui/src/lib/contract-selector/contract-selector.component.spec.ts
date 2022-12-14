import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContractsService } from "@detalluz/services";
import { of } from "rxjs";

import { ContractSelectorComponent } from "./contract-selector.component";

describe("ContractSelectorComponent", () => {
  let component: ContractSelectorComponent;
  let fixture: ComponentFixture<ContractSelectorComponent>;
  const mockContractsService = {
    getContracts: jest.fn().mockReturnValue(
      of([
        {
          id: "123",
          cups: "ESXX",
          address: "Fake street 123",
        },
      ]),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContractSelectorComponent],
      providers: [
        { provide: ContractsService, useValue: mockContractsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
