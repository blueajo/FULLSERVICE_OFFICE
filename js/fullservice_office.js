// START UP -------------------------------------------------------------------------------------
let mobile = false;
let scrollInterval = null;

// Load page on start
document.addEventListener("DOMContentLoaded", (event) => {
  if (screen.width <= 768) {
    mobile = true;
    openPage('index');
    if (location.hash) {
      history.pushState("", document.title, window.location.pathname);
    }
    scrollInterval = setInterval(scrollHandler,1000/30);
  } else {
    if (location.hash) {
      openPage(location.hash.substring(1));
    } else {
      openPage('index');
    }
  }
});

window.addEventListener('hashchange', function(){
  const section = window.location.hash ? window.location.hash.substring(1) : 'index';
  closePage();
  openPage(section);
});

// GLOBAL VARIABLES -----------------------------------------------------------------------------

const index = document.getElementById('index-page');
const production = document.getElementById('production-page');
const serviceProviders = document.getElementById('service-providers-page');
const pitches = document.getElementById('pitches-page');
const info = document.getElementById('info-page');
const rootFontSize = 10;

function remToPx(remValue) {
  return remValue * rootFontSize;
}

// CUSTOM CURSORS -------------------------------------------------------------------------------

// Index cursor objects
const videoDot = document.getElementById('index-cursor');
const allVideos = videoDot.querySelectorAll("video");
let activeLink = null;
const quadrants = [['production', 'pitches'],
                   ['service-providers', 'info']];
let cursorInterval = null;
// Cursor object
var mouseX=window.innerWidth/2,
    mouseY=window.innerHeight/2;

var indexCursor = { 
    el: document.getElementById('index-cursor'),
    x: window.innerWidth/2, 
    y: window.innerHeight/2,
    quadrant: [0,0],
    curVideo: null,
    update: function() {
              // LOCATION OF FOLLOWER
              this.x = lerp (this.x, mouseX, 0.075);
              this.y = lerp (this.y, mouseY, 0.075);

              // SET VIDEO
              const videoNumber = Math.floor(this.x / (window.innerWidth/16)) % 8;
              this.quadrant[0] = (this.x / window.innerWidth) > .5 ? 1 : 0;
              this.quadrant[1] = (this.y / window.innerHeight) > .5 ? 1 : 0;
              const category = quadrants[this.quadrant[0]][this.quadrant[1]];
              const video = document.getElementById(category + '-' + videoNumber + '-video');
              if (this.curVideo != video) {
                // PAUSE THE CURRENT VIDEO
                if (this.curVideo && this.curVideo.classList.contains("active")) {
                    this.curVideo.classList.remove("active");
                    this.curVideo.pause();
                }
                // PLAY THE NEW VIDEO
                if (video && !video.classList.contains("active")) {
                    video.classList.add("active");
                    video.play();
                }
                this.curVideo = video;
              }

              this.el.style = 'transform: translate3d('+ this.x +'px,'+ this.y +'px, 0);'
            }
};

function lerp (start, end, amt){
  return (1-amt)*start+amt*end;
}

// Info cursor objects
const copyright = document.getElementById('info-cursor');
const infoLinks = document.querySelectorAll('#info-page a');
var infoCursor = {
    el: copyright,
    x: window.innerWidth/2, 
    y: window.innerHeight/2,
    update: function() {
              this.x = mouseX;
              this.y = mouseY;
              this.el.style = 'transform: translate3d('+ this.x +'px,'+ this.y +'px, 0);'
            }
};

function indexFollow() {
  indexCursor.update();
}

function infoFollow() {
  infoCursor.update();
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Video cursor behavior
index.addEventListener("mouseleave", (e) => {
  videoDot.classList.remove('active');
  if (activeLink) {
    activeLink.classList.remove('active-link');
    activeLink = null;
  }
});

index.addEventListener("mouseenter", (e) => {
  videoDot.classList.add('active');
});

// Copyright cursor behavior
info.addEventListener("mouseleave", (e) => {
  copyright.classList.remove('active');
});

info.addEventListener("mouseenter", (e) => {
  copyright.classList.add('active');
});

info.addEventListener("mousedown", (e) => {
  copyright.classList.remove('active');
});

info.addEventListener("mouseup", (e) => {
  copyright.classList.add('active');
});

for (let i = 0; i < infoLinks.length; i++) {
  const link = infoLinks[i];
  link.addEventListener('mouseenter', () => {
    copyright.classList.remove('active');
  });
  link.addEventListener('mouseout', () => {
    copyright.classList.add('active');
  });
}

// NAV -----------------------------------------------------------------------------------------

const pageLinks = document.getElementsByClassName('page-link');
const linkAreas = document.getElementsByClassName('link-area');

// Page selection
function closePage() {
  const section = document.querySelector('.page:not(.inactive)').id.slice(0, -5) ;
  const currentPage = document.getElementById(section + '-page');
  if (currentPage) { currentPage.classList.toggle('inactive'); }
  closeHeader(section);

  if (cursorInterval) {
    clearInterval(cursorInterval);
    cursorInterval = null;
  }
  if (section == 'index') {
    videoDot.classList.remove('active');
    videoCredits.classList.remove('active');
    document.getElementById('header').classList.remove('index-header');
  } else if (section == 'production') {
    if (ProductionCarousel.initialized()) {
      ProductionCarousel.deinitialize();
    }
    const productionVideos = production.querySelectorAll('video');
    for (let i = 0; i < productionVideos.length; i++) {
      productionVideos[i].pause();
    }
  } else if (section == 'info') {
    copyright.classList.remove('active');
  }
}

function openPage(section) {
  const page = document.getElementById(section + '-page');
  if (page) { page.classList.remove('inactive'); }
  expandHeader(section);
  // page-specific
  if (section == 'index') {
    videoCredits.classList.add('active');
    document.getElementById('header').classList.add('index-header');
    if (!mobile) {
      cursorInterval = setInterval(indexFollow,1000/60);
    }
  }
  if (section == 'info' && !mobile) {
    cursorInterval = setInterval(infoFollow,1000/60);
  }
  if (section == 'production' && !mobile) {
    ProductionCarousel.init();
  }
}

function closeHeader(section) {
  const pageLink = document.getElementById(section + '-link');
  const pageText = document.getElementById(section + '-text');
  const pageGap = document.getElementById(section + '-gap');
  if (pageLink) { pageLink.classList.remove('current-page'); }
  if (pageText) { pageText.classList.remove('active'); }
  if (pageGap) { pageGap.classList.remove('gap'); }
}

function expandHeader(section) {
  const pageLink = document.getElementById(section + '-link');
  const pageText = document.getElementById(section + '-text');
  const pageGap = document.getElementById(section + '-gap');
  if (pageLink) { pageLink.classList.add('current-page'); }
  if (pageText) { pageText.classList.add('active'); }
  if (pageGap) { pageGap.classList.add('gap'); }
}

// Open page on click
for (let i = 0; i < pageLinks.length; i++) {
  const pageLink = pageLinks[i];
  pageLink.addEventListener('click', () => {
    const section = pageLink.id.slice(0, -5);
    // set anchor link
    if (section == 'index') {
      history.pushState("", document.title, window.location.pathname);
      closePage();
      openPage(section);
    } else {
      location.hash = section;
    }
    if (mobile) {
      scrollAnimations = false;
      setTimeout(scrollAnimationOn, 1500);
      const scrollCoord = document.getElementById(section + '-page').offsetTop - remToPx(10);
      window.scrollTo({
        top: scrollCoord,
        left: 0,
        behavior: 'smooth'
      });
    }
  });
}

// INDEX -------------------------------------------------------------------------------------------------

const videoCredits = document.getElementById('video-credits');
const indexLink = document.querySelector('#footer p');

videoCredits.addEventListener('mouseenter', () => {
    if (window.innerWidth > 900) {
        indexLink.style.opacity = 1;
    } else {
        indexLink.style.opacity = 0;
    }
});

videoCredits.addEventListener('mouseleave', () => {
    indexLink.style.opacity = 1;
});

// Link areas on index page
for (let i = 0; i < linkAreas.length; i++) {
  const linkArea = linkAreas[i];
  const category = linkArea.id.slice(0, -5);
  linkArea.addEventListener('mouseenter', () => {
    const hoverLink = document.getElementById(category + "-link");
    if ( hoverLink != activeLink ) {
        if (activeLink) {
            activeLink.classList.remove('active-link');
        }
        hoverLink.classList.add('active-link');
        activeLink = hoverLink;
    }
  });

  linkArea.addEventListener('click', () => {
    const linkArea = linkAreas[i];
    const category = linkArea.id.slice(0, -5);
    const hoverLink = document.getElementById(category + "-link");
    if ( hoverLink ) {
      hoverLink.click();
    }
  });
}

// PRODUCTION --------------------------------------------------------------------------------------------

// =======================
// Production Carousel
// =======================
const ProductionCarousel = (() => {
  const state = {
    flkty: null,
    currOpenProduct: null,
    pauseScroll: false,
    scrollMomentum: 0,
    scrollDelta: 0,
    ticking: false,
    isHoveringCarousel: false
  };

  let viewport = null;
  const leftArrow = document.getElementById("left-arrow-area");
  const rightArrow = document.getElementById("right-arrow-area");
  const centerArea = document.getElementById("center-area");

  // =======================
  // Utility Functions
  // =======================
  const remToPx = rem => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const temporarilyPauseScroll = (duration = 600) => {
    state.pauseScroll = true;
    setTimeout(() => (state.pauseScroll = false), duration);
  };

  // =======================
  // Carousel Initialization
  // =======================
  function createCarousel() {
    state.flkty = new Flickity(production, {
      cellAlign: "center",
      wrapAround: true,
      pageDots: false,
      setGallerySize: false,
      accessibility: true,
      prevNextButtons: false,
      cellSelector: ".product",
      freeScroll: true
    });

    viewport = document.querySelector(".flickity-viewport");

    // Reset transform (important for Flickity)
    document.querySelector(".flickity-slider").style.transform = "translateX(0%)";

    // Static click: open/close products
    state.flkty.on("staticClick", (event, pointer, cellElement, cellIndex) => {
      if (!cellElement) return;
      if (cellElement === state.currOpenProduct) closeProduct();
      else openProduct(cellElement, cellIndex);
    });

    // Auto-play visible video only
    const videos = production.querySelectorAll("video");
    state.flkty.on("select", () => {
      videos.forEach(v => v.pause());
      const active = state.flkty.selectedElement?.querySelector("video");
      if (active) active.play();
    });

    // Play all videos initially if desired
    videos.forEach(v => v.play());

    console.log('flkty initialized');
  }

  function initialized() {
    return !(state.flkty == null);
  }

  function deinitialize() {
    if (state.flkty) {
      closeProduct();
      state.flkty.destroy();
    }
    state.flkty = null;
  }

  // =======================
  // Product Controls
  // =======================
  function openProduct(cellElement, cellIndex) {
    temporarilyPauseScroll(750);
    if (!state.currOpenProduct && state.ticking) cancelScroll();

    if (state.currOpenProduct !== cellElement) {
      closeProduct();

      cellElement.classList.add("open");
      let productMedia = cellElement.querySelector("img, video");

      let w = productMedia.naturalWidth || productMedia.videoWidth;
      let h = productMedia.naturalHeight || productMedia.videoHeight;

      const heightRatio = (window.innerHeight - remToPx(18)) / h;
      const widthRatio = (0.8 * window.innerWidth) / w;
      const scaleRatio = Math.min(heightRatio, widthRatio);

      productMedia.style.width = `${w * scaleRatio}px`;

      state.flkty.reposition();
      state.flkty.selectCell(cellIndex, true, false);
      state.flkty.once('settle', () => state.flkty.reposition());

      state.currOpenProduct = cellElement;
      state.flkty.options.dragThreshold = 10000;
      state.flkty.updateDraggable();

      leftArrow.classList.add("expanded");
      rightArrow.classList.add("expanded");
    }
  }

  function closeProduct() {
    if (!state.currOpenProduct) return;

    const product = state.currOpenProduct;
    product.classList.remove("open");

    const productMedia = product.querySelector("img, video");
    productMedia.style.width = "15vw";

    state.flkty.reposition();
    state.currOpenProduct = null;

    leftArrow.classList.remove("expanded");
    rightArrow.classList.remove("expanded");

    state.flkty.options.dragThreshold = 3;
    state.flkty.updateDraggable();
  }

  // =======================
  // Arrow Controls
  // =======================

  function handleArrowPress(dir) {
    if (state.currOpenProduct) {
        let index = (state.flkty.selectedIndex + dir) % state.flkty.cells.length;
        index = index < 0 ? state.flkty.cells.length - 1 : index;
        openProduct(state.flkty.cells[index].element, index);
      } else {
        let index = (state.flkty.selectedIndex + (dir * 5)) % state.flkty.cells.length;
        index = index < 0 ? state.flkty.cells.length - 5 : index;
        state.flkty.selectCell(index, true, false);
      }
    temporarilyDisablePointer();
  }

  function setupArrowControls() {
    leftArrow.addEventListener("click", () => {
      handleArrowPress(-1);
    });

    rightArrow.addEventListener("click", () => {
      handleArrowPress(1);
    });

    centerArea.addEventListener("click", closeProduct);
  }

  function temporarilyDisablePointer() {
    viewport.style.zIndex = "-1";
    production.addEventListener(
      "mousemove",
      () => (viewport.style.zIndex = "1"),
      { once: true }
    );
  }

  // =======================
  // Scroll Momentum Logic
  // =======================
  function setupScrollHandling() {
    production.addEventListener("mouseenter", () => (state.isHoveringCarousel = true));
    production.addEventListener("mouseleave", () => (state.isHoveringCarousel = false));

    window.addEventListener("wheel", handleWheel, { passive: false });
  }

  function handleWheel(e) {
    if (!state.isHoveringCarousel || state.pauseScroll) return;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

    e.preventDefault();

    // If a product is open, use scrolling to switch products
    if (state.currOpenProduct && Math.abs(state.scrollDelta) > 300) {
      temporarilyPauseScroll(750);

      let nextIndex = (state.flkty.selectedIndex + Math.sign(e.deltaY)) % state.flkty.cells.length;
      nextIndex = nextIndex < 0 ? state.flkty.cells.length - 1 : nextIndex;
      const nextEl = state.flkty.cells[nextIndex].element;
      
      openProduct(nextEl, nextIndex);

      state.scrollDelta = 0;
      state.scrollMomentum = 0;
      return;
    }

    // Apply momentum
    state.scrollMomentum += Math.sign(e.deltaY) * Math.pow(Math.abs(e.deltaY), 0.9) * 0.3;
    state.scrollMomentum = clamp(state.scrollMomentum, -100, 100);
    state.scrollDelta += e.deltaY;

    production.classList.add("scrolling");
    animateScroll();
  }

  function cancelScroll() {
    state.flkty.dragX = state.flkty.x;
    state.flkty.velocity = 0;
    state.flkty.dragEnd();
    state.ticking = false;
    state.scrollMomentum = 0;
    if (!state.currOpenProduct) state.scrollDelta = 0;
    production.classList.remove("scrolling");
  }

  function animateScroll() {
    if (state.ticking) return;
    state.ticking = true;
    state.pauseScroll = false; 

    const update = () => {
      if (state.pauseScroll) {
        state.ticking = false;
        state.scrollMomentum = 0;
        state.scrollDelta = 0;
        production.classList.remove("scrolling");
        return;
      }

      state.scrollMomentum *= 0.9; // friction

      if (Math.abs(state.scrollMomentum) > 0.3) {
        state.flkty.x -= state.scrollMomentum;
        state.flkty.dragX = state.flkty.x;
        state.flkty.positionSlider();
        requestAnimationFrame(update);
      } else {
        cancelScroll();
      }
    };

    requestAnimationFrame(update);
  }

  // =======================
  // Public API
  // =======================
  return {
    init() {
      createCarousel();
      setupArrowControls();
      setupScrollHandling();
    },
    openProduct,
    closeProduct,
    initialized,
    deinitialize
  };
})();

// SERVICE PROVIDERS --------------------------------------------------------------------------------

const serviceProvider = document.querySelectorAll(".service-provider");
const serviceProviderPortraits = document.querySelectorAll(".portrait");

for (let i = 0; i < serviceProvider.length; i++) {
  serviceProvider[i].addEventListener('mouseenter', () => {
    serviceProviderPortraits[i].classList.add('visible');
  });
  serviceProvider[i].addEventListener('mouseleave', () => {
    serviceProviderPortraits[i].classList.remove('visible');
  });
}

// PITCHES -----------------------------------------------------------------------------------------------

const pitchList = document.querySelectorAll(".checkbox-container");
const pitchesToSend = document.querySelector("#pitches-to-send");
let checkedCount = 0;
const contactForm = document.querySelector("#contact-form");
const message = document.getElementById('message');

for (let i = 0; i < pitchList.length; i++) {
    const pitch = pitchList[i];
    const pitchContent = pitch.querySelector(".checkbox-label").innerHTML;
    pitch.addEventListener('click', () => {
        if (pitch.classList.contains('checked')) {
            pitch.classList.remove('checked');
            const pitchToRemove = document.querySelector("#pitch" + i);
            pitchToRemove.remove();
            checkedCount--;
            if (checkedCount == 0 ) {
                contactForm.classList.remove('active');
                pitches.classList.remove('expanded');
            }
            console.log('-');
        } else {
            if (checkedCount < 5) {
                pitch.classList.add('checked');
                checkedCount++;
                pitchesToSend.innerHTML += 
                    '<div id=pitch' + i + ' class="dot-container">' +
                        '<span class="dot"></span>' +
                        '<p>' + pitchContent + '</p>' +
                    '</div>';
                if ( !contactForm.classList.contains('active') ) {
                    contactForm.classList.add('active');
                    pitches.classList.add('expanded');
                }
            }
        }
    });
}

message.addEventListener('input', (event) => {
  console.log('Content changed');
  message.style.color = 'black';
});

// SCROLL -------------------

let scrollAnimations = false;
let currPage = null;
setTimeout(scrollAnimationOn, 1000);

function scrollAnimationOn() {
  scrollAnimations = true;
}

function scrollHandler() {
  if (!scrollAnimations) return;
  [index, production, serviceProviders, pitches, info].forEach(page => {
    const pageTop = page.offsetTop;
    const pageHeight = page.offsetHeight;
    if (window.scrollY >= pageTop - remToPx(20) &&
        window.scrollY < pageTop + pageHeight - remToPx(20)) {
          if (currPage !== page) {
            closePage();
            openPage(page.id.slice(0, -5));
            currPage = page;
          }
    }
  });
}

const thresholds = [];
const numSteps = 20;

for (let i = 1.0; i <= numSteps; i++) {
  const ratio = i / numSteps;
  thresholds.push(ratio);
}

const options2 = {
  root: null, // default is the viewport
  rootMargin: "0px",
  threshold: thresholds // Trigger when 0% of the target element is visible
};

const observer2 = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (mobile) {
      const indexText = document.getElementById('index-text');
      indexText.style.opacity = entry.intersectionRatio;
    }
  });
}, options2);

observer2.observe(document.getElementById('mobile-video'));