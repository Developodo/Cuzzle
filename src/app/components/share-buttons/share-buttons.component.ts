import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss'],
})
export class ShareButtonsComponent implements OnInit {
  @Input('slot') slot?
  @Input('url') url;
  @Input('message') message;
  urlTT;urlT;urlW;urlF;

  constructor() { }

  ngOnInit() {
    if(!this.slot) this.slot="secundary";
  }
  //https://cuzzle-90eef.firebaseapp.com/game
  //Cuzzle+%0d%0a"+this.today+"+("+this.tint+"%25+de+tinta)%0d%0a
  //ngAfterViewInit
  ngAfterContentInit() {
    this.urlTT="https://twitter.com/intent/tweet?url="+this.url+"&text="+this.message
    this.urlT="https://telegram.me/share/url?url="+this.url+"&text="+this.message
    this.urlW="https://api.whatsapp.com/send?text="+this.message+"%20"+this.url
    this.urlF="https://www.facebook.com/sharer/sharer.php?u="+this.url
  }



}
