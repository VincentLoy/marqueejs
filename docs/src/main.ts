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
  let vertical = marqueejs('.marquee-vertical', {
    direction: 'up',
    speed: 100,
    gap: 20,
    cloneCount: 3,
    containerHeight: 450,
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

  window.setTimeout(() => {
    vertical.addContent([
      'New item added dynamically',
      'Another new item added dynamically'
    ], true);
  }, 2000);

  window.setTimeout(() => {
    vertical.replaceContentList([
      'New item replacing old ones',
      'Another new item added dynamically to replace the old fake content!!!'
    ]);
  }, 6000);

  // Fast with pause
  marqueejs('.marquee-fast', {
    speed: 200,
    pauseOnHover: true,
    cloneCount: 3
  });
});
