// START UP -------------------------------------------------------------------------------------

const section = 'index';

// Load page on start
document.addEventListener("DOMContentLoaded", (event) => {
  selectPage(section);
  if (window.innerWidth < mobileBreakpoint) {
    mobile = true;
    setMobile();
  }
});

// BASELINE GRID --------------------------------------------------------------------------------

document.body.onkeyup = function(e) {
  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    document.documentElement.classList.toggle("show-grid");
  }
};

// GLOBAL VARIABLES -----------------------------------------------------------------------------
let mobile = false;

const index = document.getElementById('index');
const production = document.getElementById('production');
const serviceProviders = document.getElementById('service-providers');
const pitches = document.getElementById('pitches');
const info = document.getElementById('info');
const rootFontSize = 16; //parseFloat(getComputedStyle(document.documentElement).fontSize);
const mobileBreakpoint = remToPx(40);
const tabletBreakpoint = remToPx(64);

function remToPx(remValue) {
  return remValue * rootFontSize;
}

// CUSTOM CURSORS -------------------------------------------------------------------------------

// Index cursor objects
const videoDot = document.getElementById('video-dot');
const allVideos = document.querySelectorAll("#videos video");
const allOverflowVideos = document.querySelectorAll("#overflow-videos video");
let curVideo = null;
let activeLink = null;
const quadrants = [['production', 'service-providers'],
                   ['pitches', 'info']];

// Info cursor objects
const copyright = document.getElementById('copyright');
const infoLinks = document.querySelectorAll('#info a');

// Cursor object
var mouseX=window.innerWidth/2,
    mouseY=window.innerHeight/2;

var cursorFollower = { 
    el: document.getElementById('cursorFollower'),
    x: window.innerWidth/2, 
    y: window.innerHeight/2,
      draggyUpdate: function() {
                      this.x = lerp (this.x, mouseX, 0.1);
                      this.y = lerp (this.y, mouseY, 0.1);
                      this.el.style = 'transform: translate3d('+ this.x +'px,'+ this.y +'px, 0);'
                    },
      update: function() {
                this.x = mouseX;
                this.y = mouseY;
                this.el.style = 'transform: translate3d('+ this.x +'px,'+ this.y +'px, 0);'
              }
};

function lerp (start, end, amt){
  return (1-amt)*start+amt*end;
}

function move() {
  // update positions
  const currentPageLink = document.getElementsByClassName('current-page')[0];
  const currentSection = currentPageLink.id.slice(0, -5);
  if (currentSection == 'index') {
    cursorFollower.draggyUpdate();
    const videoNumber = Math.floor(cursorFollower.x /(window.innerWidth/10)) % 5;
    const yQuadrant = (cursorFollower.y / window.innerHeight) > .5 ? 1 : 0;
    const xQuadrant = (cursorFollower.x / window.innerWidth) > .5 ? 1 : 0;
    const category = quadrants[yQuadrant][xQuadrant];
    const video = category + '-' + videoNumber + '-video';
    
    hideVideo(curVideo);
    startVideo(video);

  } else if (currentSection == 'info') {
    cursorFollower.update();
  }
}

setInterval(move,1000/60);

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

function hideVideo(videoName) {
    const video = document.getElementsByClassName(videoName);
    if (video[0] && video[0].classList.contains("active")) {
        video[0].classList.remove("active");
        video[1].classList.remove("active");
        video[0].pause();
        video[1].pause();
    }
}

function startVideo(videoName) {
    const video = document.getElementsByClassName(videoName);
    if (video[0] && !video[0].classList.contains("active")) {
        video[0].classList.add("active");
        video[1].classList.add("active");
        video[0].play();
        video[1].play();
    }
    curVideo = videoName;
}

// Copyright cursor behavior
info.addEventListener("mouseleave", (e) => {
  copyright.classList.remove('active');
});

info.addEventListener("mouseenter", (e) => {
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
function selectPage(section) {
  const page = document.getElementById(section);
  const pageLink = document.getElementById(section + '-link');
  const pageText = document.getElementById(section + '-text');
  const pageGap = document.getElementById(section + '-gap');
  const currentPageLink = document.getElementsByClassName('current-page')[0];

  if (currentPageLink) {
    const currentSection = currentPageLink.id.slice(0, -5);
    const currentPage = document.getElementById(currentSection);
    const currentPageText = document.getElementById(currentSection + '-text');
    const currentPageGap = document.getElementById(currentSection + '-gap');
    if (currentPage) {
      currentPage.classList.toggle('inactive');
      currentPageLink.classList.toggle('current-page');
    }
    if (currentPageText) { currentPageText.classList.remove('active'); }
    if (currentPageGap) { currentPageGap.classList.remove('gap'); }
  }
  if (page) { page.classList.toggle('inactive'); }
  if (pageLink) { pageLink.classList.toggle('current-page'); }
  if (pageText) { pageText.classList.add('active'); }
  if (pageGap) { pageGap.classList.add('gap'); }

  if (section == 'index') {
    copyright.classList.remove('active');
    videoCredits.classList.add('active');
  } else if (section == 'info') {
    videoDot.classList.remove('active');
    videoCredits.classList.remove('active');
  } else {
    videoDot.classList.remove('active');
    copyright.classList.remove('active');
    videoCredits.classList.remove('active');
    if (section == 'production') {
      var flkty = Flickity.data(document.getElementById('production'));
      flkty.resize();
    }
  }
}

// Open page on click
for (let i = 0; i < pageLinks.length; i++) {
  const pageLink = pageLinks[i];
  pageLink.addEventListener('click', () => {
    const section = pageLink.id.slice(0, -5);
    selectPage(section);
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

function createCarousel() {
  var flkty = new Flickity( production, {
    // options
    cellAlign: 'center',
    wrapAround: true,
    pageDots: false,
    setGallerySize: false,
    cellSelector: '.product'
  });
  
  flkty.on( 'staticClick', function( event, pointer, cellElement, cellIndex ) {
    if ( !cellElement ) {
      openCloseProduct(openProduct, cellIndex);
      return;
    }
    openCloseProduct(cellElement, cellIndex);
  });
}

let openProduct = null;
let unclicked = true;

function openCloseProduct(cellElement, cellIndex) {
  var flkty = Flickity.data(production);
  if (openProduct) {
    openProduct.classList.remove("open");
    openProduct.querySelector('img').style.width =  '15vw';
  }
  if (cellElement !== openProduct) {
    cellElement.classList.add('open');
    const productImg = cellElement.querySelector('img');
    const w = productImg.naturalWidth;
    const h = productImg.naturalHeight;
    const heightRatio = 0.8 * window.innerHeight / h;
    const widthRatio = 0.8 * window.innerWidth / w;
    const scaleRatio = Math.min(heightRatio, widthRatio);
    productImg.style.width = (w * scaleRatio) + 'px';
  }
  flkty.reposition();
  if (cellIndex) {
    flkty.selectCell(cellIndex, true, false);
  }
  openProduct = cellElement.classList.contains('open') ? cellElement : null;
}

document.getElementById('production-link').addEventListener('click', () => {
  createCarousel();
  var flkty = Flickity.data(production);
  flkty.resize();
  document.querySelector('.flickity-slider').style.transform = 'translateX(0)';
});

document.getElementById("left-arrow-area").addEventListener('click', (e) => {
  var flkty = Flickity.data(production);
  if (openProduct) {
    let prevIndex = (flkty.selectedIndex - 1) % flkty.cells.length;
    let prevElement = flkty.cells[prevIndex].element;
    openCloseProduct(prevElement, prevIndex);
  } else {
    flkty.selectCell((flkty.selectedIndex - 5) % flkty.cells.length, true, false);
  }
});

document.getElementById("right-arrow-area").addEventListener('click', (e) => {
  var flkty = Flickity.data(production);
  if (openProduct) {
    let nextIndex = (flkty.selectedIndex + 1) % flkty.cells.length;
    let nextElement = flkty.cells[nextIndex].element;
    openCloseProduct(nextElement, nextIndex);
  } else {
    flkty.selectCell((flkty.selectedIndex + 5) % flkty.cells.length, true, false);
  }
});

// PITCHES -----------------------------------------------------------------------------------------------

const pitchList = document.querySelectorAll(".checkbox-container");
const pitchesToSend = document.querySelector("#pitches-to-send");
let checkedCount = 0;
const contactForm = document.querySelector("#contact-form");

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
            }
            console.log('-');
        } else {
            if (checkedCount < 5) {
                pitch.classList.add('checked');
                checkedCount++;
                pitchesToSend.innerHTML += 
                    '<div id=pitch' + i + ' class="checkbox-container checked">' +
                        '<span class="checkmark"></span>' +
                        '<p class="checkbox-label">' + pitchContent + '</p>' +
                    '</div>';
                if ( !contactForm.classList.contains('active') ) {
                    contactForm.classList.add('active');
                }

            }
        }
    });
}

// BROSWER RESIZE ----------------------------------------------------------------------------------------

function setMobile() {
  var flkty = Flickity.data(document.getElementById('production'));
  flkty.destroy();
}

window.addEventListener('resize', function(event) {
    if (window.innerWidth < mobileBreakpoint && !mobile) {
      mobile = true;
      setMobile();
    }
}, true);

// SCROLL -------------------

const options = {
  root: null, // default is the viewport
  rootMargin: "-50px",
  threshold: 0 // Trigger when 0% of the target element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log(entry.target.id);
      selectPage(entry.target.id);
    }
  });
}, options);

observer.observe(production);
observer.observe(serviceProviders);
observer.observe(pitches);
observer.observe(info);