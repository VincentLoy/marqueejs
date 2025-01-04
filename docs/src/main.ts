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
  let sep = marqueejs('.marquee-separator', {
    direction: 'left',
    separator: '•',
    gap: 40,
    cloneCount: 8
  });

  window.setTimeout(() => {
    sep.updateDirection('right');
    sep.updateGap(150);
    sep.updateCloneCount(10);
    sep.updateSeparator(' > ');
    sep.updateSpeed(350);
  }, 2000);
  
  window.setTimeout(() => {
    sep.updateSeparator('•••');
    sep.updateDirection('left');
    sep.updateGap(80);
    sep.updateSpeed(188);
    sep.addContent([
      'New item added dynamically',
      // '<script>alert("XSS ATTACK MOTHER FUCKER")</script>',
      '<p><span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">FLASH</span> <span>Batman killed in LA</span></p>',
      '<p><span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">COINS</span> <span>Bitcoin reached 1M$</span></p>',
    ], true);
  }, 4000);

  // Vertical
  let vertical = marqueejs('.marquee-vertical', {
    direction: 'up',
    speed: 100,
    gap: 20,
    cloneCount: 3,
    containerHeight: 450,
    keepOriginalContent: true,
    // separator: '•',
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
  }, 100);

  window.setTimeout(() => {
    vertical.replaceContent([
      'New item replacing old ones',
      'Another new item added dynamically to replace the old fake content!!!'
    ]);

    vertical.updateGap(50);
    // vertical.updateContainerHeight(50);
  }, 500);

  // Fast with pause
  marqueejs('.marquee-fast', {
    speed: 200,
    pauseOnHover: true,
    cloneCount: 3
  });
});
