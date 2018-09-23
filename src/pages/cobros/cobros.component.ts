import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
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
  titulo: string;
  totalDeuda: number = 0;
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);
  private loading: any;

  constructor(public navCtrl: NavController, navParams: NavParams, private service: CobrosService, public loadingCtrl: LoadingController) {
    this.cliente = navParams.get("cliente");
    this.vendedor = navParams.get("vendedor");

    this.loading = this.loadingCtrl.create({
        content: 'Cargando deudas...'
    });
    
    if (this.cliente) {
        this.titulo = "Cobros";
    } else {
        this.titulo = "Deudas";
        this.loading.present();
    }

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
            this.totalDeuda = 0;
            d.forEach(e => {
                this.model.deudasCobradas.push(e.$key);
                this.totalDeuda += e.importeDeuda;
            });
            if (this.cliente) {
                this.titulo = "Cobros (" + this.totalDeuda + ")";
            } else {
                this.titulo = "Deudas ("+ this.totalDeuda + ")";
                this.loading.dismiss();
            }
        })
    }
        
    addCobro(){
        this.botonActivo = false;
        this.service.addCobro(this.model).then(()=>{
            this.navCtrl.pop();
        });
    }

    entregar(deuda: any) {
        this.service.entregar(deuda).then(()=>{
            deuda.entregado = true;
        })
    }

    masDeUnMes(fecha: firebase.firestore.Timestamp): boolean {
        if (!fecha) {
            return false;
        }
        var hoy = new Date();
        var haceUnMes = new Date(hoy.setMonth(hoy.getMonth() - 1));
        return fecha.toDate() < haceUnMes;
    }

    public seleccionarTexto(evento: any): void {
        var nativeInputEle = evento._native.nativeElement;
        nativeInputEle.select();
        //evento.target.select();
    }
}
