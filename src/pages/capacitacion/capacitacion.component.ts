import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { CapacitacionService } from './capacitacion.service';

@Component({
    selector: 'capacitacion',
    templateUrl: 'capacitacion.html'
})
export class CapacitacionComponent {
    loading: any;
    vendedorFiltro: any;
    clientes: any;
    titulo: string;
    usuario: any;

    constructor(private service: CapacitacionService, public loadingCtrl: LoadingController) {
        this.service.getUsuario().then((u)=>{
            this.usuario = u;
            if (this.usuario.vendedor) {
                this.vendedorFiltro = this.usuario.vendedor;
                this.cargarDatos();
            }
        })
    }

    ionViewDidEnter() {
        this.cargarDatos();
    }
    
    cargarDatos(): any {
        if (!this.vendedorFiltro) {
            return;
        }
        this.loading = this.loadingCtrl.create({
            content: 'Cargando clientes capacitación...'
        });
        this.loading.present().then(()=>{
            this.service.getClientesCapacitacion(this.vendedorFiltro.id).then((e) => {
                this.clientes = e;
                if (e && e.length > 0) {
                    this.titulo = "Capacitación 2019 (" + e.length.toString() + ")";
                } else {
                    this.titulo = "Capacitación 2019";
                }
                this.loading.dismiss();
            });
        })
    }

    seleccionarVendedorFiltro(evento: any) {
        this.service.getVendedor(evento).then(v => {
            this.vendedorFiltro = v;
            this.cargarDatos();
        })
    }
}
  