import './style.css'
import { marqueejs } from '../../src/index'

// Initialize demos
document.addEventListener('DOMContentLoaded', () => {
  marqueejs('.marquee-demo', {
    speed: 100,
    direction: 'left',
  });
});
