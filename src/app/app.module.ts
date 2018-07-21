import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyD9rhKPG-xt3kiR_kZQ0FEK_AiPpeIM8rc",
  authDomain: "vendedor-bbf2b.firebaseapp.com",
  databaseURL: "https://vendedor-bbf2b.firebaseio.com",
  projectId: "vendedor-bbf2b",
  storageBucket: "vendedor-bbf2b.appspot.com",
  messagingSenderId: "356423060798"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
