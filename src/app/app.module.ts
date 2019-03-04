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
import { VisitasComponent } from '../pages/visitas/visitas.component';
import { VisitasService } from '../pages/visitas/visitas.service';
import { VentasComponent } from '../pages/ventas/ventas.component';
import { VentasService } from '../pages/ventas/ventas.service';
import { CobrosComponent } from '../pages/cobros/cobros.component';
import { CobrosService } from '../pages/cobros/cobros.service';
import { IngresosComponent } from '../pages/ingresos/ingresos.component';
import { IngresosService } from '../pages/ingresos/ingresos.service';
import { CapacitacionComponent } from '../pages/capacitacion/capacitacion.component';
import { CapacitacionService } from '../pages/capacitacion/capacitacion.service';

import { SelectorVendedoresComponent } from '../components/SelectorVendedores/SelectorVendedores.component';
import { SelectorVendedoresService } from '../components/SelectorVendedores/SelectorVendedores.service';
import { SelectorProductosComponent } from '../components/SelectorProductos/SelectorProductos.component';
import { SelectorProductosService } from '../components/SelectorProductos/SelectorProductos.service';
import { SelectorProductosMiniComponent } from '../components/SelectorProductosMini/SelectorProductosMini.component';

import { registerLocaleData } from '@angular/common';
import localeEsDo from '@angular/common/locales/es-DO';
import localeEsDoExtra from '@angular/common/locales/extra/es-DO';
import { ProductosComponent } from '../pages/productos/productos.component';

registerLocaleData(localeEsDo, localeEsDoExtra);

@NgModule({
  declarations: [
    MyApp,
    ClientesComponent,
    LoginPage,
    VendedoresComponent,
    VisitasComponent,
    VentasComponent,
    ProductosComponent,
    CobrosComponent,
    IngresosComponent,
    CapacitacionComponent,
    SelectorVendedoresComponent,
    SelectorProductosComponent,
    SelectorProductosMiniComponent
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
    VisitasComponent,
    VentasComponent,
    ProductosComponent,
    CobrosComponent,
    IngresosComponent,
    CapacitacionComponent,
    SelectorVendedoresComponent,
    SelectorProductosComponent,
    SelectorProductosMiniComponent
  ],
  providers: [
    MainService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: LOCALE_ID, useValue: 'es-DO' },
    AuthProvider,
    ClientesService,
    VisitasService,
    VentasService,
    CobrosService,
    IngresosService,
    CapacitacionService,
    SelectorVendedoresService,
    SelectorProductosService
  ]
})
export class AppModule {}
