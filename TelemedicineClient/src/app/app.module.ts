import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from "@angular/common/http";
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { SocketIOService } from './services/socket.io.service';
import { GlobalService } from './services/global.service';

import { BLService } from './shared/bl.service';
import { DLService } from './shared/dl.service';

import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component'
import { AppComponent } from './app.component';
import { MessageComponent } from './communication/message.component';
import { VideoComponent } from './communication/video.component';
import { AudioComponent } from './communication/audio.component';
import { ClinicalComponent } from './clinical/clinical.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MessageComponent,
    VideoComponent,
    AudioComponent,
    ClinicalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  providers: [
    SocketIOService,
    GlobalService,
    DLService,
    BLService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
