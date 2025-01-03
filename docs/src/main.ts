import './style.css'
import { marqueejs } from '../../src/index'

// Initialize demos
document.addEventListener('DOMContentLoaded', () => {
  let test = marqueejs('.marquee-demo', {
    speed: 100,
    direction: 'left',
    cloneCount: 10,
    gap: 20
  });

  window.setTimeout(() => {
    test.updateContent('Updated content - This is a new message !!');
  }, 2000);
});
