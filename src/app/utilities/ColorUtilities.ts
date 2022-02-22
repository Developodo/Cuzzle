import { CanvasComponent } from '../components/canvas/canvas.component';
export class ColorUtilities{
    /**
     * Paints on canvasP all the pixels related to canvasS (in the same position)
     * witch aren't solved yet and have an affinity range less than the number given
     * by points
     * @param color given as key to solve
     * @param points tolerance to solve colors similar to color
     * @param map array de pixels pending to be solved
     * @param canvasP canvas to be painted
     * @param canvasS canvas reference as solution
     * @returns number of pixels painted
     */
    public static async solve(
        color:string,
        points:number,
        map:Array<Array<number>>,
        canvasP: CanvasComponent,
        canvasS: CanvasComponent
      ):Promise<number> {
        return new Promise(async (resolve, reject) => {
          let s = 0;
          let x = 0;
          for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map.length; j++) {
              if (map[i][j] == 0) {
                x++;
                if (x % 1000 === 0) await ColorUtilities.pause();
                let colorx = canvasP.getImageDataByCoord(i, j);
    
                if (ColorUtilities.deltaE(color, colorx) < points / 2.5) {
                  map[i][j] = 1;
                  s++;
                  canvasS.setImageDataByCoord(
                    i,
                    j,
                    ColorUtilities.rgbToHex(colorx[0], colorx[1], colorx[2]) || '#000'
                  );
                }
              }
            }
          }
          resolve(s);
        });
      }
      //Private method to introduce a delay in solve method
      //Just for User Xpercience
      private static pause() {
        return new Promise((r) => setTimeout(r, 0));
      }
      /**
       * Converts CMYK colors TO RGB code
       * @param c Cyan value
       * @param m Magenta value
       * @param y Yellow value
       * @param k Black value
       * @returns array [r,g,b] color code
       */
      public static cmyk2rgb(c: any, m: any, y: any, k: any) {
        c = c / 100;
        m = m / 100;
        y = y / 100;
        k = k / 100;
        let r = parseInt(255 * (1 - c) * (1 - k) + '');
        let g = parseInt(255 * (1 - m) * (1 - k) + '');
        let b = parseInt(255 * (1 - y) * (1 - k) + '');
        return [r, g, b];
      }
      /**
       * Concerts RGB colors to Hexadecimal code
       * @param r Red value
       * @param g Green value
       * @param b Blue Value
       * @returns string with Hex code #FF0000 (example)
       */
      public static rgbToHex = (r, g, b) =>
        '#' +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          })
          .join('');

   /**
    * Calculates affinity between two colors (RGBA)
    * <1 no perceptible
    * 1-2 close close
    * 2-10 perceptible at a glance
    * 11-49 more similar than opposite
    * 100 opposite
    * @param rgbA first color [r,g,b]
    * @param rgbB second color [r,g,b]
    * @returns affinity 0-100
    */
    public static deltaE(rgbA, rgbB) {
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
        let deltaLKlsl = deltaL / 1.0;
        let deltaCkcsc = deltaC / sc;
        let deltaHkhsh = deltaH / sh;
        let i =
          deltaLKlsl * deltaLKlsl +
          deltaCkcsc * deltaCkcsc +
          deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
      }
      /** Internal method used by deltaE method
       */
      private static rgb2lab(rgb) {
        let r = rgb[0] / 255,
          g = rgb[1] / 255,
          b = rgb[2] / 255,
          x,
          y,
          z;
        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
        return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
      }
      /**
       * Given a color, returns a color with high contrast
       * @param hex original color (hexadecimal format)
       * @param bw background color enforces a better contrast
       * @returns hex code of the color with high contrast
       */
      public static invertColor(hex, bw) {
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
      /** Internal method used by invertColor
       */
      public static padZero(str, len?) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
      }
}