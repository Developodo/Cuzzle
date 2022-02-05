import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageManipulatorService {
  constructor() {}

  public fillCanvas(canvas: HTMLCanvasElement, color: string) {
    let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.fillStyle = color;
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


  public async solve(color,points,map,canvasP,canvasS:HTMLCanvasElement){
    return new Promise(async (resolve,reject)=>{
      let s=0;
      let x=0;
    for(let i=0;i<map.length;i++){
      for(let j=0;j<map.length;j++){
        if(map[i][j]==0){
          x++;
          if (x % 1000 === 0)
            await this.pause()
          let colorx=canvasP.getContext('2d').getImageData(i, j, 1, 1).data;
          if(this.deltaE(color,colorx)<(100-points*0.8)){
            map[i][j]=1; s++;
            let context=canvasS.getContext('2d');
            context.beginPath();
            context.fillStyle = this.rgbToHex(colorx[0],colorx[1],colorx[2]) || '#000';
            context.fillRect(i, j, 1, 1);
            context.fill();
          }
        }
      }
    }
    resolve(s);
    })
    
  }
  private pause() {
    return new Promise(r => setTimeout(r, 0))
  }

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
/**
<1 no perceptible
1-2 close close
2-10 perceptible at a glance
11-49 more similar than opposite
100 opposite
*/
  public deltaE(rgbA, rgbB) {
    let labA = this.rgb2lab(rgbA);
    let labB = this.rgb2lab(rgbB);
    let deltaL = labA[0] - labB[0];
    let deltaA = labA[1] - labB[1];
    let deltaB = labA[2] - labB[2];
    let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    let deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    let sc = 1.0 + 0.045 * c1;
    let sh = 1.0 + 0.015 * c1;
    let deltaLKlsl = deltaL / (1.0);
    let deltaCkcsc = deltaC / (sc);
    let deltaHkhsh = deltaH / (sh);
    let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
  }
  private rgb2lab(rgb){
    let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
  }
}
