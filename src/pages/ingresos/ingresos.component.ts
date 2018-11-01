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
  usuario: any;
  botonActivo: boolean = false;
  comision: number;
  comisionMesPasado: number;
  faltaParaSalto: number;
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);

  constructor(public navCtrl: NavController, private service: IngresosService) {
    this.model.fecha = this.hoySinHora;
    this.service.getUsuario().then((u)=>{
        this.usuario = u;
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
            var date = new Date();
            var diaUnoDelMes = new Date(date.getFullYear(), date.getMonth(), 1);
            var diaUnoMesPasado = new Date(date.getFullYear(), date.getMonth(), 1);
            diaUnoMesPasado.setMonth(diaUnoDelMes.getMonth()-1);
            this.model.sumaIngresos = 0;
            this.model.sumaIngresosMesPasado = 0;
            if(this.ingresos) {
                for (var i of this.ingresos) {
                    if (i.fecha.toDate() < diaUnoMesPasado) {
                        break;
                    }
                    if (i.fecha.toDate() < diaUnoDelMes) {
                        this.model.sumaIngresosMesPasado += i.importe;
                    } else {
                        this.model.sumaIngresos += i.importe;
                    }
                };
                var tramo = this.calcularComisiones(this.model.sumaIngresos);
                this.comision = tramo.comision;
                this.faltaParaSalto = tramo.faltaParaSalto;
                var tramoMesPasado = this.calcularComisiones(this.model.sumaIngresosMesPasado);
                this.comisionMesPasado = tramoMesPasado.comision;
            }
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

    calcularComisiones(sumaIngresos: number): any {
        var tramo = {comision: 0, faltaParaSalto: 0};
        if (sumaIngresos < 65000) {
            tramo = {comision: 0, faltaParaSalto: 65000 - sumaIngresos};
        } else if (sumaIngresos < 85000) {
            tramo = {comision: sumaIngresos * 0.05, faltaParaSalto: 85000 - sumaIngresos};
        } else if (sumaIngresos < 130000) {
            tramo = {comision: sumaIngresos * 0.06, faltaParaSalto: 130000 - sumaIngresos};
        } else if (sumaIngresos < 200000) {
            tramo = {comision: sumaIngresos * 0.07, faltaParaSalto: 200000 - sumaIngresos};
        } else {
            tramo = {comision: sumaIngresos * 0.08, faltaParaSalto: 0};
        }
        return tramo;
    }
        
    addIngreso(){
        this.botonActivo = false;
        this.service.addIngreso(this.model).then(()=>{
            this.botonActivo = true;
            this.loadData();
        });
    }

    seleccionarVendedor(evento: any) {
        this.service.getVendedor(evento).then(v => {
            this.vendedor = v;
            this.loadData();
        })
    }


    public seleccionarTexto(evento: any): void {
        var nativeInputEle = evento._native.nativeElement;
        nativeInputEle.select();
        //evento.target.select();
    }
}
