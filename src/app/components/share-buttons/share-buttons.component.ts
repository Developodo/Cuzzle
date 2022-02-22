import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss'],
})
export class ShareButtonsComponent implements OnInit {
  //Optionally, slot can point if the component will be rendered
  //in primary or secundary slot
  @Input('slot') slot?
  //URL to me shared
  @Input('url') url;
  //Message to described what we're sharing
  @Input('message') message;

  urlTT;urlT;urlW;urlF;

  constructor() { }

  ngOnInit() {
    if(!this.slot) this.slot="secundary";
  }
  //ngAfterViewInit doesn't work
  //We need AfterContent to wait for input values ready to be read 
  ngAfterContentInit() {
    this.urlTT="https://twitter.com/intent/tweet?url="+this.url+"&text="+this.message
    this.urlT="https://telegram.me/share/url?url="+this.url+"&text="+this.message
    this.urlW="https://api.whatsapp.com/send?text="+this.message+"%20"+this.url
    this.urlF="https://www.facebook.com/sharer/sharer.php?u="+this.url
  }
}
