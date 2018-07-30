import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MainService } from '../../app/main.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    

  clientes: any;
  municipio: any;
  municipios: any;
  provincias : any;
  model: any = {};
  isEditing: boolean = false;
  vendedor: any;

  _provincia: any;
  get provincia(): any {
      return this._provincia;
  }
  set provincia(value: any){
      this._provincia = value;
      this.cargarMunicipios();
  }
  

  constructor(public navCtrl: NavController, private mainService: MainService) {
    this.loadData();
    this.cargarProvincias();
  }
    cargarProvincias() {
        this.mainService.getAllDocuments("provincias").then((p)=>{
            this.provincias = p;
            this.provincia = this.provincias[0];
        })
    }
    cargarMunicipios() {
        this.mainService.getAllDocuments("provincias/"+this.provincia.$key+"/municipios").then((p)=>{
            var municipiosData = [];
            p.forEach(m => {
                var obj = {$key: m.$key, nombre: m.nombre};
                municipiosData.push(obj);
            });
            this.municipios = municipiosData;
            this.municipio = this.municipios[0];
        })
    }
    loadData(){
        this.mainService.getAllDocuments("clientes").then((e)=>{
            this.clientes = e;
        });
    }
        
    addMessage(){
        if(!this.isEditing){
            this.mainService.addDocument("clientes", this.model).then(()=>{
                this.loadData();//refresh view
            });
        }else{
            this.mainService.updateDocument("clientes", this.model.$key, this.model).then(()=>{
                this.loadData();//refresh view
            });
        }
        this.isEditing = false;
        //clear form
        this.model.nombre = '';
        this.model.direccion = '';
        this.model.email = '';
        this.model.telefono = '';
        this.model.usuario = '';
        this.model.codPostal = '';
    }
    
    updateMessage(obj){
        this.model = obj;
        this.isEditing = true;
    }
    
    deleteMessage(key){
    this.mainService.deleteDocument("clientes", key).then(()=>{
        this.loadData();//refresh view
        this.isEditing = false;
    });
    }
}
