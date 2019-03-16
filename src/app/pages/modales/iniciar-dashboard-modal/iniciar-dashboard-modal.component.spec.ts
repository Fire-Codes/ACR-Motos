import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciarDashboardModalComponent } from './iniciar-dashboard-modal.component';

describe('IniciarDashboardModalComponent', () => {
  let component: IniciarDashboardModalComponent;
  let fixture: ComponentFixture<IniciarDashboardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciarDashboardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciarDashboardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
