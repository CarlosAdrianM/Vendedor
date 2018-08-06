import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MainService } from '../../app/main.service';
import { ClientesService } from './clientes.service';
import { VisitasComponent } from '../visitas/visitas.component';

@Component({
  selector: 'clientes',
  templateUrl: 'clientes.html'
})
export class ClientesComponent {
    

  clientes: any;
  distritos: any;
  municipios: any;
  provincias : any;
  model: any = {};
  isEditing: boolean = false;
  mostrarDetalle: boolean = false;
  vendedor: string;
  usuario: any;

  _provincia: any;
  get provincia(): any {
      return this._provincia;
  }
  set provincia(value: any){
      this._provincia = value;
      this.cargarMunicipios(value.$key);
  }

  _municipio: any;
  get municipio(): any {
      return this._municipio;
  }
  set municipio(value: any) {
      this._municipio = value;
      this.cargarDistritos(this.provincia.$key, value.$key);
  }

  _distrito: any;
  get distrito(): any {
      return this._distrito;
  }
  set distrito(value: any) {
      this._distrito = value;
      this.cargarClientes();
  }

  constructor(public navCtrl: NavController, private mainService: MainService,
        private service: ClientesService) {
    this.cargarProvincias();
    this.loadData();
  }
    private cargarClientes() {
        this.service.getAllClientes(this.provincia, this.municipio, this.distrito).then((e) => {
            this.clientes = e;
        });
    }

    cargarProvincias() {
        this.mainService.getAllDocuments("provincias").then((p)=>{
            this.provincias = p;
        })
    }
    cargarMunicipios(provincia: string) {
        this.mainService.getAllDocuments("provincias/"+provincia+"/municipios").then((p)=>{
            /*
            var municipiosData = [];
            p.forEach(m => {
                var obj = {$key: m.$key, nombre: m.nombre, vendedor: m.vendedor.id};
                municipiosData.push(obj);
            });
            */
            this.municipios = p;//municipiosData;
            var municipioEncontrado =this.municipios.find(x=> x.$key === this.usuario.ultimoMunicipio);
            if (municipioEncontrado) {
                this.municipio = municipioEncontrado;
            } else {
                this.municipio = this.municipios[0];
            }
            this.seleccionarVendedor(this.municipio.vendedor);
        })
    }
    cargarDistritos(provincia: string, municipio: string) {
        this.mainService.getAllDocuments("provincias/"+provincia+"/municipios/"+municipio+"/distritos").then((p)=>{
            var distritosData = [];
            p.forEach(m => {
                var obj = {$key: m.$key, nombre: m.nombre, vendedor: m.vendedor.id};
                distritosData.push(obj);
            });
            this.distritos = distritosData;
            var distritoEncontrado =this.distritos.find(x=> x.$key === this.usuario.ultimoDistrito);
            if (distritoEncontrado) {
                this.distrito = distritoEncontrado;
            } else {
                this.distrito = this.distritos[0];
            }
            this.seleccionarVendedor(this.distrito.vendedor);
        })
    }
    loadData(){
        this.service.getUsuario().then((u)=>{
            this.usuario = u;
            var provinciaEncontrada = this.provincias.find(x=>x.$key === this.usuario.ultimaProvincia);
            if (provinciaEncontrada) {
                this.provincia = provinciaEncontrada;
            } else {
                this.provincia = this.provincias[0];
            }
            
        })
    }
    
    

    addMessage(){
        if(!this.isEditing){
            this.service.addCliente(this.model, this.provincia, this.municipio, this.distrito, this.vendedor).then(()=>{
                this.cargarClientes();
            });
        }else{
            this.service.updateDocument("clientes", this.model.$key, this.model, this.provincia, this.municipio, this.distrito, this.vendedor).then(()=>{
                this.cargarClientes();
            });
        }
        this.isEditing = false;
        this.mostrarDetalle = false;
        //clear form
        this.model.nombre = '';
        this.model.direccion = '';
        this.model.email = '';
        this.model.telefono = '';
        this.model.usuario = '';
        this.model.comentarios = '';
    }
    
    updateMessage(obj){
        this.model = obj;
        this.isEditing = true;
        this.mostrarDetalle = true;
    }
    
    deleteMessage(key){
    this.mainService.deleteDocument("clientes", key).then(()=>{
        this.loadData();//refresh view
        this.isEditing = false;
    });
    }

    seleccionarVendedor(vendedor: string) {
        this.vendedor = vendedor;
    }

    crearCliente() {
        this.mostrarDetalle = true;
    }

    crearVisita(cliente: string) {
        this.navCtrl.push(VisitasComponent, { cliente: cliente });
    }
}
