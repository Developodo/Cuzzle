import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageManipulatorService {
  constructor() {}

  public fillCanvas(canvas: HTMLCanvasElement, color: string) {
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.fillStyle = color;
    console.log(canvas.width + '++' + canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  public drawTry(canvas: HTMLCanvasElement, color: string, n: any = 1) {
    let parts=canvas.width/3;
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = '30px Arial';
    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, Math.round(canvas.height -parts*n));
    ctx.lineTo(Math.round(canvas.width -parts*n), canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#000';  //opossite del tintento
    ctx.fillText(
      n,
      canvas.width - 20,
      canvas.height - parts*(n-1)-10
    );
  }
  public async drawImage(canvas: HTMLCanvasElement, image: string) {
    return new Promise((resolve, reject) => {
      let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
      let img = new Image();
      img.addEventListener('load', async () => {
        console.log('imagen cargada');
        console.log(img.src);
        ctx.drawImage(img, 0, 0, 256, 256, 0, 0, canvas.width, canvas.height);
        resolve(null);
      });
      console.log(image);
      img.setAttribute('src', image);
    });
  }
  public drawBoard(
    canvas: HTMLCanvasElement,
    n: number,
    color: string = '#000'
  ) {
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    let offset = canvas.width / n;
    let cw = canvas.width;
    let ch = canvas.height;

    for (let x = 0; x <= cw; x += offset) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
    }

    for (let x = 0; x <= ch; x += offset) {
      ctx.moveTo(0, x);
      ctx.lineTo(cw, x);
    }

    ctx.strokeStyle = color;
    ctx.stroke();
  }

  public getColor(canvas:HTMLCanvasElement,xCoord,yCoord) {
    const [r,g,b]= canvas.getContext('2d').getImageData(xCoord, yCoord, 1, 1).data;
    return [r,g,b];
  }
  public gbToHex = ([r, g, b]) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('');

  public clearCanvas(canvas:HTMLCanvasElement){
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }
  public cmyk2rgb(c:any,m:any,y:any,k:any){
    c = (c / 100);
      m = (m / 100);
      y = (y / 100);
      k = (k / 100);
    let r = parseInt(255 * (1 - c) * (1 - k)+"");
    let g = parseInt(255 * (1 - m) * (1 - k)+"");
    let b = parseInt(255 * (1 - y) * (1 - k)+"");
    return [r,g,b];
  }
  public rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('');
}
