import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


/* 3rd party plugins : must be provided in "providers" */
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, BarcodeScanner, SQLite, NativeAudio],
  bootstrap: [AppComponent],
})
export class AppModule {}
