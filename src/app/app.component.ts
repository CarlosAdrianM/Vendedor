import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ClientesComponent } from '../pages/clientes/clientes.component';
import { LoginPage } from '../pages/login/login';
import firebase from 'firebase';
import { IngresosComponent } from '../pages/ingresos/ingresos.component';
import { CobrosComponent } from '../pages/cobros/cobros.component';
import { VisitasComponent } from '../pages/visitas/visitas.component';
import { CapacitacionComponent } from '../pages/capacitacion/capacitacion.component';
import { ProductosComponent } from '../pages/productos/productos.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild('rootNav') rootNav;
  rootPage:any;
  firstRun: boolean = true;
  pages: Array<{title: string, component: any}>;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    /*
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    */
   var config = {
    apiKey: "AIzaSyD9rhKPG-xt3kiR_kZQ0FEK_AiPpeIM8rc",
    authDomain: "vendedor-bbf2b.firebaseapp.com",
    databaseURL: "https://vendedor-bbf2b.firebaseio.com",
    projectId: "vendedor-bbf2b",
    storageBucket: "vendedor-bbf2b.appspot.com",
    messagingSenderId: "356423060798"
  };
  firebase.initializeApp(config);
  firebase.firestore().settings({ timestampsInSnapshots: true });
  firebase.firestore().enablePersistence()
    .then(function() {
        // Initialize Cloud Firestore through firebase
        //var db = firebase.firestore();
    })
    .catch(function(err) {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
        }
    });

    this.pages = [
      { title: 'Clientes', component: ClientesComponent },
      //{ title: 'Vendedores', component: VendedoresComponent },
      { title: 'Visitas', component: VisitasComponent},
      //{title: 'Ventas', component: VentasComponent},
      //{ title: 'Productos', component: ProductosComponent },
      { title: 'Deudas', component: CobrosComponent},
      { title: 'Ingresos', component: IngresosComponent },
      { title: 'Capacitación 2019', component: CapacitacionComponent },
      { title: 'Login', component: LoginPage }
    ];
  }

  ngOnInit(): void {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated.
        this.setRootPage(ClientesComponent);
      } else {
        // User is not authenticated.
        this.setRootPage(LoginPage);
      }
    });
  }

  setRootPage(page) {

    if (this.firstRun) {

      // if its the first run we also have to hide the splash screen
      this.rootNav.setRoot(page)
        .then(() => this.platform.ready())
        .then(() => {

          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          this.statusBar.styleDefault();
          this.splashScreen.hide();
          this.firstRun = false;
        });
    } else {
      this.rootNav.setRoot(page);
    }
  }
}

