import { Component, OnInit } from '@angular/core';

// se importa el servicio
import { ServicioService } from './../../../servicios/servicio.service';

// se importan las interfaces
import { Servicio } from 'src/app/interfaces/servicio';
import { HistorialServicio } from './../../../interfaces/historial-servicio';
import { ControlTienda } from 'src/app/interfaces/control';


// importacion del componente del navbar
import { NavsideComponent } from './../../navside/navside.component';

// importacion de los componentes de firestore
// tslint:disable-next-line:max-line-length
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, Action, DocumentSnapshot, DocumentChangeAction, QueryDocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-imprimir-servicio',
  templateUrl: './imprimir-servicio.component.html',
  styleUrls: ['./imprimir-servicio.component.scss']
})
export class ImprimirServicioComponent implements OnInit {
  ServicioImprimirFactura: HistorialServicio = null;
  cantidadFacturas = 0;
  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase,
    public nav: NavsideComponent
  ) {
    this.nav.mostrarNav = false;
    this.fs.doc<ControlTienda>('/ACR Motos/Control').snapshotChanges().subscribe(control => {
      this.cantidadFacturas = control.payload.data()['Cantidad Total de Facturas'];
    });
  }

  ngOnInit() {
    this.ServicioImprimirFactura = this.servicio.ServicioImprimirFactura;
  }

  // navegar
  navegar() {
    this.servicio.navegar('servicios');
  }

  // imprimir
  imprimir() {
    this.fs.doc<ControlTienda>('/ACR Motos/Control').update({
      'Cantidad Total de Facturas': this.cantidadFacturas + 1
    });
    const btnRegresar = document.getElementById('btnRegresar');
    const btnImprimir = document.getElementById('btnImprimir');
    btnRegresar.hidden = true;
    btnImprimir.hidden = true;
    window.print();
    btnRegresar.hidden = false;
    btnImprimir.hidden = false;
  }

}
