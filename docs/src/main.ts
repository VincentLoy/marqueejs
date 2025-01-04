import './style.css'
import { marqueejs } from '../../src/index'

// Initialize demos
document.addEventListener('DOMContentLoaded', () => {
  // Basic example
  marqueejs('.marquee-basic', {
    speed: 100,
    cloneCount: 10,
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
    speed: 30,
    gap: 10,
    cloneCount: 2,
    containerHeight: 100,
    keepOriginalContent: true,
    separator: '•',
    contentList: [
      'First item',
      'Second item with largest content size here',
      'Third item with <i>italic tag</i> and <em>emphasis tag</em>',
      'Another item here with <b>a bold tag</b> and <a class="text-blue-500 font-bold" href="#">link</a>',
      'This one should pop out of the container scope and be displayed after'
    ]
  });

  // Fast with pause
  marqueejs('.marquee-fast', {
    speed: 200,
    pauseOnHover: true,
    cloneCount: 3
  });
});
