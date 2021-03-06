import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ScreenOrientation} from '@ionic-native/screen-orientation'


import { HomePage } from '../pages/home/home';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, screen:ScreenOrientation, full:AndroidFullScreen) {
    //statusBar.overlaysWebView(true);

    platform.ready().then(() => {
      //statusBar.hide();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      screen.lock(screen.ORIENTATIONS.LANDSCAPE_PRIMARY);


      //statusBar.styleDefault();
      splashScreen.hide();
    });
  }



}

