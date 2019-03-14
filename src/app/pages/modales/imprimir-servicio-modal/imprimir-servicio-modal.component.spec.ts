import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirServicioModalComponent } from './imprimir-servicio-modal.component';

describe('ImprimirServicioModalComponent', () => {
  let component: ImprimirServicioModalComponent;
  let fixture: ComponentFixture<ImprimirServicioModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirServicioModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirServicioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
