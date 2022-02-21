import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas') _canvas: ElementRef;
  @Input('color') color?: any;
  @Output() showGameHelp = new EventEmitter<string>();

  private canvas: HTMLCanvasElement;
  constructor() {}
  ngOnInit() {}
  ngAfterViewInit() {
    if (this._canvas) this.canvas = this._canvas.nativeElement;
    if (this.color) {
      this.fill(this.color);
    }
  }

  public setSize(width: number, heigh: number) {
    this.canvas.width = width;
    this.canvas.height = heigh;
  }
  public fill(color: string) {
    let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  public async drawImage(image: string, dx = 0, dy = 0,size=256) {
    return new Promise((resolve, reject) => {
      let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
      let img = new Image();
      img.addEventListener('load', async () => {
        ctx.drawImage(
          img,
          dx,
          dy,
          size,
          size,
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        resolve(null);
      });
      img.setAttribute('src', image);
    });
  }
  public drawcropImage(size = 256, url) {
    return new Promise((resolve, reject) => {
      const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');

      let image = new Image();
      image.crossOrigin = '';
      image.src = url;

      image.onload = (d) => {
        const ratio = image.width / image.height;

        if (image.width > image.height) {
          image.height = size;
          image.width = size * ratio;
        } else {
          image.width = size;
          image.height = size * ratio;
        }
        let dx = Math.abs(size - image.width) / 2;
        let dy = Math.abs(size - image.height) / 2;
        if (image.width > image.height)
          ctx.drawImage(image, -dx, 0, size + dx, image.height);
        else ctx.drawImage(image, 0, -dy, image.width, size + dy);
        resolve(null);
      };
    });
  }
  public drawTry(color: string, n: any = 1) {
    let parts = this.canvas.width / 3;
    let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.font = '30px Arial';
    ctx.beginPath();
    ctx.moveTo(this.canvas.width, this.canvas.height);
    ctx.lineTo(this.canvas.width, Math.round(this.canvas.height - parts * n));
    ctx.stroke();
    ctx.lineTo(Math.round(this.canvas.width - parts * n), this.canvas.height);
    ctx.stroke();
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = this.invertColor(color, color); //opossite del tintento
    ctx.fillText(
      n,
      this.canvas.width - 20,
      this.canvas.height - parts * (n - 1) - 10
    );
  }
  public getColor(xCoord, yCoord) {
    const [r, g, b] = this.canvas
      .getContext('2d')
      .getImageData(xCoord, yCoord, 1, 1).data;
    return [r, g, b];
  }
  public invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    let r: any = parseInt(hex.slice(0, 2), 16);
    let g: any = parseInt(hex.slice(2, 4), 16);
    let b: any = parseInt(hex.slice(4, 6), 16);
    if (bw) {
      // https://stackoverflow.com/a/3943023/112731
      return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
  }

  public padZero(str, len?) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
  showHelp(value?: string) {
    this.showGameHelp.emit(value);
  }
  public clear(){
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  public getImageData(size=256){
    this.canvas.getContext('2d').createImageData(size, size);
  }
  public getImageDataByCoord(x,y){
    return this.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
  }
  
  public setImageDataByCoord(x,y,color){
    let context=this.canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
    context.fill();
  }
}
