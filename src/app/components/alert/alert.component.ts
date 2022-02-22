import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @Input("opened") opened;
  msg:any;
  constructor() { }

  ngOnInit() {

  }
  public openModal(msg:string){
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }
    this.opened=true;
    this.msg=msg;
  }
  //this prevent close pwa when hard back button is pressed
  //instead, modal is close
  @HostListener('window:popstate', ['$event'])
  public closeModal(){
    this.opened=false;
  }
}
