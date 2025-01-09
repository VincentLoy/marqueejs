import "./style.css";
import { marqueejs } from "../../src/index";

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
    title: "Hogwarts is now open for visitors",
    badge_text: "NEW",
    color: "blue",
  },
  {
    title: "Breaking: Who is behind the mask?",
    badge_text: "HOT",
    color: "red",
  },
  {
    title: "Stupefy: the new spell that everyone is talking about",
    badge_text: "TRENDING",
    color: "purple",
  },
  {
    title: "Limited Time: Get free spells with every purchase",
    badge_text: "PROMO",
    color: "green",
  },
  {
    title: "Quick Update: Moon anomaly spotted tonight",
    badge_text: "FLASH",
    color: "yellow",
  },
  {
    title: "Breaking: Harry Potter will come back in 2047!",
    badge_text: "HOT",
    color: "purple",
  },
  {
    title: "Special Offer: use code <b>WELCOME</b> for 10% off",
    badge_text: "PROMO",
    color: "green",
  },
  {
    title: "Quick Update: Philosopher's Stone now available",
    badge_text: "FLASH",
    color: "yellow",
  },
  {
    title: "Update: Xbox Series X restocked",
    badge_text: "INFO",
    color: "purple",
  },
  {
    title: "Exclusive: Batman VS Joker showdown imminent",
    badge_text: "EXCLUSIVE",
    color: "pink",
  },
  {
    title: "<strong>Quick Update:</strong> Bitcoin hits new record",
    badge_text: "FLASH",
    color: "yellow",
  },
  {
    title: "<strong>Get Ready:</strong> Android system upgrade ready",
    badge_text: "NEWS",
    color: "blue",
  },
  {
    title: "New spell discovered in <b><i>Hogwarts</i></b>",
    badge_text: "FLASH",
    color: "yellow",
  },
  {
    title: "Urgent: <strong>Voldemort</strong> returns from the dead",
    badge_text: "URGENT",
    color: "red",
  },
  {
    title: "<b>Eco-friendly:</b> Complete guide to Wingardium Leviosa",
    badge_text: "ECO",
    color: "green",
  },
];

// Initialize demos
document.addEventListener("DOMContentLoaded", () => {
  let getBadge = (color: string, text: string) => {
    return `<span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-${color}-100 text-${color}-800 rounded">${text}</span>`;
  };

  // Basic example
  let basic = marqueejs(".marquee-basic", {
    speed: 100,
    cloneCount: "auto",
  });

  // Right to left
  marqueejs(".marquee-rtl", {
    direction: "right",
    speed: 150,
  });

  // With separator
  let sep = marqueejs(".marquee-with-separator", {
    direction: "left",
    separator: "/",
    separatorStyles: "color: #58e; font-size: 1.8rem;",
    heightSecurityMargin: 100,
    gap: 100,
  });

  // Vertical
  let test = marqueejs(".marquee-vertical", {
    direction: "up",
    speed: 25,
    gap: 15,
    containerHeight: 350,
    keepOriginalContent: true,
    pauseOnHover: true,
    randomize: true,
    contentList: [
      '<b>Director:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Albus_Dumbledore" rel="nofollow noopener" target="_blank">Albus Dumbledore</a>',
      '<b>Producer:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Minerva_McGonagall" rel="nofollow noopener" target="_blank">Minerva McGonagall</a>',
      '<b>Screenwriter:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Severus_Snape" rel="nofollow noopener" target="_blank">Severus Snape</a>',
      '<b>Composer:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Filius_Flitwick" rel="nofollow noopener" target="_blank">Filius Flitwick</a>',
      '<b>Costume Designer:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Pomona_Sprout" rel="nofollow noopener" target="_blank">Pomona Sprout</a>',
      '<b>Visual Effects:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Gilderoy_Lockhart" rel="nofollow noopener" target="_blank">Gilderoy Lockhart</a>',
      '<b>Editor:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Horace_Slughorn" rel="nofollow noopener" target="_blank">Horace Slughorn</a>',
      '<b>Art Director:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Sybill_Trelawney" rel="nofollow noopener" target="_blank">Sybill Trelawney</a>',
      '<b>Makeup Artist:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Nymphadora_Tonks" rel="nofollow noopener" target="_blank">Nymphadora Tonks</a>',
      '<b>Stunt Coordinator:</b> <a class="text-blue-600" href="https://harrypotter.fandom.com/wiki/Alastor_Moody" rel="nofollow noopener" target="_blank">Mad-Eye Moody</a>',
    ],
  });

  // Fast with pause
  marqueejs(".marquee-fast", {
    speed: 200,
    pauseOnHover: true,
    cloneCount: 3,
  });

  // Advanced Examples Section

  // 1. News Ticker with Dynamic Updates
  const newsMarquee = marqueejs("#news-ticker", {
    speed: 80,
    pauseOnHover: true,
    gap: 40,
    separator: "⚡",
    randomize: true,
    contentList: FAKED_DATA.map((item) => `${getBadge(item.color, item.badge_text)} ${item.title}`),
  });

  // 2. Social Media Feed
  const socialFeed = marqueejs("#social-feed", {
    direction: "up",
    speed: 40,
    containerHeight: 200,
    gap: 30,
    contentList: [
      "🐦 Latest Tweet from Hogwarts",
      "📸 New Instagram post from @wizard_weekly",
      "📱 Facebook update from Ministry of Magic",
      "💼 LinkedIn: Dumbledore is hiring!",
    ],
  });

  // 3. Multi-Speed Demo
  const speedDemo = marqueejs("#speed-demo", {
    speed: 50,
    cloneCount: "auto",
  });

  setInterval(() => {
    const randomSpeed = parseInt((Math.random() * 150 + 50).toString());
    speedDemo.updateSpeed(randomSpeed);
  }, 3000);

  // 4. Interactive Gap Demo
  const gapDemo = marqueejs("#gap-demo", {
    gap: parseInt((document.querySelector("#gap-control") as HTMLInputElement)?.value) || 20,
    separator: "↔️",
    contentList: ["<b>Adjust</b>", "The", "<b>Gap</b>", "Size"],
  });

  document.querySelector("#gap-control")?.addEventListener("input", (e) => {
    gapDemo.updateGap(Number((e.target as HTMLInputElement).value));
  });

  // 5. Alternating Direction
  const directionDemo = marqueejs("#direction-demo", {
    direction: "left",
    speed: 200,
  });

  setInterval(() => {
    directionDemo.switchDirection();
  }, 5000);

  // 6. Clone Count Showcase - Improved
  const cloneDemo = marqueejs("#clone-demo", {
    speed: 80,
    gap: 50,
    cloneCount: 3,
    contentList: ['<div class="clone-item px-4 py-2">Text Example</div>'],
  });

  // Add index to cloned items
  let updtEltsIdx = () => {
    document
      .querySelectorAll(".clone-demo .marquee-cloned-item .clone-item")
      .forEach((item, index) => {
        item.innerHTML = `${item.innerHTML} - <b> clone: ${index + 1} </b>`;
      });
  };
  updtEltsIdx();

  document.querySelector("#clone-control")?.addEventListener("input", (e) => {
    const value = Number((e.target as HTMLInputElement).value);
    document.querySelector("#clone-count-display")!.textContent = `${value} clones`;
    cloneDemo.updateCloneCount(value);
    updtEltsIdx();
    cloneDemo.recalculatePositions();
  });

  // 7. Complexe HTML Structure
  marqueejs(".marquee-complex", {
    heightSecurityMargin: 30,
    separator: "⚡",
    gap: 80,
    speed: 33,
    cloneCount: 1,
  });

  // 7. Complexe Showcase
  let t = marqueejs(".marquee-showcase", {
    direction: "left",
    heightSecurityMargin: 30,
    gap: 100,
    speed: 66,
    cloneCount: 10,
  });

  // Smooth scroll for anchor links
  document.querySelectorAll("[data-smooth]").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href") || "#";
      const target =
        href === "#" ? document.documentElement : document.querySelector(href.toString());

      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - 25;
        document.querySelector(".nav-active")?.classList.remove("nav-active");
        anchor.classList.add("nav-active");
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
        // Update URL without reload
        history.pushState(null, "", href);
      } else {
        window.scrollTo({
          top: 20,
          behavior: "smooth",
        });
        // Update URL to top
        history.pushState(null, "", "");
      }
    });
  });

  /**
   * MOBILE NAVIGATION
   */
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const aside = document.querySelector("aside");

  function toggleMenu() {
    const isOpen = aside?.classList.contains("translate-x-0");
    aside?.classList.toggle("translate-x-0", !isOpen);
    aside?.classList.toggle("-translate-x-full", isOpen);
    mobileMenuOverlay?.classList.toggle("hidden", isOpen);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  }

  mobileMenuToggle?.addEventListener("click", toggleMenu);
  mobileMenuOverlay?.addEventListener("click", toggleMenu);

  // Close menu when clicking navigation links on mobile
  document.querySelectorAll("aside a[data-smooth]").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 1024) {
        // lg breakpoint
        toggleMenu();
      }
    });
  });
});
