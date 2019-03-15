import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

// se importan las interfaces
import { Usuario } from './../../../interfaces/usuario';
import { Producto } from './../../../interfaces/producto';
import { ProductoFactura } from './../../../interfaces/producto-factura';
import { Cliente } from 'src/app/interfaces/cliente';

// importacion del servicio
import { ServicioService } from 'src/app/servicios/servicio.service';

// importacion del angular NgBootstrapModule
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// se importa el componente de matsort y mattabledatasource
import { MatTableDataSource, MatSort } from '@angular/material';

// se importa el componente de factura
import { FacturarComponent } from './../../facturar/facturar.component';

// se importa el componente para imprimir factura
import { ImprimirFacturaComponent } from '../../impresiones/imprimir-factura/imprimir-factura.component';

// se importa el componente para seleccionar los productos
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';

// se importan las interfaces
import { TipoProductos } from 'src/app/interfaces/ventas/tipo-productos';
import { VentasDiarias } from 'src/app/interfaces/ventas/dia/ventas-diarias';
import { ControlTienda } from 'src/app/interfaces/control';
import { HistorialCompra } from 'src/app/interfaces/historial-compra';
import { Factura } from 'src/app/interfaces/factura';

// importacion de los componentes de la base de datos
import { AngularFirestore, Action, DocumentSnapshot } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';




@Component({
  selector: 'app-venta-rapida',
  templateUrl: './venta-rapida.component.html',
  styleUrls: ['./venta-rapida.component.scss']
})
export class VentaRapidaComponent implements OnInit {

  // variable que almacena todos los meses del año
  meses: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  // variable que contendra las compras actuales del cliente
  totalComprasActualesCliente: number;

  // variables que almacenan los documentos de firestore
  clientes: Observable<Cliente[]>;
  vendedores: Observable<Usuario[]>;

  // variables que almacenaran los valores de busqueda para los documentos de firestore
  valordebusquedaCliente = '';
  valordebusquedaVendedor = '';

  // variables para calculos de la venta
  venderPrecioCompra = false;
  cantidadDescuento = 0;
  public precioFinal: number;
  tipoDescuento = '';
  cantidadCalcularDescuento = 0;
  tipoDescuentoCantidad = false;
  cantidadVender: 0;
  hayDatosEnTabla = false;
  tipoCambioMoneda = 0;
  productoEliminar: ProductoFactura;

  // variable que almacena el array de productos que se agregaran al mattable
  productos: ProductoFactura[];

  // variable que contendra el tipo de pago a realizar
  tipoPago = '';

  // variable que contiene los datos de la tabla y las columnas a ser mostradas
  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = ['Producto', 'Modelo', 'Precio', 'Descuento', 'Cantidad', 'TotalCordoba', 'TotalDolar', 'Acciones'];
  productosFactura: MatTableDataSource<ProductoFactura>;


  // variable que emitira el evento para cuando se deba de cerra el modal
  @Output() cerrarModalVentaRapida = new EventEmitter();

  // variables que contendran ya se al usuario o al producto inicial
  @Input() public cliente: Cliente = null;
  @Input() public producto: Producto = null;

  // variable que es de tipo observable del matsort de la tabla
  @ViewChild(MatSort) sort: MatSort;
  totalFacturas: number;

  // variable que se enviara al componente de imprimir la factura a un dado caso que asi saea
  facturaImprimir: Factura = null;

  // variables que contendra los datos del grafico semanal
  public datosVentasSemanaFirestore: TipoProductos;
  public datosVentasSemanaLocal: TipoProductos;
  public totalVentasSemana = 0;

  // variables que contendran los datos del grafico anual
  public datosVentasAnualFirestore: TipoProductos;
  public datosVentasAnualesLocal: TipoProductos;
  public totalVentasAnual = 0;

  // variables que contendran los datos del grafico diario
  public datosVentasDiarioFirestore: VentasDiarias;
  public datosVentasDiarioLocal: number[];
  public totalVentasDia = 0;

  // variable que contendra los datos del grafico de las ganancias semanales
  public datosGananciasSemanaFirestore: TipoProductos;
  public datosGananciasSemanaLocal: TipoProductos;
  public totalGananciasSemana = 0;

  // variables que contendra los datos del grafico de las ganancias anuales
  public datosGananciasAnualFirestore: TipoProductos;
  public datosGananciasAnualesLocal: TipoProductos;
  public totalGananciasAnual = 0;

  // variables que contendran los datlos del grafico de ganancias diarias
  public datosGananciasDiarioFirestore: VentasDiarias;
  public datosGananciasDiarioLocal: number[];
  public totalGananciasDia = 0;

  constructor(
    public servicio: ServicioService,
    public fs: AngularFirestore,
    public db: AngularFireDatabase,
    public ngbModal: NgbModal,
    public factura: ImprimirFacturaComponent
  ) {

    // se define la variable para extraer el tiempo
    const tiempo = new Date();

    // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente para las ventas
    // tslint:disable-next-line:max-line-length
    this.fs.doc<TipoProductos>(`ACR Motos/Control/Ventas/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
      .snapshotChanges().subscribe(semana => {
        this.datosVentasSemanaFirestore = semana.payload.data();
        this.datosVentasSemanaLocal = this.datosVentasSemanaFirestore;
        this.totalVentasSemana = semana.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente para las ventas
    this.fs.doc<TipoProductos>(`ACR Motos/Control/Ventas/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
      .snapshotChanges().subscribe(anuales => {
        this.datosVentasAnualFirestore = anuales.payload.data();
        this.datosVentasAnualesLocal = this.datosVentasAnualFirestore;
        this.totalVentasAnual = anuales.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del dia actual para mostrar en los graficos diarios correctamente para las ventas
    // tslint:disable-next-line:max-line-length
    this.fs.doc<VentasDiarias>(`ACR Motos/Control/Ventas/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
      .snapshotChanges().subscribe(diario => {
        this.datosVentasDiarioFirestore = diario.payload.data();
        this.datosVentasDiarioLocal = this.datosVentasDiarioFirestore.Datos;
        this.totalVentasDia = diario.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore de la semana actual para mostrarlo en los graficos correctamente para las ganancias
    // tslint:disable-next-line:max-line-length
    this.fs.doc<TipoProductos>(`ACR Motos/Control/Ganancias/${this.servicio.tienda}/Semanales/${this.servicio.extraerAno()}/Datos/Semana${this.servicio.extraerNumeroSemana()}`)
      .snapshotChanges().subscribe(semana => {
        this.datosGananciasSemanaFirestore = semana.payload.data();
        this.datosGananciasSemanaLocal = this.datosGananciasSemanaFirestore;
        this.totalGananciasSemana = semana.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del mes actual para mostrar en los graficos anuales correctamente para las ganancias
    this.fs.doc<TipoProductos>(`ACR Motos/Control/Ganancias/${this.servicio.tienda}/Anuales/${this.servicio.extraerAno()}`)
      .snapshotChanges().subscribe(anuales => {
        this.datosGananciasAnualFirestore = anuales.payload.data();
        this.datosGananciasAnualesLocal = this.datosGananciasAnualFirestore;
        this.totalGananciasAnual = anuales.payload.data().TotalVentas;
      });

    // se extraen los datos de firestore del dia actual para mostrar en los graficos diarios correctamente para las ganancias
    // tslint:disable-next-line:max-line-length
    this.fs.doc<VentasDiarias>(`ACR Motos/Control/Ganancias/${this.servicio.tienda}/Diarias/${this.servicio.extraerAno()}/Datos/${tiempo.getDate()}-${this.servicio.meses[tiempo.getMonth()]}-${tiempo.getFullYear()}`)
      .snapshotChanges().subscribe(diario => {
        this.datosGananciasDiarioFirestore = diario.payload.data();
        this.datosGananciasDiarioLocal = this.datosGananciasDiarioFirestore.Datos;
        this.totalGananciasDia = diario.payload.data().TotalVentas;
      });


    // se inicializa la variable de tipo de cambio de moneda
    this.fs.doc('ACR Motos/Control').snapshotChanges()
      .subscribe((control: Action<DocumentSnapshot<ControlTienda>>) => {
        this.tipoCambioMoneda = control.payload.data()['Tipo de Cambio'];
        this.totalFacturas = control.payload.data()['Cantidad Total de Facturas'];
      });

    // se inicializa el array a 0
    this.productos = [];


    // Se asigna el array de productos al contenido de la tabla
    this.productosFactura = new MatTableDataSource(this.productos);
  }

  ngOnInit() {
    if (this.producto == null) {
      this.precioFinal = 0;
    } else {
      this.precioFinal = this.producto.PVenta;
    }
    // se verifica de donde fue que se llamo el modal
    if (this.producto == null) {
      this.valordebusquedaCliente = this.cliente.NombreCompleto;
    }

    // se inicializa el matsort de la tabla con los datos existentes
    this.productosFactura.sort = this.sort;

    // se manda a inicializar los datos para los autocomplete de los clientes y vendedores
    this.buscarClientes();
    this.buscarVendedor();
  }

  // funcion para imprimir
  imprimirFactura() {
  }

  // funcion para redireccionar a imprimir las facturas
  imprimirFacturass() {
    setTimeout(() => {
      this.servicio.navegar('imprimirFactura');
    }, 2000);
  }

  // funcion que se ejecutara una vez qu la factura se haya pagado
  limpiarTodo() {
    this.valordebusquedaCliente = '';
    this.valordebusquedaVendedor = '';
    this.cantidadVender = 0;
    this.precioFinal = 0;
    this.cantidadCalcularDescuento = 0;
    this.cantidadDescuento = 0;
    this.producto = null;
    this.productos = [];
    this.hayDatosEnTabla = false;
  }

  // funcion que se ejecutara cada vez que el usuario le de click en agregar producto a factura
  agregarProductoFactura() {
    if (this.cantidadVender > this.producto.Existencia) {
      this.servicio.newToast(0, 'Error de Stock', 'La cantidad a vender no puede ser mayor a la cantidad en stock del producto');
    } else if (this.precioFinal < this.producto.PCompra) {
      this.servicio.newToast(0, 'Error de Precio', 'El precio final del producto no puede ser menor al precio de compra del mismo');
    } else if (this.cantidadVender === 0) {
      this.servicio.newToast(0, 'Error de Cantidad', 'Debe de agregar al menos 1 producto en campo "Cantidad"');
    } else if (this.producto == null) {
      this.servicio.newToast(0, 'Error de Insercción', 'Debe de seleccionar un producto antes de agregarlo');
    } else {
      this.fs.doc<Producto>(`ACR Motos/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`)
        .update({ Existencia: this.producto.Existencia - this.cantidadVender });
      this.db.database.ref(`ACR Motos/Control/Inventario/${this.servicio.tienda}/Productos/${this.producto.Id}`)
        .update({ Existencia: this.producto.Existencia - this.cantidadVender });
      this.productos.push({
        Id: this.producto.Id,
        Producto: this.producto.Nombre,
        Modelo: this.producto.Modelo,
        Precio: this.producto.PVenta,
        DescuentoPorUnidad: this.cantidadDescuento,
        Cantidad: this.cantidadVender,
        TotalCordoba: this.cantidadVender * this.precioFinal,
        // tslint:disable-next-line:max-line-length
        TotalDolar: Math.round(((this.cantidadVender * this.precioFinal) / this.tipoCambioMoneda) * 100) / 100,
        Marca: this.producto.Marca,
        Categoria: this.producto.Categoria,
        PCompra: this.producto.PCompra,
        PVenta: this.producto.PVenta
      });
      this.productosFactura = new MatTableDataSource(this.productos);
      this.producto = null;
      this.precioFinal = 0;
      this.cantidadVender = 0;
      this.cantidadDescuento = 0;
      // this.servicio.newToast(1, 'Insercción Correcta!', 'El producto se agrego correctamente a la factura');
      this.hayDatosEnTabla = true;
    }
  }

  /** Gets the total cost of all transactions. */
  totalCordoba() {
    return this.productos.map(t => t.TotalCordoba).reduce((acc, value) => acc + value, 0);
  }
  totalDolar() {
    return this.productos.map(t => t.TotalDolar).reduce((acc, value) => acc + value, 0);
  }
  totalDescuento() {
    return this.productos.map(t => t.DescuentoPorUnidad).reduce((acc, value) => acc + value, 0);
  }

  // eliminar producto de la factura
  eliminarProductoFactura() {
    let cantidadAnterior = 0;
    let idProducto: ProductoFactura;
    this.productosFactura.data.forEach((producto, index) => {
      if (this.productoEliminar.Id === producto.Id) {
        idProducto = producto;
        this.productos.splice(index, 1);
        this.productosFactura = new MatTableDataSource(this.productos);
      }
    });
    this.fs.doc<Producto>(`ACR Motos/Control/Inventario/${this.servicio.tienda}/Productos/${idProducto.Id}`).snapshotChanges()
      .subscribe(product => {
        cantidadAnterior = product.payload.data().Existencia;
        // console.log(product.payload.data().Existencia);
      });
    // console.log(cantidadAnterior);
    setTimeout(() => {
      this.db.database.ref(`ACR Motos/Control/Inventario/${this.servicio.tienda}/Productos/${idProducto.Id}`)
        .update({ Existencia: cantidadAnterior + idProducto.Cantidad });
      this.fs.doc<Producto>(`ACR Motos/Control/Inventario/${this.servicio.tienda}/Productos/${idProducto.Id}`)
        .update({ Existencia: cantidadAnterior + idProducto.Cantidad });
      if (this.productos.length === 0) {
        this.hayDatosEnTabla = false;
      }
    }, 2000);
  }

  // funcion para cambiar el tipo de descuento
  cambiarTipodescuento() {
    this.tipoDescuentoCantidad = !this.tipoDescuentoCantidad;
    this.cantidadCalcularDescuento = 0;
    this.cantidadDescuento = 0;
  }

  // funcion para vender a precio de compra
  venderAPrecioCompra() {
    if (this.venderPrecioCompra) {
      this.cantidadDescuento = this.producto.PVenta - this.producto.PCompra;
      this.precioFinal = this.producto.PVenta - this.cantidadDescuento;
    } else {
      this.cantidadDescuento = 0;
      this.precioFinal = this.producto.PVenta;
    }
  }

  // funcion para agregar el descuento
  agregarDescuento() {
    this.precioFinal -= this.cantidadDescuento;
  }

  // funcion para cerra el modal
  cerrarModal() {
    this.cerrarModalVentaRapida.emit();
  }

  // funcion para abrir los modales de manera centrada
  openVerticallyCentered(content: string, producto: ProductoFactura) {
    this.productoEliminar = producto;
    this.ngbModal.open(content, { centered: true });
  }

  // funcion para buscar cliente
  buscarClientes() {
    // tslint:disable-next-line:prefer-const
    let self = this;
    self.clientes = self.fs.collection<Cliente>('ACR Motos/Control/Clientes', ref => ref
      .orderBy('NombreCompleto')
      .startAt(self.valordebusquedaCliente.toUpperCase())
      .endAt(self.valordebusquedaCliente.toUpperCase() + '\uf8ff')
      .limit(10)
    ).valueChanges();
  }

  // funcion para calcular el descuento segun su tipo
  calcularDescuento() {
    switch (this.tipoDescuento) {
      case 'porcentaje':
        this.cantidadDescuento = (this.cantidadCalcularDescuento * this.producto.PVenta) / 100;
        break;
      case 'cantidad':
        this.cantidadDescuento = this.cantidadCalcularDescuento;
        break;
      default:
        break;
    }
  }

  // funcion para buscar vendedor
  buscarVendedor() {
    // tslint:disable-next-line:prefer-const
    let self = this;
    self.vendedores = self.fs.collection<Usuario>('ACR Motos/Control/Usuarios', ref => ref
      .orderBy('Nombres')
      .startAt(self.valordebusquedaVendedor.toUpperCase())
      .endAt(self.valordebusquedaVendedor.toUpperCase() + '\uf8ff')
      .limit(10)
    ).valueChanges();
  }
}
