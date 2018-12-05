import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Firebase } from '@ionic-native/firebase';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DatabaseProvider } from '../providers/database/database';
import { AngularFireDatabase } from '@angular/fire/database';

let firebaseConfig = {
  apiKey: "AIzaSyDR0yqtVEe3mVl23jeSicAQl3uhBvaXE_U",
  authDomain: "projetoionicbm.firebaseapp.com",
  databaseURL: "https://projetoionicbm.firebaseio.com",
  projectId: "projetoionicbm",
  storageBucket: "projetoionicbm.appspot.com",
  messagingSenderId: "135788112289"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ScreenOrientation,
    DeviceMotion,
    DatabaseProvider,
    AngularFireDatabase,
    AndroidFullScreen
  ]
})
export class AppModule {}
