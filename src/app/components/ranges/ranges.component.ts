import { Component, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import { IonRange } from '@ionic/angular';

@Component({
  selector: 'app-ranges',
  templateUrl: './ranges.component.html',
  styleUrls: ['./ranges.component.scss'],
})
export class RangesComponent implements OnInit {
  @ViewChild('cyan') cyan: IonRange;
  @ViewChild('magenta') magenta: IonRange;
  @ViewChild('yellow') yellow: IonRange;
  @ViewChild('black') black: IonRange;
  @Output() OnDoTry = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {}

  public doTry(){
    this.OnDoTry.emit(this.getValues());
  }

  public getValues(){
    return {
      c : parseInt(this.cyan.value + ''),
      m : parseInt(this.magenta.value + ''),
      y : parseInt(this.yellow.value + ''),
      k : parseInt(this.black.value + '')
    };
  }

}
