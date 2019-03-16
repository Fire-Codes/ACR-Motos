import { ServicioService } from 'src/app/servicios/servicio.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';


// importacion de los componente para mostrar los modales
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// importacion del componente del navbar
import { NavsideComponent } from './../navside/navside.component';

export interface State {
  flag: string;
  name: string;
  population: string;
}

export interface Section {
  name: string;
  updated: Date;
}


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  folders: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];
  constructor(
    public ngbModal: NgbModal,
    public nav: NavsideComponent,
    public servicio: ServicioService
  ) {
    this.nav.mostrarNav = true;
  }

  ngOnInit() {
  }

  // funcion para abrir los modales de manera centrada
  mostrarModal(content: string) {
    this.ngbModal.open(content, { centered: true });
  }

  // funcion para ver el historial de los servicios
  verHistorialServicios() {
    this.servicio.navegar('historialServicio');
  }
}
