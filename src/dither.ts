import * as P5 from 'p5';

export const dither = (p5:P5) => {
  let steps = 1;
  p5.loadPixels();

  for (let y = 0; y < p5.height; y++) {
    for (let x = 0; x < p5.width; x++) {
      let clr = getColorAtindex(x, y);
      let oldR = p5.red(clr);
      let oldG = p5.green(clr);
      let oldB = p5.blue(clr);
      let newR = closestStep(steps, oldR);
      let newG = closestStep(steps, oldG);
      let newB = closestStep(steps, oldB);

      let newClr = p5.color(newR, newG, newB);
      setColorAtIndex(x, y, newClr);

      let errR = oldR - newR;
      let errG = oldG - newG;
      let errB = oldB - newB;

      distributeError(x, y, errR, errG, errB);
    }
  }

  p5.updatePixels();

  function closestStep(steps:number, value:number) {
    return p5.round(steps * value / 255) * p5.floor(255 / steps);
  }

  function imageIndex(x:number, y:number) {
    return 4 * (x + y * p5.width);
  }
  
  function setColorAtIndex(x:number, y:number, clr:any) {
    let idx = imageIndex(x, y);
  
    let pix = p5.pixels;
    pix[idx] = p5.red(clr);
    pix[idx + 1] = p5.green(clr);
    pix[idx + 2] = p5.blue(clr);
    pix[idx + 3] = p5.alpha(clr);
  }

  function getColorAtindex(x:number, y:number) {
    let idx = imageIndex(x, y);
    let pix = p5.pixels;
    let red = pix[idx];
    let green = pix[idx + 1];
    let blue = pix[idx + 2];
    let alpha = pix[idx + 3];
    return p5.color(red, green, blue, alpha);
  }

  function distributeError(x:number, y:number, errR:number, errG:number, errB:number) {
    addError(7 / 16.0, x + 1, y, errR, errG, errB);
    addError(3 / 16.0, x - 1, y + 1, errR, errG, errB);
    addError(5 / 16.0, x, y + 1, errR, errG, errB);
    addError(1 / 16.0, x + 1, y + 1, errR, errG, errB);
  }

  function addError(factor:number, x:number, y:number, errR:number, errG:number, errB:number) {
    if (x < 0 || x >= p5.width || y < 0 || y >= p5.height) return;
    let clr = getColorAtindex(x, y);
    let r = p5.red(clr);
    let g = p5.green(clr);
    let b = p5.blue(clr);
    clr.setRed(r + errR * factor);
    clr.setGreen(g + errG * factor);
    clr.setBlue(b + errB * factor);
  
    setColorAtIndex(x, y, clr);
  }
}

