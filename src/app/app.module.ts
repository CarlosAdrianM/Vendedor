import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MainService } from './main.service';

import { MyApp } from './app.component';

import { ClientesComponent } from '../pages/clientes/clientes.component';
import { ClientesService } from '../pages/clientes/clientes.service';
import { AuthProvider } from '../providers/auth/auth';
import { LoginPage } from '../pages/login/login';
import { VendedoresComponent } from '../pages/vendedores/vendedores.component';
import { SelectorVendedoresComponent } from '../components/SelectorVendedores/SelectorVendedores.component';
import { SelectorVendedoresService } from '../components/SelectorVendedores/SelectorVendedores.service';
import { VisitasComponent } from '../pages/visitas/visitas.component';
import { VisitasService } from '../pages/visitas/visitas.service';
import { VentasComponent } from '../pages/ventas/ventas.component';
import { VentasService } from '../pages/ventas/ventas.service';
import { ProductosComponent } from '../pages/productos/productos.component';

import { registerLocaleData } from '@angular/common';
import localeEsDo from '@angular/common/locales/es-DO';
import localeEsDoExtra from '@angular/common/locales/extra/es-DO';
import { CobrosComponent } from '../pages/cobros/cobros.component';
import { CobrosService } from '../pages/cobros/cobros.service';

registerLocaleData(localeEsDo, localeEsDoExtra);

@NgModule({
  declarations: [
    MyApp,
    ClientesComponent,
    LoginPage,
    VendedoresComponent,
    SelectorVendedoresComponent,
    VisitasComponent,
    VentasComponent,
    ProductosComponent,
    CobrosComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ClientesComponent,
    LoginPage,
    VendedoresComponent,
    SelectorVendedoresComponent,
    VisitasComponent,
    VentasComponent,
    ProductosComponent,
    CobrosComponent
  ],
  providers: [
    MainService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LOCALE_ID, useValue: 'es-DO' },
    AuthProvider,
    ClientesService,
    SelectorVendedoresService,
    VisitasService,
    VentasService,
    CobrosService
  ]
})
export class AppModule {}
