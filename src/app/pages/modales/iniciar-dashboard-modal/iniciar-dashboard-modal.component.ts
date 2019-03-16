import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// se importa el servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

@Component({
  selector: 'app-iniciar-dashboard-modal',
  templateUrl: './iniciar-dashboard-modal.component.html',
  styleUrls: ['./iniciar-dashboard-modal.component.scss']
})
export class IniciarDashboardModalComponent implements OnInit {
  Usuario = this.servicio.usuarioAdministrar;
  contrasena = '';
  constructor(
    public dialog: MatDialogRef<IniciarDashboardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    public servicio: ServicioService
  ) { }

  ngOnInit() {
  }

  iniciar() {
    if (this.contrasena === '') {
      this.servicio.newToast(0, 'Contraseña Vacia', 'Debe de ingresar una contraseña');
    } else if (this.contrasena !== this.Usuario.Contrasena) {
      this.servicio.newToast(0, 'Error de Contraseña', 'Error al iniciar sesion, contraseña incorrecta');
      this.contrasena = '';
    } else {
      this.servicio.logueado = true;
      this.dialog.close();
    }
  }
}
