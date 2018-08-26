import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VentasService } from './ventas.service';

@Component({
  selector: 'ventas',
  templateUrl: 'ventas.html'
})
export class VentasComponent {

  productos: any;
  model: any = {};
  isEditing: boolean = false;
  cliente: string;
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
    this.getProductos();
    this.model.cliente = this.cliente;
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
        this.linea = {producto:this.productos[0].$key, cantidad:1, precio: this.productos[0].precioProfesional};
        this.lineas.push(this.linea);
    }

    getProductos() {
      this.service.getProductos().then((p)=>{
          this.productos = p;
          this.addLinea();
      });
    }

    seleccionarProducto(event, producto) {
      this.linea.precio = producto.precioProfesional;
    }
}
