import './style.css'
import { marqueejs } from '../../src/index'

/* all supported classes for color props 
    bg-yellow-100 text-yellow-800
    bg-blue-100 text-blue-800
    bg-red-100 text-red-800
    bg-purple-100 text-purple-800
    bg-green-100 text-green-800
    bg-yellow-100 text-yellow-800
    bg-pink-100 text-pink-800
    */
const FAKED_DATA = [
  {
    "title": "Hogwarts is now open for visitors",
    "badge_text": "NEW",
    "color": "blue"
  },
  {
    "title": "Breaking: Who is behind the mask?",
    "badge_text": "HOT",
    "color": "red"
  },
  {
    "title": "Stupefy: the new spell that everyone is talking about",
    "badge_text": "TRENDING",
    "color": "purple"
  },
  {
    "title": "Limited Time: Get free spells with every purchase",
    "badge_text": "PROMO",
    "color": "green"
  },
  {
    "title": "Quick Update: Moon anomaly spotted tonight",
    "badge_text": "FLASH",
    "color": "yellow"
  },
  {
    "title": "Breaking: Harry Potter will come back in 2047!",
    "badge_text": "HOT",
    "color": "purple"
  },
  {
    "title": "Special Offer: use code <b>WELCOME</b> for 10% off",
    "badge_text": "PROMO",
    "color": "green"
  },
  {
    "title": "Quick Update: Philosopher's Stone now available",
    "badge_text": "FLASH",
    "color": "yellow"
  },
  {
    "title": "Update: Xbox Series X restocked",
    "badge_text": "INFO",
    "color": "purple"
  },
  {
    "title": "Exclusive: Batman VS Joker showdown imminent",
    "badge_text": "EXCLUSIVE",
    "color": "pink"
  },
  {
    "title": "<strong>Quick Update:</strong> Bitcoin hits new record",
    "badge_text": "FLASH",
    "color": "yellow"
  },
  {
    "title": "<strong>Get Ready:</strong> Android system upgrade ready",
    "badge_text": "NEWS",
    "color": "blue"
  },
  {
    "title": "New spell discovered in <b><i>Hogwarts</i></b>",
    "badge_text": "FLASH",
    "color": "yellow"
  },
  {
    "title": "Urgent: <strong>Voldemort</strong> returns from the dead",
    "badge_text": "URGENT",
    "color": "red"
  },
  {
    "title": "<b>Eco-friendly:</b> Complete guide to Wingardium Leviosa",
    "badge_text": "ECO",
    "color": "green"
  }
];

// Initialize demos
document.addEventListener('DOMContentLoaded', () => {
  let getBadge = (color: string, text: string) => {
    return `<span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800 rounded">${text}</span>`;
  }

  // Basic example
  let basic = marqueejs('.marquee-basic', {
    speed: 100,
    cloneCount: 10,
  });

  console.log(basic.getContentList());

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
    const newContent = FAKED_DATA.map(item => 
      `<p>${getBadge(item.color, item.badge_text)} <span>${item.title}</span></p>`
    );

    sep.updateSeparator('•••');
    sep.updateGap(80);
    sep.updateCloneCount(0);
    
    sep.addContent(newContent, true, () => {
      console.log('Content added');
    });

  }, 8000);

  // Vertical
  marqueejs('.marquee-vertical', {
    direction: 'up',
    speed: 50,
    gap: 20,
    cloneCount: 3,
    containerHeight: 350,
    keepOriginalContent: true,
    contentList: [
      '<b>Director:</b> Albus Dumbledore',
      '<b>Producer:</b> Minerva McGonagall',
      '<b>Screenwriter:</b> Severus Snape',
      '<b>Composer:</b> Filius Flitwick',
      '<b>Costume Designer:</b> Pomona Sprout',
      '<b>Visual Effects:</b> Gilderoy Lockhart',
      '<b>Editor:</b> Horace Slughorn',
      '<b>Art Director:</b> Sybill Trelawney',
      '<b>Makeup Artist:</b> Nymphadora Tonks',
      '<b>Stunt Coordinator:</b> Mad-Eye Moody'
    ]
  });

  // Fast with pause
  marqueejs('.marquee-fast', {
    speed: 200,
    pauseOnHover: true,
    cloneCount: 3
  });
});
