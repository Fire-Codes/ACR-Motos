import { Component, OnInit } from '@angular/core';

// se importa el servicio
import { ServicioService } from './../../servicios/servicio.service';

@Component({
  selector: 'app-historial-servicios',
  templateUrl: './historial-servicios.component.html',
  styleUrls: ['./historial-servicios.component.scss']
})
export class HistorialServiciosComponent implements OnInit {

  constructor(
    public servicio: ServicioService
  ) { }

  ngOnInit() {
  }

  // funcion para regresar a la tabla de los servicios
  regresar() {
    this.servicio.navegar('servicios');
  }

}
