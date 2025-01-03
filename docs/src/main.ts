import './style.css'
import { marqueejs } from '../../src/index'

// Initialize demos
document.addEventListener('DOMContentLoaded', () => {
  // Basic example
  marqueejs('.marquee-basic', {
    speed: 100,
    cloneCount: 4
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
  }).stop();

  // Vertical
  marqueejs('.marquee-vertical', {
    direction: 'left',
    speed: 80,
    gap: 30,
    cloneCount: 2,
    separator: '•',
    contentList: [
      'First item',
      'Second item with largest content size here',
      'Third item'
    ]
  });

  // Fast with pause
  marqueejs('.marquee-fast', {
    speed: 200,
    pauseOnHover: true,
    cloneCount: 3
  });
});
