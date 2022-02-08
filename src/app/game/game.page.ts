import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  asNativeElements,
} from '@angular/core';
import { Platform, IonRange, ModalController } from '@ionic/angular';
import { ImageManipulatorService } from '../services/image-manipulator.service';
import { ImageGeneratorService } from '../services/image-generator.service';
import { UiService } from '../services/ui.service';
import { Share } from '@capacitor/share';
import { MediastackService } from '../services/mediastack.service';
import { NewPage } from '../new/new.page';

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
  @ViewChild('info') info: HTMLDivElement;
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
  currentRGB;
  showButtonB = false;
  showButtonS = false;
  showButtonSh = false;
  tmpP = 0;
  completed = 0;
  currentNew=null;
  showButtonR=false;

  constructor(
    private platform: Platform,
    private iM: ImageManipulatorService,
    private iG: ImageGeneratorService,
    private UI: UiService,
    public modalController: ModalController
  ) {

    
    this.width = this.platform.width();
    this.height = this.platform.height();
    let portrait = true;
    if (this.width > this.height) portrait = false;

    if (!portrait) this.width = this.height * 0.6;
    if (portrait && this.width > 1024) this.width = 1024;
    for (let i = 0; i < 256; i++) {
      this.map[i] = new Array<number>(256);
    }
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map.length; j++) {
        this.map[i][j] = 0;
      }
    }
  }
  ngOnInit(): void {
    //
    this.card = document.querySelector('.card');
    
  }

  public doTry() {
    if (this.nTry == 3) return;
    let c = parseInt(this.cyan.value + '');
    let m = parseInt(this.magenta.value + '');
    let y = parseInt(this.yellow.value + '');
    let k = parseInt(this.black.value + '');
    const [r, g, b] = this.iM.cmyk2rgb(c, m, y, k);
    this.nTry++;
    this.valuesTray.push(this.iM.rgbToHex(r, g, b));
    for (let i = this.valuesTray.length - 1; i >= 0; i--) {
      console.log(this.valuesTray[i] + '--' + i);
      this.iM.drawTry(this.tC, this.valuesTray[i], i + 1);
    }
    let points = this.iM.deltaE(this.currentRGB, [r, g, b]);
    this.Tint -= 10;
    if(100 - points<85) this.Tint-=5;
    if(100 - points<70) this.Tint-=5;
    if(this.Tint<0) this.Tint=0;
    this.flipToInfo('points', {
      points: 100 - points,
      tries: this.nTry,
      color: [r, g, b],
    });
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
   
    /*this.iM.drawTry(this.tC, '#00F', 2);
    this.iM.drawTry(this.tC, '#0F0', 1);*/
    //OJO
    this.currentNew=await this.iG.getNew(this.sC);
    
    //await this.iM.drawImage(this.sC, this.image);
    this.imageData = this.sC.getContext('2d').createImageData(256, 256);

    this.play();
    this.UI.closeLoading();
    this.showPanel('main');
    this.showPanel('panel');
    //this.iM.drawBoard(this.pxC,128);
  }

  public play() {
    //ask if finished
    this.nTry = 0;
    this.valuesTray = [];
    this.iM.clearCanvas(this.tC);
    const [x, y] = this.getCoord();
    const [r, g, b] = this.iM.getColor(this.sC, x, y);
    this.currentRGB = [r, g, b];
    this.iM.fillCanvas(this.pC, this.iM.rgbToHex(r, g, b));
    this.prepareTint();

    
  }
  public reset(){
    this.Tint=100;
    let canvas=document.getElementById("pixels") as HTMLCanvasElement;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {
        this.map[i][j]=0;
        }
      }
    this.play();
    this.showButtonR=false;
    this.flipToTools();
  }
  private async openNew(){
    const modal = await this.modalController.create({
      component: NewPage,
      cssClass: 'my-custom-class',
      componentProps: {'newInfo':this.currentNew}
    });
    return await modal.present();
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
    console.log([x, y]);
    return [x, y];
  }

  public hidePanel(id) {
    document.getElementById(id).classList.remove('shown');
  }
  public showPanel(id) {
    document.getElementById(id).classList.add('shown');
  }
  public flipToInfo(screen?, data?) {
    document.getElementById('infodetail').innerHTML = '';
    if (screen == 'points') {
      if (data.points >= 70 && this.Tint > 0) {
        this.tmpP = data.points;
        this.showButtonS = true;
      } else {
        if (data.tries < 3 && this.Tint > 0) {
          this.showButtonB = true;
        } else {
          document.getElementById('infodetail').innerHTML = 'GAME OVER';
          document.getElementById('tools').classList.add('disabled');
          this.card.classList.add('is-flipped');
          document.getElementById('info').classList.remove('disabled');
          this.showButtonR=true;
          return;
        }
      }

      let message = '';
      data.points=Math.round(data.points);
      if (data.points > 90) {
        message = 'VERY IMPRESSIVE '+data.points+"% AFFINITY";
      } else if (data.points > 80) {
        message = 'GREAT '+data.points+"% AFFINITY";
      } else if (data.points > 70) {
        message = 'NOT TOO BAD '+data.points+"% AFFINITY";
      } else if (data.points > 60) {
        message = 'ALMOST '+data.points+"% AFFINITY";
      } else if (data.points > 50) {
        message = 'YOU CAN DO IT BETTER '+data.points+"% AFFINITY";
      } else {
        message = 'BAD '+data.points+"% AFFINITY";
      }
      document.getElementById('infodetail').innerHTML = message;
    }

    document.getElementById('tools').classList.add('disabled');
    this.card.classList.add('is-flipped');
    document.getElementById('info').classList.remove('disabled');
  }
  public flipToTools() {
    //only reset if finish
    this.showButtonB = false;
    this.showButtonS = false;
    document.getElementById('info').classList.add('disabled');
    this.card.classList.remove('is-flipped');
    document.getElementById('tools').classList.remove('disabled');
  }
  public async solve() {
    let c = parseInt(this.cyan.value + '');
    let m = parseInt(this.magenta.value + '');
    let y = parseInt(this.yellow.value + '');
    let k = parseInt(this.black.value + '');
    const [r, g, b] = this.iM.cmyk2rgb(c, m, y, k);
    await this.UI.showLoading();
    //this.hidePanel("main");
    //pasar el color en cuestión.
    let founds = await this.iM.solve(
      /*[r, g, b],*/
      this.currentRGB,
      this.tmpP,
      this.map,
      this.sC,
      this.pxC
    );
    //this.showPanel("main");
    if (this.tmpP > 75) {
      this.Tint += 5;
    }
    if (this.tmpP > 85) {
      this.Tint += 5;
    }
    if (this.tmpP > 95) {
      this.Tint += 5;
    }
    if(this.Tint>100)this.Tint=100;

    this.UI.closeLoading();
    this.completed = Math.floor(this.isComplete() * 100);

    if (this.completed < 100) {
      this.play();
      this.flipToTools();
    } else {
      this.showButtonB = false;
      this.showButtonS = false;
      document.getElementById('infodetail').innerHTML =
        'COMPLETED, ' + this.Tint + ' tint left';
        await this.openNew();
    }
  }
  public isComplete() {
    let c = 0;
    let t = 0;
    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map.length; j++) {
        t++;
        if (this.map[i][j] == 1) {
          c++;
        }
      }
    }
    return c / t;
  }
  public async share() {
    if (Share.canShare()) {
      await Share.share({
        title: 'See cool stuff',
        text: 'Really awesome thing you need to see right meow',
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share with buddies',
      });
    }
    //https://twitter.com/intent/tweet?url=wordle.danielfrg.com&text=Wordle%20(ES)%20%2330%204%2F6%0A%0A%E2%AC%9C%F0%9F%9F%A8%F0%9F%9F%A8%E2%AC%9C%F0%9F%9F%A8%0A%F0%9F%9F%A9%E2%AC%9C%F0%9F%9F%A8%F0%9F%9F%A9%F0%9F%9F%A9%0A%F0%9F%9F%A9%F0%9F%9F%A9%E2%AC%9C%F0%9F%9F%A9%F0%9F%9F%A9%0A%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%0A%0A
    //https://telegram.me/share/url?url=wordle.danielfrg.com&text=Wordle%20(ES)%20%2330%204%2F6%0A%0A%E2%AC%9C%F0%9F%9F%A8%F0%9F%9F%A8%E2%AC%9C%F0%9F%9F%A8%0A%F0%9F%9F%A9%E2%AC%9C%F0%9F%9F%A8%F0%9F%9F%A9%F0%9F%9F%A9%0A%F0%9F%9F%A9%F0%9F%9F%A9%E2%AC%9C%F0%9F%9F%A9%F0%9F%9F%A9%0A%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%0A%0A
    //https://api.whatsapp.com/send?text=Wordle%20(ES)%20%2330%204%2F6%0A%0A%E2%AC%9C%F0%9F%9F%A8%F0%9F%9F%A8%E2%AC%9C%F0%9F%9F%A8%0A%F0%9F%9F%A9%E2%AC%9C%F0%9F%9F%A8%F0%9F%9F%A9%F0%9F%9F%A9%0A%F0%9F%9F%A9%F0%9F%9F%A9%E2%AC%9C%F0%9F%9F%A9%F0%9F%9F%A9%0A%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%F0%9F%9F%A9%0A%0A%20wordle.danielfrg.com
    //https://www.facebook.com/sharer/sharer.php?u=wordle.danielfrg.com
  }
}
