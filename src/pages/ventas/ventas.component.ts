import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VentasService } from './ventas.service';

@Component({
  selector: 'ventas',
  templateUrl: 'ventas.html'
})
export class VentasComponent {

  INCREMENTO_IMPUESTO: number = 1.18;

  productos: any;
  model: any = {};
  isEditing: boolean = false;
  cliente: string;
  vendedor: string;
  linea: any;
  lineas: any;
  botonActivo: boolean = false;
  ventaCargada: any;
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);

  get total() {
    if (!this.lineas) {
      return 0;
    }
    var subtotal = 0;
    this.lineas.forEach(l => {
      subtotal += (l.precio * l.cantidad);
    });
      
    return subtotal;
  }


  constructor(public navCtrl: NavController, navParams: NavParams, private service: VentasService) {
    this.cliente = navParams.get("cliente");
    this.vendedor = navParams.get("vendedor");
    this.ventaCargada = navParams.get("venta");
    this.getProductos();
    if (!this.ventaCargada) {
      this.model.cliente = this.cliente;
      this.model.vendedor = this.vendedor;
      this.model.fecha = this.hoySinHora;
      this.lineas = [];  
      this.botonActivo = true;
    } else {
      this.model.cliente = this.ventaCargada.cliente;
      this.model.vendedor = this.ventaCargada.vendedor;
      this.model.fecha = this.ventaCargada.fecha;
      this.service.getLineas(this.ventaCargada.$key).then(l=>{
        this.lineas = l;
      });
    }
  }
      
    addVenta(){
        this.botonActivo = false;
        this.model.total = this.total;
        this.service.addVenta(this.model, this.lineas).then(()=>{
            this.navCtrl.pop();
        });
    }

    addLinea() {
        this.linea = {producto:this.productos[0].$key, nombreProducto: this.productos[0].nombre, cantidad:1, precio: this.productos[0].precioProfesional / this.INCREMENTO_IMPUESTO, stock: this.productos[0].stock};
        this.linea.precioTarifa = this.linea.precio;
        if (!this.lineas) {
          this.lineas = [];
        }
        this.lineas.push(this.linea);
    }

    borrarLinea(linea: any) {
      var index = this.lineas.indexOf(linea);
      if (index > -1) {
        this.lineas.splice(index, 1);
      }
    }

    getProductos() {
      this.service.getProductos().then((p)=>{
          this.productos = p;
          this.addLinea();
      });
    }

    seleccionarProducto(linea: any, producto: any) {
      var index = this.lineas.indexOf(linea);
      if (index > -1) {
        this.lineas[index].precio = producto.precioProfesional / this.INCREMENTO_IMPUESTO;
        this.lineas[index].precioTarifa = this.lineas[index].precio;
        this.lineas[index].nombreProducto = producto.nombre;
        this.lineas[index].stock = producto.stock ? producto.stock : 0;
      }
    }

    colorStock(linea: any): any {
      if (!linea || linea.stock == undefined || !linea.cantidad) {
        return 'primary';
      }
      return +linea.cantidad > +linea.stock ? 'danger' : 'secondary';
    }
}
