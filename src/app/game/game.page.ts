import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  asNativeElements,
} from '@angular/core';
import { Platform, IonRange } from '@ionic/angular';
import { ImageManipulatorService } from '../services/image-manipulator.service';
import { ImageGeneratorService } from '../services/image-generator.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  @ViewChild('puzzle') puzzleCanvas: ElementRef;
  @ViewChild('solution') solutionCanvas: ElementRef;
  @ViewChild('tries') triesCanvas: ElementRef;
  @ViewChild('pixels') pixelsCanvas: ElementRef;
  @ViewChild('cyan') cyan: IonRange;
  @ViewChild('magenta') magenta: IonRange;
  @ViewChild('yellow') yellow: IonRange;
  @ViewChild('black') black: IonRange;
  pC: HTMLCanvasElement;
  sC: HTMLCanvasElement;
  tC: HTMLCanvasElement;
  pxC: HTMLCanvasElement;
  width: number;
  height: number;
  image;
  imageData;
  map = new Array(256);
  nTry = 0;
  valuesTray = [];
  maxTint = 100;
  public Tint = 100;
  card;

  constructor(
    private platform: Platform,
    private iM: ImageManipulatorService,
    private iG: ImageGeneratorService,
    private UI: UiService
  ) {
    this.width = this.platform.width();
    this.height = this.platform.height();
    if (this.width > 1024) this.width = 1024;
    for (let i = 0; i < 256; i++) {
      this.map[i] = new Array<number>(256);
    }
  }
  ngOnInit(): void {
    //
    this.card = document.querySelector('.card');
   
  }

  public doTry() {
    if(this.nTry==3) return;
    let c = parseInt(this.cyan.value+"");
    let m = parseInt(this.magenta.value+"");
    let y = parseInt(this.yellow.value+"");
    let k = parseInt(this.black.value+"");
    const [r,g,b]=this.iM.cmyk2rgb(c,m,y,k);
    this.nTry++;
    this.valuesTray.push(this.iM.rgbToHex(r,g,b));
    for(let i=this.valuesTray.length-1;i>=0;i--){
      console.log(this.valuesTray[i]+"--"+i)
      this.iM.drawTry(this.tC,this.valuesTray[i],i+1);
    }
    this.card.classList.toggle('is-flipped');
  }


  async ionViewDidEnter() {
    await this.UI.showLoading();
    this.image = await this.iG.getImage();
    this.pC = this.puzzleCanvas.nativeElement;
    this.sC = this.solutionCanvas.nativeElement;
    this.tC = this.triesCanvas.nativeElement;
    this.pxC = this.pixelsCanvas.nativeElement;

    this.pC.height = this.pC.width = this.width / 2.1;
    this.sC.height = this.sC.width = this.width / 2.1;
    this.tC.height = this.tC.width = this.width / 2.1;
    this.pxC.height = this.pxC.width = this.width / 2.1;

    document.getElementById('hack').style.height = this.pC.height + 'px';

    this.iM.fillCanvas(this.sC, '#F00');

    /*this.iM.drawTry(this.tC, '#00F', 2);
    this.iM.drawTry(this.tC, '#0F0', 1);*/

    await this.iM.drawImage(this.sC, this.image);
    this.imageData = this.sC.getContext('2d').createImageData(256, 256);

    this.play();
    this.UI.closeLoading();
    //this.iM.drawBoard(this.pxC,128);
  }

  public play() {
    //ask if finished
    this.nTry = 0;
    this.valuesTray = [];
    this.iM.clearCanvas(this.tC);
    const [x, y] = this.getCoord();
    const [r, g, b] = this.iM.getColor(this.sC, x, y);

    this.iM.fillCanvas(this.pC, this.iM.gbToHex([r, g, b]));
    this.prepareTint();
  }

  private prepareTint() {}
  public getCoord() {
    let x = 0;
    let y = 0;
    let found = false;
    for (let i = 0; i < 256 && !found; i++) {
      for (let j = 0; j < 256 && !found; j++) {
        if (this.map[i][j] == 0) {
          x = i;
          y = j;
          found = true;
        }
      }
    }
    if (!found) {
      //game finished
    }
    return [x, y];
  }
}
