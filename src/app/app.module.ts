import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ImageGeneratorService } from './services/image-generator.service';
import { ImageManipulatorService } from './services/image-manipulator.service';
import { UiService } from './services/ui.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ImageGeneratorService,ImageManipulatorService,UiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
