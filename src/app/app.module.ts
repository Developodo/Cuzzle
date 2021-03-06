import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImageGeneratorService } from './services/image-generator.service';
import { UiService } from './services/ui.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MediastackService } from './services/mediastack.service';
import { HttpClientModule } from '@angular/common/http';
import {AngularFireModule} from '@angular/fire/compat/'
import { AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { CopeRSSService } from './services/cope-rss.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ImageGeneratorService,
    UiService,
    MediastackService,
    CopeRSSService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
