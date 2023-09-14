import './style.css'
import FlyingWindows from './flying-windows.ts'

(function() {
  let imageVal = 0;
  const flyingWindows = new FlyingWindows(document.querySelector<HTMLDivElement>('#app')!, 6, 5,0.4)
  flyingWindows.addImage('/image_18.jpg');

  document.body.addEventListener('click', ()=> {
    if(imageVal === 0) {
      flyingWindows.addImage('/sensique-project-hero-mobile.jpg')
      imageVal = 1;
    } else {
      flyingWindows.addImage('/image_18.jpg');
      imageVal = 0;
    }
  })
  
})();





