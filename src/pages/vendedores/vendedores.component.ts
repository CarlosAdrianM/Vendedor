import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MainService } from '../../app/main.service';

@Component({
  selector: 'vendedores',
  templateUrl: 'vendedores.html'
})
export class VendedoresComponent {

  vendedores: any;
  model: any = {};
  isEditing: boolean = false;

  constructor(public navCtrl: NavController, private mainService: MainService) {
    this.loadData();
  }

    loadData(){
        this.mainService.getAllDocuments("vendedores").then((e)=>{
            this.vendedores = e;
        });
    }
        
    addMessage(){
        if(!this.isEditing){
            this.mainService.addDocument("vendedores", this.model).then(()=>{
                this.loadData();//refresh view
            });
        }else{
            this.mainService.updateDocument("vendedores", this.model.$key, this.model).then(()=>{
                this.loadData();//refresh view
            });
        }
        this.isEditing = false;
        //clear form
        this.model.nombre = '';
        this.model.direccion = '';
        this.model.email = '';
        this.model.usuario = '';
    }
    
    updateMessage(obj){
        this.model = obj;
        this.isEditing = true;
    }
    
    deleteMessage(key){
    this.mainService.deleteDocument("vendedores", key).then(()=>{
        this.loadData();//refresh view
        this.isEditing = false;
    });
    }
}
