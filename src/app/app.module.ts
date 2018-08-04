import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
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



@NgModule({
  declarations: [
    MyApp,
    ClientesComponent,
    LoginPage,
    VendedoresComponent,
    SelectorVendedoresComponent
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
    SelectorVendedoresComponent
  ],
  providers: [
    MainService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ClientesService,
    SelectorVendedoresService
  ]
})
export class AppModule {}
