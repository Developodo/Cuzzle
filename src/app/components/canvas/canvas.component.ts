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
  //Receive optionally the param color to be filled with
  @Input('color') color?: any;
  //Emits showGameHelp event when canvas is clicked
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
  /**
   * Set the dimmesions of canvas
   * @param width px
   * @param heigh px
   */
  public setSize(width: number, heigh: number):void {
    this.canvas.width = width;
    this.canvas.height = heigh;
  }
  /**
   * Fills with a solid color the canvas
   * @param color RGB code
   */
  public fill(color: string):void {
    let ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * Draw an image in canvas
   * @param image url or data
   * @param dx horizontal displacement (px)
   * @param dy vertical displacement (px)
   * @param size width and height of image (suppposed to be square shaped)
   * @returns null when image is loaded and ready to be rendered
   */
  public async drawImage(image: string, dx = 0, dy = 0,size=256):Promise<null> {
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
  /**
   * It draws an image in the canvas, taking size param to make a square centered cropped
   * image from url
   * @param size size of square in pixels
   * @param url the url of image
   * @returns null when image is loaded and ready to be rendered
   */
  public drawcropImage(size = 256, url):Promise<null> {
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
        else 
          ctx.drawImage(image, 0, -dy, image.width, size + dy);
        resolve(null);
      };
    });
  }
  /**
   * It draws a triangle from left bottom corner with a background color.
   * It is used for showing to the player the color of the last trying
   * @param color RRB color to draw the triangle
   * @param n number indicating trying (1,2,3)
   */
  public drawTry(color: string, n: any = 1):void {
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
  /**
   * It returns de opposite color of the given one
   * @param hex color used to searh the opposite
   * @param bw background color for better contrast
   * @returns the RGB code
   */
  public invertColor(hex, bw):string {
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
  /**
   * It triggers the event called showGameHeld listened (optionally) by parent component
   * @param value nothing useful in this case. Only for demostration purpose
   */
  public showHelp(value?: string):void {
    this.showGameHelp.emit(value);
  }
  /**
   * It erases all canvas info
   */
  public clear():void{
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * It gets the ImageData forma a square of canvas
   * @param size size in pixel of square required
   * @returns the image data from the square
   */
  public getImageData(size=256):ImageData{
    return this.canvas.getContext('2d').createImageData(size, size);
  }
  /**
   * Return info (RGBA) from a pixel of canvas
   * @param x horizontal coord
   * @param y vertical coord
   * @returns Array -> [R,G,B,Alpha]
   */
  public getImageDataByCoord(x,y):Uint8ClampedArray{
    return this.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
  }
  /**
   * It paints a pixel in the canvas
   * @param x horizontal coord
   * @param y vertical coord
   * @param color color in RCG code
   */
  public setImageDataByCoord(x,y,color):void{
    let context=this.canvas.getContext('2d');
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
    context.fill();
  }
}
