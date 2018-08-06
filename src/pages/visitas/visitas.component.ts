import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VisitasService } from './visitas.service';

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

  constructor(public navCtrl: NavController, navParams: NavParams, private service: VisitasService) {
    this.cliente = navParams.get("cliente");
    this.model.cliente = this.cliente;
    this.model.fecha = this.hoySinHora;
    this.model.nivelInteres = 0;
    this.loadData();
  }

    loadData(){
        this.service.getVisitasCliente(this.cliente).then((e)=>{
            this.visitas = e;
        });
    }
        
    addVisita(){
        if(!this.isEditing){
            this.service.addVisita(this.model).then(()=>{
                this.loadData();//refresh view
            });
        }else{
            this.service.updateDocument(this.model.$key, this.model).then(()=>{
                this.loadData();//refresh view
            });
        }
        this.isEditing = false;
        //clear form
        this.model.nivelInteres = 0;
        this.model.comentarios = '';
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
