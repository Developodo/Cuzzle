import { Component, Input, OnInit } from '@angular/core';
import { New } from '../../model/New';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  @Input() newInfo: New;
  @Input() today: string;
  @Input() tint: number;

  count;
  dcountText="Calculando tiempo para la próxima noticia..."
  counter;
  url;
  message;

  constructor() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0,0,0,0)
    this.count = Math.floor(Math.abs(tomorrow.getTime() - today.getTime())/1000);
    this.counter = setInterval(()=>{
      this.timer()}, 1000);
   } 
   timer() {
    this.count = this.count - 1;
    if (this.count == -1) {
        clearInterval(this.counter);
        return;
    }

    let seconds = this.count % 60;
    let minutes = Math.floor(this.count / 60);
    let hours = Math.floor(minutes / 60);
    minutes %= 60;
    hours %= 60;

    this.dcountText = hours + " horas " + minutes + " minutos y " + seconds + " segundos para la siguiente noticia"; // watch for spelling
  }
  ngOnInit() {
    this.url="https://cuzzle-90eef.firebaseapp.com/game";
    this.message="Cuzzle+%0d%0a"+this.today+"+("+this.tint+"%25+de+tinta)%0d%0a"
  }



}
