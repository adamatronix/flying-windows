import * as P5 from 'p5';
import Projectile from './projectile';
import { getRandomInt } from './utils/getRandomInt';
import { dither } from './dither';

class FlyingWindows {
  container:HTMLDivElement;
  projectiles:any = Array();
  imageSource?:any|null= null;
  frameRate:number = 3;
  speed:number = 4;
  frequency:number = 1.4;
  p5instance?:P5;
  pixelDensity:number = 2;
  clear:boolean = true;

  constructor(container:HTMLDivElement, clear?:boolean, frameRate?:number, speed?:number, frequency?:number, pixelDensity?:number) {
    this.container = container;
    if(frameRate) {
      this.frameRate = frameRate;
    }

    if(speed) {
      this.speed = speed;
    }

    if(frequency) {
      this.frequency = frequency;
    }

    if(pixelDensity) {
      this.pixelDensity = pixelDensity;
    }

    if(clear !== null) {
      this.clear = clear;
    }
    
    this.projectiles
    new P5(this.sketch);
  }

  addImage = (imgSrc:string) => {
    if(this.p5instance)
      this.imageSource = this.p5instance.loadImage(imgSrc);
  }

  sketch = (p5: P5) => {
    this.p5instance = p5;
    const self = this;

    const addProjectile = () => {
      self.projectiles.unshift(new Projectile(p5, this.imageSource, {
        startPosition: { x: (p5.width / 2) + getRandomInt(-200,200), y: (p5.height / 2) + getRandomInt(-200,200) },
        projectiles: this.projectiles,
        frameRate: this.frameRate,
        speed: this.speed
      }));
    }

    p5.setup = () => {
      p5.pixelDensity(this.pixelDensity);
      const canvas = p5.createCanvas(this.container.offsetWidth, this.container.offsetHeight);
      canvas.style('display', 'block');
      canvas.style('image-rendering', 'pixelated');
      canvas.parent(this.container);
      p5.background(0);
      p5.frameRate(this.frameRate);

      setInterval(() => {
        addProjectile();
      }, ((1/this.frameRate) * this.frequency) * 1000);
    }

    p5.mousePressed = function () {
      self.projectiles.push(new Projectile(p5,self.imageSource,{
        startPosition: {x: p5.mouseX, y: p5.mouseY}
      }));
    }

    p5.windowResized = () => {
      p5.resizeCanvas(this.container.offsetWidth,this.container.offsetHeight)
      p5.background(0);
    }

    p5.draw = () => {
      if(this.clear) {
        p5.clear(0,0,0,1);
        p5.background(0);
      }
      
      if(this.projectiles.length > 0) {
        this.projectiles.forEach((projectile:Projectile, pIndex:number) => {
          projectile.update();
        });
      }
      //dither(p5);
    }
  }
}

export default FlyingWindows;