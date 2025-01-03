import './style.css'
import { marqueejs } from '../../src/index'

// Initialize demos
document.addEventListener('DOMContentLoaded', () => {
  marqueejs('.marquee-demo', {
    speed: 150,
    direction: 'left',
    cloneCount: 5,
    gap: 20
  });
});
