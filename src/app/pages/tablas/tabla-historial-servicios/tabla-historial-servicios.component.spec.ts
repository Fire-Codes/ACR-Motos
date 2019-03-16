import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHistorialServiciosComponent } from './tabla-historial-servicios.component';

describe('TablaHistorialServiciosComponent', () => {
  let component: TablaHistorialServiciosComponent;
  let fixture: ComponentFixture<TablaHistorialServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaHistorialServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaHistorialServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
