import { Component, OnInit, ViewChild } from '@angular/core';

// se importa el servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// se importan las dependencias de la bases de datos
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

// se importan las interfaces
import { HistorialServicio } from './../../../interfaces/historial-servicio';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-tabla-historial-servicios',
  templateUrl: './tabla-historial-servicios.component.html',
  styleUrls: ['./tabla-historial-servicios.component.scss']
})
export class TablaHistorialServiciosComponent implements OnInit {

  // variables que contienen el observable del paginator y del sort de la tabla
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // se declaran las variables que contendran los datos de la base de datos
  coleccionVentasServicio: AngularFirestoreCollection<HistorialServicio>;

  // variables para las columnas de la tabla de los clientes y de los datos de la tabla para los clientes
  displayedColumns: string[] = ['Fecha', 'Hora', 'Cliente', 'Vendedor', 'Interes', 'TotalCordoba', 'TipoPago', 'Descripcion'];
  dataSource: MatTableDataSource<HistorialServicio>;

  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase
  ) {
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.coleccionVentasServicio = this.fs.collection<HistorialServicio>('ACR Motos/Control/Historial de Ventas de Servicios');
    this.coleccionVentasServicio.valueChanges().subscribe(servicios => {
      // se le asignan los datos a la variable de los datos de la tabla de clientes cada vez que haya un cambio
      this.dataSource = new MatTableDataSource(servicios);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

}
