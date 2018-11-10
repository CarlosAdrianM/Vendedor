import { Injectable, Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { SelectorBase } from "../SelectorBase/SelectorBase";
import { LoadingController, AlertController, NavController } from "ionic-angular";
import { SelectorProductosService } from "./SelectorProductos.service";

@Component({
  selector: 'selector-productos',
  templateUrl: 'SelectorProductos.html'
})
@Injectable()
export class SelectorProductosComponent extends SelectorBase {
  @Output() seleccionar = new EventEmitter();

  public filtroNombre: string;
  public filtroFamilia: string;
  public filtroSubgrupo: string;

  enFoco: boolean = false;

  constructor(private servicio: SelectorProductosService, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, private navCtrl: NavController) {
    super();
    this.cargarDatos("");
  }

  @ViewChild('barra') myIonSearchBar;

  ngAfterViewInit() {
    this.setFocus();
  }

  seleccionarProducto(producto: any) {
      this.seleccionarDato(producto);
      this.navCtrl.pop();
  }

  public setFocus(): void {
    setTimeout(() => {
      this.myIonSearchBar.setFocus();
    }, 0);      
  }

  protected cargarDatos(filtro: string): void {
    let loading: any = this.loadingCtrl.create({
      content: 'Cargando Productos...',
    });

    loading.present();

    this.servicio.getProductos().then((data)=>{
        if (data.length === 0) {
          let alert: any = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'No se encuentra ningún producto con esos filtros',
            buttons: ['Ok'],
          });
          alert.present();
        } else {
          this.inicializarDatos(data);
        }
        loading.dismiss();
      }
    );
  }
}