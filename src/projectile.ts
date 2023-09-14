import * as P5 from 'p5';
import findPointBetweenTwo from './utils/findPointBetweenTwo';

interface OptionsObject {
  startPosition?: PositionObject,
  projectiles?: any[],
  frameRate?:number
  speed?:number
}

interface PositionObject {
  x:number,
  y:number
}

class Projectile {
  startPosition:PositionObject = { x: 0, y: 0};
  endPosition:PositionObject = this.startPosition;
  position:PositionObject = {x: 0, y:0};
  p5instance:P5;
  progress:number = 0;
  frameRate:number = 60;
  projectiles?:any[];
  imageSource?:any|null = null;
  speed:number = 4;

  constructor(p5:P5, image:any|null, options?: OptionsObject) {
    this.p5instance = p5;
    this.imageSource = image;

    if(options && options.frameRate) {
      this.frameRate = options.frameRate;
    }

    if(options && options.speed) {
      this.speed = options.speed;
    }
    
    if(options && options.projectiles) {
      this.projectiles = options.projectiles;
    }

    if(options && options.startPosition) {
      this.startPosition = options.startPosition;
      this.position = this.startPosition;

      const centreX = this.p5instance.width / 2;
      const centreY = this.p5instance.height / 2;

      //Calculate the end position
      const xDiff = ((this.startPosition.x - centreX) * 2);
      const yDiff = ((this.startPosition.y - centreY) * 2);
      this.endPosition = { x: this.startPosition.x + xDiff, y: this.startPosition.y + yDiff}
    }
  
  }

  update = (updateEvent?: (position: PositionObject) => void) => {
    if(this.imageSource) {
      if(this.progress > 3.2 && this.projectiles) {
        this.destroy();
      } else if(this.progress <= 3) {
        const scaleVal = 10 + (this.progress * 100);
        const scaleShift = scaleVal / 2;
        const position = findPointBetweenTwo(this.progress,this.startPosition.x,this.startPosition.y, this.endPosition.x,this.endPosition.y)
        this.p5instance.image(this.imageSource,position.x - scaleShift, position.y - scaleShift,scaleVal, scaleVal); 
        //this.p5instance.rect(position.x - scaleShift, position.y - scaleShift,scaleVal, scaleVal); 
        //this.p5instance.line(this.startPosition.x, this.startPosition.y, this.endPosition.x, this.endPosition.y);
        //this.p5instance.stroke(126);
      }
      this.progress += (this.frameRate / this.speed) * (1/this.frameRate);
     
  
      if(updateEvent)
        updateEvent(this.position);
    }
  }

  destroy = () => {
    if(this.projectiles) {
      const loc = this.projectiles.indexOf(this);
      if(loc > -1){
        //exists
        this.projectiles.splice(loc,1);
      }
    }
    
  }
}

export default Projectile;