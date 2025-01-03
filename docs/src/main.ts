import './style.css'
import { marqueejs } from '../../src/index'

// Initialize demos
document.addEventListener('DOMContentLoaded', () => {
  // Basic example
  marqueejs('.marquee-basic', {
    speed: 100,
    cloneCount: 3
  });

  // Right to left
  marqueejs('.marquee-rtl', {
    direction: 'right',
    speed: 150,
    cloneCount: 3
  });

  // With separator
  marqueejs('.marquee-separator', {
    separator: '•',
    gap: 40,
    cloneCount: 8
  });

  // Vertical
  marqueejs('.marquee-vertical', {
    direction: 'up',
    speed: 80,
    cloneCount: 4
  });

  // Fast with pause
  marqueejs('.marquee-fast', {
    speed: 200,
    pauseOnHover: true,
    cloneCount: 3
  });
});
