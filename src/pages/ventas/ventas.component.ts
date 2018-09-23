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
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);

  get total() {
    var subtotal = 0;
    this.lineas.forEach(l => {
      subtotal += (l.precio * l.cantidad);
    });
      
    return subtotal;
  }


  constructor(public navCtrl: NavController, navParams: NavParams, private service: VentasService) {
    this.cliente = navParams.get("cliente");
    this.vendedor = navParams.get("vendedor");
    this.getProductos();
    this.model.cliente = this.cliente;
    this.model.vendedor = this.vendedor;
    this.model.fecha = this.hoySinHora;
    this.lineas = [];
  }
      
    addVenta(){
        this.model.total = this.total;
        this.service.addVenta(this.model, this.lineas).then(()=>{
            this.navCtrl.pop();
        });
    }

    addLinea() {
        this.linea = {producto:this.productos[0].$key, nombreProducto: this.productos[0].nombre, cantidad:1, precio: this.productos[0].precioProfesional / this.INCREMENTO_IMPUESTO};
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
        this.lineas[index].nombreProducto = producto.nombre;
      }
    }
}
