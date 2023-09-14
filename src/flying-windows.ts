import * as P5 from 'p5';
import Projectile from './projectile';
import { getRandomInt } from './utils/getRandomInt';

class FlyingWindows {
  container:HTMLDivElement;
  projectiles:any = Array();
  imageSource?:any|null= null;
  frameRate:number = 3;
  speed:number = 4;
  frequency:number = 1.4;
  p5instance?:P5;

  constructor(container:HTMLDivElement, frameRate?:number, speed?:number, frequency?:number) {
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
      const canvas = p5.createCanvas(this.container.offsetWidth, this.container.offsetHeight);
      canvas.style('display', 'block');
      canvas.parent(this.container);
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
    }

    p5.draw = () => {
      p5.clear(255,255,255,1);
      if(this.projectiles.length > 0) {
        this.projectiles.forEach((projectile:Projectile, pIndex:number) => {
          projectile.update();
        });
      }
    }
  }
}

export default FlyingWindows;