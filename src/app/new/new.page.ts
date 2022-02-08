import { Component, Input, OnInit } from '@angular/core';
import { New } from '../model/New';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  @Input() newInfo: New;
  @Input() today: string;
  @Input() tint: number;
  urlTT;
  urlT;
  urlW;
  urlF;
  constructor() { } 

  ngOnInit() {
    this.urlTT="https://twitter.com/intent/tweet?url=https://cuzzle-90eef.firebaseapp.com/game&text=Cuzzle+%0d%0a"+this.today+"+("+this.tint+"%25+de+tinta)%0d%0a"
    this.urlT="https://telegram.me/share/url?url=https://cuzzle-90eef.firebaseapp.com/game&text=Cuzzle+%0d%0a"+this.today+"+("+this.tint+"%25+de+tinta)%0d%0a"
    this.urlW="https://api.whatsapp.com/send?text=Cuzzle+%0d%0a"+this.today+"+("+this.tint+"%25+de+tinta)%0d%0a%20https://cuzzle-90eef.firebaseapp.com/game"
    this.urlF="https://www.facebook.com/sharer/sharer.php?u=https://cuzzle-90eef.firebaseapp.com/game"
    console.log(this.newInfo)
  }

}
