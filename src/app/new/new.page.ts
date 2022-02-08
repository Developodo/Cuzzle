import { Component, Input, OnInit } from '@angular/core';
import { New } from '../model/New';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  @Input() newInfo: New;
  constructor() { } 

  ngOnInit() {
    console.log(this.newInfo)
  }

}
