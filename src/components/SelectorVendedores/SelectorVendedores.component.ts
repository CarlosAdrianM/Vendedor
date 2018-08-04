import { Component, Injectable, Input } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { SelectorVendedoresService } from './SelectorVendedores.service';
import { SelectorBase } from '../SelectorBase/SelectorBase';

@Component({
    selector: 'selector-vendedores',
    templateUrl: 'SelectorVendedores.html',
    outputs: ['seleccionar'],
})

@Injectable()
export class SelectorVendedoresComponent extends SelectorBase {

    @Input() public seleccionado: any;
    @Input() public etiqueta: any;
    private servicio: SelectorVendedoresService;
    private alertCtrl: AlertController;

    constructor(servicio: SelectorVendedoresService, alertCtrl: AlertController) {
        super();
        this.servicio = servicio;
        this.alertCtrl = alertCtrl;
    }

    ngOnInit() {
        this.cargarDatos();
    }

    public cargarDatos(): void {
        this.servicio.getVendedores().then(
            data => {
                if (data.length === 0) {
                    let alert = this.alertCtrl.create({
                        title: 'Error',
                        subTitle: 'Error al cargar vendedores',
                        buttons: ['Ok'],
                    });
                    alert.present();
                } else {
                    this.inicializarDatos(data);
                }
            },
            error => {
                // loading.dismiss();
                this.errorMessage = <any>error;
            }
        );
    }
}