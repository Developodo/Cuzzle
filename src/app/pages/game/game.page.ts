import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Platform,ModalController } from '@ionic/angular';
import { ImageGeneratorService } from '../../services/image-generator.service';
import { UiService } from '../../services/ui.service';
import { NewPage } from '../new/new.page';
import { CanvasComponent } from '../../components/canvas/canvas.component';
import { ColorUtilities } from '../../utilities/ColorUtilities';
import { RangesComponent } from '../../components/ranges/ranges.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  @ViewChild('puzzle') puzzleCanvas: CanvasComponent;
  @ViewChild('solution') solutionCanvas: CanvasComponent;
  @ViewChild('tries') triesCanvas: CanvasComponent;
  @ViewChild('pixels') pixelsCanvas: CanvasComponent;
  @ViewChild('ranges') ranges:RangesComponent;
  @ViewChild('info') info: HTMLDivElement;

  width: number;
  height: number;
  imageData:ImageData;
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
  currentNew = null;
  showButtonR = false;
  next = false;
  help = false;

  constructor(
    private platform: Platform,
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
    this.card = document.querySelector('.card');
  }
  /**
   * Loads new data and prepares canvas sizes.
   */
  async ionViewDidEnter() {
    await this.UI.showLoading();
    let already = await localStorage.getItem(this.iG.getToday());
    if (already && already != '') {
      let info = JSON.parse(already);
      await this.openNew(info);
      await this.UI.closeLoading();
      return;
    }

    this.triesCanvas.setSize(this.width / 2.1, this.width / 2.1);
    this.puzzleCanvas.setSize(this.width / 2.1, this.width / 2.1);
    this.pixelsCanvas.setSize(this.width / 2.1, this.width / 2.1);
    this.solutionCanvas.setSize(this.width / 2.1, this.width / 2.1);

    document.getElementById('hack').style.height = this.width / 2.1 + 'px';

    this.currentNew = await this.iG.getNew();
    await this.solutionCanvas.drawcropImage(256, this.currentNew.image);

    this.imageData = this.solutionCanvas.getImageData();

    this.play();
    this.UI.closeLoading();
    this.showPanel('main');
    this.showPanel('panel');
  }
  /**
   * Clears all parameter. Gets first color to be found.
   * Prepares canvas.
   * @param next 
   */
  public play(next = false):void {
    this.nTry = 0;
    this.valuesTray = [];
    this.triesCanvas.clear();
    const [x, y] = this.getCoord(next);

    const [r, g, b] = this.solutionCanvas.getImageDataByCoord(x, y);
    this.currentRGB = [r, g, b];
    this.puzzleCanvas.fill(ColorUtilities.rgbToHex(r, g, b));
  }
  /**
   * It calculates the affinity of the color introduced by user and
   * the color to be found. It Opens info card for feedback.
   * @param d Array [C,M,Y.K] with the values of color ranges
   */
  public doTry(d):void {
    if (this.nTry == 3) return;
    const [r, g, b] = ColorUtilities.cmyk2rgb(d.c, d.m, d.y, d.k);
    this.nTry++;
    this.valuesTray.push(ColorUtilities.rgbToHex(r, g, b));
    for (let i = this.valuesTray.length - 1; i >= 0; i--) {
      this.triesCanvas.drawTry(this.valuesTray[i], i + 1);
    }
    let points = ColorUtilities.deltaE(this.currentRGB, [r, g, b]);
    this.Tint -= 10;
    if (100 - points < 85) this.Tint -= 5;
    if (100 - points < 70) this.Tint -= 5;
    if (this.Tint < 0) this.Tint = 0;
    this.flipToInfo('points', {
      points: 100 - points,
      tries: this.nTry,
      color: [r, g, b],
    });
  }
  /**
   * Start over again the game. 
   * Reseting all parameters and canvas.
   */
  public reset():void {
    this.completed = 0;
    this.Tint = 100;
    this.pixelsCanvas.clear();
    for (let i = 0; i < 256; i++) {
      for (let j = 0; j < 256; j++) {
        this.map[i][j] = 0;
      }
    }
    this.play();
    this.showButtonR = false;
    this.flipToTools();
  }
  /**
   * Opens new Page in modal view
   * @param info to be injected in modal page
   * @returns a promise resolved when modal is presented
   */
  private async openNew(info?):Promise<void> {
    const modal = await this.modalController.create({
      component: NewPage,
      cssClass: 'my-custom-class',
      componentProps: info
        ? info
        : {
            newInfo: this.currentNew,
            today: this.iG.getToday(),
            tint: this.Tint,
          },
      showBackdrop: false,
      backdropDismiss: false,
      animated: true,
      swipeToClose: true,
    });
    return await modal.present();
  }
  /**
   * It searchs in map variable the next pixel not solved yet, to be 
   * defined as the next color to be found
   * @param next true if the last color wasn't found by user in 3 attemps, and
   * it's needed to search next color starting by the end of the array
   * to give to the player a new opportunity with a new color.
   * @returns [x,y] coord of the next pixel to be solved by player
   */
  public getCoord(next?) {
    let x = 0;
    let y = 0;
    let found = false;

    if (next) {
      for (let i = 255; i >= 0 && !found; i--) {
        for (let j = 255; j >= 0 && !found; j--) {
          if (this.map[i][j] == 0) {
            x = i;
            y = j;
            found = true;
          }
        }
      }
    } else {
      for (let i = 0; i <= 256 && !found; i++) {
        for (let j = 0; j < 256 && !found; j++) {
          if (this.map[i][j] == 0) {
            x = i;
            y = j;
            found = true;
          }
        }
      }
    }

    if (!found) {
      //game finished
    }
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
        //this.showButtonS = true;
      } else {
        if (data.tries < 3 && this.Tint > 0) {
          this.showButtonB = true;
        } else {
          if (this.Tint > 0) {
            this.showButtonB = true;
            this.next = true;
          } else {
            document.getElementById('infodetail').innerHTML = 'GAME OVER';
            document.getElementById('tools').classList.add('disabled');
            this.card.classList.add('is-flipped');
            document.getElementById('info').classList.remove('disabled');
            this.showButtonR = true;
            return;
          }
        }
      }

      let message = '';
      data.points = Math.round(data.points);
      if (data.points > 90) {
        message = 'Impresionante 8O , ' + data.points + '% de afinidad';
      } else if (data.points > 80) {
        message = 'Gran trabajo :D , ' + data.points + '% de afinidad';
      } else if (data.points > 70) {
        message = 'No está mal :) , ' + data.points + '% de afinidad';
      } else if (data.points > 60) {
        message = 'Casi :~ , ' + data.points + '% de afinidad';
      } else if (data.points > 50) {
        message =
          'Ánimo, puedes hacerlo mejor :/ , ' + data.points + '% de afinidad';
      } else {
        message = 'Fatal :( , ' + data.points + '% de afinidad';
      }
      document.getElementById('infodetail').innerHTML = message;
    }

    document.getElementById('tools').classList.add('disabled');
    this.card.classList.add('is-flipped');
    document.getElementById('info').classList.remove('disabled');

    if (data.points >= 70)
      setTimeout(() => {
        this.solve();
      }, 500);
  }
  public flipToTools() {
    //only reset if finish
    if (this.next == true) {
      this.play(true);
      this.next = false;
    }
    this.showButtonB = false;
    this.showButtonS = false;
    document.getElementById('info').classList.add('disabled');
    this.card.classList.remove('is-flipped');
    document.getElementById('tools').classList.remove('disabled');
  }
  public async solve() {
    let d=this.ranges.getValues();
    const [r, g, b] = ColorUtilities.cmyk2rgb(d.c, d.m, d.y, d.k);
    await this.UI.showLoading();
    let founds = await ColorUtilities.solve(
      this.currentRGB,
      this.tmpP,
      this.map,
      this.solutionCanvas,
      this.pixelsCanvas
    );
    if (this.tmpP > 75) {
      this.Tint += 5;
    }
    if (this.tmpP > 85) {
      this.Tint += 5;
    }
    if (this.tmpP > 95) {
      this.Tint += 5;
    }
    if (this.Tint > 100) this.Tint = 100;

    this.UI.closeLoading();
    this.completed = Math.floor(this.isCompleted * 100);

    if (this.completed < 100) {
      this.play();
      this.flipToTools();
    } else {
      this.showButtonB = false;
      this.showButtonS = false;
      await localStorage.setItem(
        this.iG.getToday(),
        JSON.stringify({
          newInfo: this.currentNew,
          today: this.iG.getToday(),
          tint: this.Tint,
        })
      );
      document.getElementById('infodetail').innerHTML =
        'COMPLETADO, ' + this.Tint + ' tint left';
      await this.openNew();
    }
  }
  public get isCompleted() {
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
  public showHelp() {
    this.help = true;
    setTimeout(() => {
      document.getElementById('hackhelp').style.height =
        this.width / 2.1 + 'px';
    }, 150);
  }
}
