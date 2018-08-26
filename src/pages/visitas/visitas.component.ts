import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VisitasService } from './visitas.service';
import { VentasComponent } from '../ventas/ventas.component';

@Component({
  selector: 'visitas',
  templateUrl: 'visitas.html'
})
export class VisitasComponent {

  visitas: any;
  model: any = {};
  isEditing: boolean = false;
  cliente: string;
  private hoy: Date = new Date();
  private hoySinHora: Date = new Date(this.hoy.getFullYear(), this.hoy.getMonth(), this.hoy.getDate(), 0, 0, 0, 0);

  get textoGuia() {
      var texto: string;
      switch (this.model.nivelInteres) {
        case("0") : 
            texto = "Comentar cómo ha trascurrido la primera visita y datos a recordar para la segunda";
            break;
        case("1") : 
            texto = "Comentar por qué creemos que no ha creado interés el producto y cómo podemos generar ese interés en la próxima visita";
            break;
        case("2") : 
            texto = "Comentar por qué no hemos conseguido cerrar la venta y los puntos a tratar en la próxima visita para cerrar la venta";
            break;
        case("3") : 
            texto = "Apuntar si lo que falta es la aprobación de una socia, algún problema con el precio, autorización de alguien, etc.";
            break;
        case("4") : 
            texto = "Apunta la forma en qué has conseguido convencer al cliente para cerrar la venta, los puntos fuertes de la argumentación que ha funcionado";
            break;
      }
      return texto;
  }

  constructor(public navCtrl: NavController, navParams: NavParams, private service: VisitasService) {
    this.cliente = navParams.get("cliente");
    this.model.cliente = this.cliente;
    this.model.fecha = this.hoySinHora;
    this.model.nivelInteres = "0";
    this.loadData();
  }

    loadData(){
        this.model.nivelInteres = "0";
        this.model.comentarios = '';
        this.service.getVisitasCliente(this.cliente).then((e)=>{
            this.visitas = e;
        });
    }
        
    addVisita(){
        if(!this.isEditing){
            this.service.addVisita(this.model).then(()=>{
                if (this.model.nivelInteres == "4") {
                    this.navCtrl.push(VentasComponent, {cliente: this.cliente});
                };
                this.loadData();//refresh view
            });
        }else{
            this.service.updateDocument(this.model.$key, this.model).then(()=>{
                this.loadData();//refresh view
            });
        }
        this.isEditing = false;
        
    }
    
    updateMessage(obj){
        this.model = obj;
        this.isEditing = true;
    }
    
    deleteMessage(key){
    this.service.deleteDocument("visitas", key).then(()=>{
        this.loadData();//refresh view
        this.isEditing = false;
    });
    }
}
