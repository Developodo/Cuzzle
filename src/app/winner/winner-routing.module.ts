import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WinnerPage } from './winner.page';

const routes: Routes = [
  {
    path: '',
    component: WinnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WinnerPageRoutingModule {}
