import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CobrosService } from './cobros.service';


@Component({
  selector: 'cobros',
  templateUrl: 'cobros.html'
})
export class CobrosComponent {
  cobros: any;
  model: any = {};
  deudas: any = {};
  cliente: string;
  vendedor: string;
  botonActivo: boolean = true;
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);

  constructor(public navCtrl: NavController, navParams: NavParams, private service: CobrosService) {
    this.cliente = navParams.get("cliente");
    this.vendedor = navParams.get("vendedor");

    this.model.cliente = this.cliente;
    this.model.fecha = this.hoySinHora;
    this.model.aplicarAuto = false;

    if (!this.vendedor) {
        this.service.getUsuario().then((u)=>{
            this.vendedor=u.vendedor.id;
            this.model.vendedor = this.vendedor;
            this.loadData();
        })
    } else {
        this.model.vendedor = this.vendedor;
        this.loadData();
    }
    
    
  }

    loadData(){
        this.model.comentarios = '';
        this.service.getCobrosCliente(this.cliente).then((e)=>{
            this.cobros = e;
        });
        this.service.getDeudasCliente(this.cliente, this.vendedor).then((d)=> {
            this.deudas = d;
            this.model.deudasCobradas = [];
            if (!d) {
                return;
            }
            d.forEach(e => {
                this.model.deudasCobradas.push(e.$key);
            });
        })
    }
        
    addCobro(){
        this.botonActivo = false;
        this.service.addCobro(this.model).then(()=>{
            this.navCtrl.pop();
        });
    }

    public seleccionarTexto(evento: any): void {
        var nativeInputEle = evento._native.nativeElement;
        nativeInputEle.select();
        //evento.target.select();
    }
}
