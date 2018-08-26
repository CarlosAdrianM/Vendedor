import { Component } from '@angular/core';
import { MainService } from '../../app/main.service';

@Component({
    selector: 'productos',
    templateUrl: 'productos.html'
})
export class ProductosComponent {
    model: any = {};

    constructor(private mainService: MainService) {
        
    }

    crearProducto() {
        this.model.precioProfesional = +this.model.precioProfesional;
        if (this.model.pvp && this.model.pvp != 0) {
            this.model.pvp = +this.model.pvp;
        } else {
            delete this.model.pvp;
        }
        
        this.mainService.addDocument("productos", this.model).then(()=>{
            this.model.nombre = "";
        });
    }
}
