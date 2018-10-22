import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CobrosService } from './cobros.service';
import { VentasComponent } from '../ventas/ventas.component';


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
  totalDeudaEntregada: number = 0;
  totalDeudaSinEntregar: number = 0;
  usuario: any;
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);
  private loading: any;

  constructor(public navCtrl: NavController, navParams: NavParams, private service: CobrosService, public loadingCtrl: LoadingController) {
    this.cliente = navParams.get("cliente");
    this.vendedor = navParams.get("vendedor");
    
    if (this.cliente) {
        this.titulo = "Cobros";
    } else {
        this.titulo = "Deudas";
    }

    this.model.cliente = this.cliente;
    this.model.fecha = this.hoySinHora;
    this.model.aplicarAuto = false;

    this.service.getUsuario().then((u)=>{
        this.usuario = u;
        if (!this.vendedor) {
            this.vendedor=this.usuario.vendedor.id;
        }    
        this.model.vendedor = this.vendedor;
        this.loadData();
    });

  }

    loadData(){
        this.loading = this.loadingCtrl.create({
            content: 'Cargando deudas...'
        });
        this.loading.present().then(()=>{
            this.model.comentarios = '';
            this.service.getCobrosCliente(this.cliente).then((e)=>{
                this.cobros = e;
            });
            this.service.getDeudasCliente(this.cliente, this.vendedor).then((d)=> {
                this.deudas = d;
                this.model.deudasCobradas = [];
                if (!d) {
                    this.loading.dismiss();
                    return;
                }
                this.totalDeuda = 0;
                this.totalDeudaEntregada = 0;
                this.totalDeudaSinEntregar = 0;
                d.forEach(e => {
                    this.model.deudasCobradas.push(e.$key);
                    this.totalDeuda += e.importeDeuda;
                    if (e.entregado) {
                        this.totalDeudaEntregada += e.importeDeuda;
                    } else {
                        this.totalDeudaSinEntregar += e.importeDeuda;
                    }
                });
                if (this.cliente) {
                    this.titulo = "Cobros (" + this.totalDeuda + ")";
                } else {
                    this.titulo = "Deudas ("+ this.totalDeuda + ")";
                }
                this.loading.dismiss();
            })    
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

    abrirVenta(venta: any) {
        this.navCtrl.push(VentasComponent, {venta: venta});
    }

    crearCobro(cliente: string) {
        this.navCtrl.push(CobrosComponent, { cliente: cliente, vendedor: this.usuario.vendedor.id });
    }

    seleccionarVendedor(evento: any) {
        this.vendedor = evento;
        this.loadData();
    }

    public seleccionarTexto(evento: any): void {
        var nativeInputEle = evento._native.nativeElement;
        nativeInputEle.select();
        //evento.target.select();
    }
}
