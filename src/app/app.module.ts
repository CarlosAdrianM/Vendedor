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
