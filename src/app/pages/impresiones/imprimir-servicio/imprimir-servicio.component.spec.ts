import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirServicioComponent } from './imprimir-servicio.component';

describe('ImprimirServicioComponent', () => {
  let component: ImprimirServicioComponent;
  let fixture: ComponentFixture<ImprimirServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
