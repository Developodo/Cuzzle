import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private loading=null;
  constructor(public loadingController: LoadingController) { }

  async showLoading() {

    if(this.loading) return;
    this.loading = await this.loadingController.create({
      spinner:null,
      htmlAttributes:null,
      translucent:true,
      showBackdrop:true,
      animated:true,
      cssClass: 'custom-loading'
    });
    await this.loading.present();

  }
  async closeLoading(){
    if(this.loading){
      this.loadingController.dismiss();
      this.loading=null;
    }
  }
}
