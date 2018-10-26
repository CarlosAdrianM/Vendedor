import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MainService } from '../../app/main.service';
import { ClientesService } from './clientes.service';
import { VisitasComponent } from '../visitas/visitas.component';
import { CobrosComponent } from '../cobros/cobros.component';

@Component({
  selector: 'clientes',
  templateUrl: 'clientes.html'
})
export class ClientesComponent {
    

  clientes: any;
  clientesSinFiltrar: any;
  distritos: any;
  municipios: any;
  provincias : any;
  model: any = {};
  isEditing: boolean = false;
  mostrarDetalle: boolean = false;
  vendedor: string;
  vendedorFiltro: string;
  usuario: any;
  botonActivo: boolean = true;
  titulo: string = "Clientes";
  fechaMinima: firebase.firestore.Timestamp;
  mostrarTodos: boolean = false;

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
        this.fechaMinima = service.FECHA_MINIMA;            
    this.cargarProvincias();
    this.loadData();
  }

  ionViewDidEnter() {
    if (this.distrito) {
        this.cargarClientes();        
    }
  }

    private cargarClientes() {
        if (this.mostrarTodos) {
            this.service.getClientesVendedor(this.vendedorFiltro).then((e) => {
                this.clientes = e;
                this.clientesSinFiltrar = e;
                if (e && e.length > 0) {
                    this.titulo = "Clientes (" + e.length.toString() + ")";
                } else {
                    this.titulo = "Clientes";
                }            
            });
        } else {
            this.service.getClientesDistrito(this.provincia, this.municipio, this.distrito).then((e) => {
                this.clientes = e;
                this.clientesSinFiltrar = e;
                if (e && e.length > 0) {
                    this.titulo = "Clientes (" + e.length.toString() + ")";
                } else {
                    this.titulo = "Clientes";
                }            
            });    
        }
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
        })
    }
    cargarDistritos(provincia: string, municipio: string) {
        this.service.getDistritos("provincias/"+provincia+"/municipios/"+municipio+"/distritos").then((p)=>{
            var distritosData = [];
            if (p) {
                p.forEach(m => {
                    var obj = {$key: m.$key, nombre: m.nombre, vendedor: m.vendedor.id};
                    distritosData.push(obj);
                });    
            }
            this.distritos = distritosData;
            var distritoEncontrado =this.distritos.find(x=> x.$key === this.usuario.ultimoDistrito);
            if (distritoEncontrado) {
                this.distrito = distritoEncontrado;
            } else {
                this.distrito = this.distritos[0];
            }
            if (this.distrito) {
                this.seleccionarVendedor(this.distrito.vendedor);
            }
        })
    }
    loadData(){
        this.service.getUsuario().then((u)=>{
            this.usuario = u;
            if (!this.vendedorFiltro) {
                this.vendedorFiltro=this.usuario.vendedor;
            }
            if (this.mostrarTodos) {
                this.cargarClientes();
            } else {
                var provinciaEncontrada = this.provincias.find(x=>x.$key === this.usuario.ultimaProvincia);
                if (provinciaEncontrada) {
                    this.provincia = provinciaEncontrada;
                } else {
                    this.provincia = this.provincias[0];
                }    
            }
        })
    }
    
    

    addMessage(){
        this.botonActivo = false;
        if(!this.isEditing){
            this.service.addCliente(this.model, this.provincia, this.municipio, this.distrito, this.vendedor).then(()=>{
                this.cargarClientes();
                this.botonActivo = true;
            });
        }else{
            this.service.updateDocument("clientes", this.model.$key, this.model, this.provincia, this.municipio, this.distrito, this.vendedor).then(()=>{
                this.cargarClientes();
                this.botonActivo = true;
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

    seleccionarVendedorFiltro(evento: any) {
        this.service.getVendedor(evento).then(v => {
            this.vendedorFiltro = v;
            this.loadData();
        })
    }
    
    crearCliente() {
        this.mostrarDetalle = true;
    }

    crearVisita(cliente: string) {
        this.navCtrl.push(VisitasComponent, { cliente: cliente, vendedor: this.vendedor });
    }

    crearCobro(cliente: string) {
        this.navCtrl.push(CobrosComponent, { cliente: cliente, vendedor: this.vendedor });
    }
    
    masDeUnMes(ultimaVisita: firebase.firestore.Timestamp): boolean {
        if (!ultimaVisita) {
            return false;
        }
        var hoy = new Date();
        var haceUnMes = new Date(hoy.setMonth(hoy.getMonth() - 1));
        return ultimaVisita.toDate() < haceUnMes;
    }

    seleccionarTexto(evento: any): void {
        if (evento == null || ((evento._searchbarInput == null || evento._searchbarInput.nativeElement == null) && evento.target == null)) {
            return;
        }
        setTimeout(() => {
            evento._searchbarInput && evento._searchbarInput.nativeElement ? evento._searchbarInput.nativeElement.select() : evento.target.select();
        }, 0);
    }

    filtrarBusqueda(searchbar: any): void {
        let filtro: string;
        if (searchbar.target.value) {
            filtro = searchbar.target.value.toUpperCase();
        } else {
            filtro = "";
        }

        if (this.clientes) {
            this.clientes = this.aplicarFiltro(this.clientesSinFiltrar, filtro);
        }
    }

    aplicarFiltro(datos: any[], filtro: string): any[] {
        return datos.filter(
            f => Object.keys(f).some(
                (key) => (f[key] && (typeof f[key] === 'string' || f[key] instanceof String)) ?
                    f[key].toUpperCase().indexOf(filtro) > -1 :
                    (f[key] && typeof f[key] === 'number' && !isNaN(parseFloat(filtro))) ? f[key] === parseFloat(filtro) :
                    false
            )
        );
    }

    resetearFiltros(): void {
        this.clientes = this.clientesSinFiltrar;
    }
}
