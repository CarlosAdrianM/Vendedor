import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IngresosService } from './ingresos.service';


@Component({
  selector: 'ingresos',
  templateUrl: 'ingresos.html'
})
export class IngresosComponent {
  ingresos: any;
  model: any = {};
  cobros: any = {};
  vendedor: string;
  botonActivo: boolean = false;
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);

  constructor(public navCtrl: NavController, private service: IngresosService) {
    this.model.fecha = this.hoySinHora;
    this.service.getUsuario().then((u)=>{
        this.vendedor = u.vendedor;
        this.loadData();
    })
  }

  get totalCobros() {
    var subtotal = 0;
    if (!this.model || !this.model.cobrosIngresados || !this.cobros) {
        return 0;
    }

    this.cobros.filter(v => -1 !== this.model.cobrosIngresados
        .findIndex(i => i == v.$key))
        .forEach(c => {
            subtotal += c.importe;
    });
      
    return subtotal;
  }


    loadData(){
        this.model.comentarios = '';
        this.service.getIngresosVendedor(this.vendedor).then((e)=>{
            this.ingresos = e;
        });
        this.service.getCobrosPendientes(this.vendedor).then((d)=> {
            this.cobros = d;
            this.botonActivo =true;
            this.model.cobrosIngresados = [];
            if (!d) {
                return;
            }
            d.forEach(e => {
                this.model.cobrosIngresados.push(e.$key);
            });
        })
    }
        
    addIngreso(){
        this.botonActivo = false;
        this.service.addIngreso(this.model).then(()=>{
            this.botonActivo = true;
            this.loadData();
        });
    }

    public seleccionarTexto(evento: any): void {
        var nativeInputEle = evento._native.nativeElement;
        nativeInputEle.select();
        //evento.target.select();
    }
}
