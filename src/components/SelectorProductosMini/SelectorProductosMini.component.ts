import { Injectable, Component, EventEmitter, Output } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { SelectorProductosComponent } from "../SelectorProductos/SelectorProductos.component";

@Component({
  selector: 'selector-productos-mini',
  templateUrl: 'SelectorProductosMini.html'
})
@Injectable()
export class SelectorProductosMiniComponent {
    
    @Output() public seleccionar: EventEmitter<any> = new EventEmitter();

    constructor(public navCtrl: NavController, navParams: NavParams){

    }

    abrirProductos(){
        this.navCtrl.push(SelectorProductosComponent);
    }
}
