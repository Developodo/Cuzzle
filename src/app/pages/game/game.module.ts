import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { NewPage } from '../new/new.page';
import { ShareButtonsComponent } from '../../components/share-buttons/share-buttons.component';
import { RangesComponent } from '../../components/ranges/ranges.component';
import { AlertComponent } from '../../components/alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule
  ],
  declarations: [GamePage,NewPage,
    RangesComponent,
    ShareButtonsComponent,
    CanvasComponent,
    AlertComponent]
})
export class GamePageModule {}
