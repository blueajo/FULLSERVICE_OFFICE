// START UP -------------------------------------------------------------------------------------
let mobile = false;

// Load page on start
document.addEventListener("DOMContentLoaded", (event) => {
  if (screen.width <= 768) {
    mobile = true;
    openPage('index');
    if (location.hash) {
      history.pushState("", document.title, window.location.pathname);
    }
  } else {
    if (location.hash) {
      openPage(location.hash.substring(1));
    } else {
      openPage('index');
    }
  }
});

// window.onload = function() {
//   if (screen.width <= 768) {
//     mobile = true;
//     openPage('index');
//     if (location.hash) {
//       history.pushState("", document.title, window.location.pathname);
//     }
//   } else {
//     if (location.hash) {
//       openPage(location.hash.substring(1));
//     } else {
//       openPage('index');
//     }
//   }
//   const video = document.getElementById('mobile-video');
//   video.play();
// }

// BASELINE GRID --------------------------------------------------------------------------------

document.body.onkeyup = function(e) {
  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    document.documentElement.classList.toggle("show-grid");
  }
};

// GLOBAL VARIABLES -----------------------------------------------------------------------------

const index = document.getElementById('index-page');
const production = document.getElementById('production-page');
const serviceProviders = document.getElementById('service-providers-page');
const pitches = document.getElementById('pitches-page');
const info = document.getElementById('info-page');
const rootFontSize = 16;
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
let cursorFollowerInterval = null;

// Info cursor objects
const copyright = document.getElementById('copyright');
const infoLinks = document.querySelectorAll('#info-page a');

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

function indexFollow() {
  cursorFollower.draggyUpdate();
  const videoNumber = Math.floor(cursorFollower.x /(window.innerWidth/10)) % 5;
  const yQuadrant = (cursorFollower.y / window.innerHeight) > .5 ? 1 : 0;
  const xQuadrant = (cursorFollower.x / window.innerWidth) > .5 ? 1 : 0;
  const category = quadrants[yQuadrant][xQuadrant];
  const video = category + '-' + videoNumber + '-video';
  
  if (curVideo != video) {
    hideVideo(curVideo);
    startVideo(video);
  }
}

function infoFollow() {
  cursorFollower.update();
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
function closePage() {
  const section = location.hash ? location.hash.substring(1) : 'index';
  const currentPageLink = document.getElementById(section + '-link');
  const currentPage = document.getElementById(section + '-page');
  const currentPageText = document.getElementById(section + '-text');
  const currentPageGap = document.getElementById(section + '-gap');
  if (currentPage) { currentPage.classList.toggle('inactive'); }
  if (currentPageLink) { currentPageLink.classList.toggle('current-page'); }
  if (currentPageText) { currentPageText.classList.remove('active'); }
  if (currentPageGap) { currentPageGap.classList.remove('gap'); }
  if (cursorFollowerInterval) {
    clearInterval(cursorFollowerInterval);
    cursorFollowerInterval = null;
  }
  if (section == 'index') {
    videoDot.classList.remove('active');
    videoCredits.classList.remove('active');
  } else if (section == 'production') {
    var flkty = Flickity.data(production);
    if (flkty) {
      flkty.destroy();
    }
  } else if (section == 'info') {
    copyright.classList.remove('active');
  }
}

function openPage(section) {
  const page = document.getElementById(section + '-page');
  const pageLink = document.getElementById(section + '-link');
  const pageText = document.getElementById(section + '-text');
  const pageGap = document.getElementById(section + '-gap');
  if (page) { page.classList.toggle('inactive'); }
  if (pageLink) { pageLink.classList.toggle('current-page'); }
  if (pageText) { pageText.classList.add('active'); }
  if (pageGap) { pageGap.classList.add('gap'); }
  // page-specific
  if (section == 'index') {
    videoCredits.classList.add('active');
    if (!mobile) {
      cursorFollowerInterval = setInterval(indexFollow,1000/60);
    }
  }
  if (section == 'info' && !mobile) {
    cursorFollowerInterval = setInterval(infoFollow,1000/60);
  }
  if (section == 'production' && !mobile) {
    createCarousel();
    document.querySelector('.flickity-slider').style.transform = 'translateX(0)';
  }

  // set anchor link
  if (section == 'index') {
    history.pushState("", document.title, window.location.pathname);
  } else {
    location.hash = section;
  }
}

// Open page on click
for (let i = 0; i < pageLinks.length; i++) {
  const pageLink = pageLinks[i];
  pageLink.addEventListener('click', () => {
    const section = pageLink.id.slice(0, -5);
    closePage();
    openPage(section);
    if (mobile) {
      scrollAnimations = false;
      setTimeout(scrollAnimationOn, 1500);
      document.getElementById(section + '-page').scrollIntoView({
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
    console.log(cellElement);
    console.log(cellIndex);
    openCloseProduct(cellElement, cellIndex);
  });
}

let openProduct = null;
let unclicked = true;

function openCloseProduct(cellElement, cellIndex) {
  var flkty = Flickity.data(production);
  if (openProduct) {
    openProduct.classList.remove("open");
    openProduct.querySelector('img').style.width = '15vw';
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
  flkty.selectCell(cellIndex, true, false);
  openProduct = cellElement.classList.contains('open') ? cellElement : null;
}

document.getElementById("left-arrow-area").addEventListener('click', (e) => {
  var flkty = Flickity.data(production);
  if (openProduct) {
    let prevIndex = (flkty.selectedIndex - 1) % flkty.cells.length;
    prevIndex = prevIndex < 0 ? flkty.cells.length - 1 : prevIndex;
    let prevElement = flkty.cells[prevIndex].element;
    openCloseProduct(prevElement, prevIndex);
  } else {
    let selectedIndex = ((flkty.selectedIndex - 5) % flkty.cells.length);
    selectedIndex = selectedIndex < 0 ? flkty.cells.length + selectedIndex : selectedIndex;
    flkty.selectCell(selectedIndex, true, false);
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

// SCROLL -------------------

// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();

//         document.querySelector(this.getAttribute('href') + '-page').scrollIntoView({
//             behavior: 'smooth'
//         });
//     });
// });

let scrollAnimations = false;
setTimeout(scrollAnimationOn, 1000);

function scrollAnimationOn() {
  scrollAnimations = true;
}

const options = {
  root: null, // default is the viewport
  rootMargin: "-10% 0px -89.5% 0px",
  threshold: 0 // Trigger when 0% of the target element is visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (mobile && scrollAnimations) {
      closePage();
      openPage(entry.target.id.slice(0, -5));
    }
  });
}, options);

observer.observe(index);
observer.observe(production);
observer.observe(serviceProviders);
observer.observe(pitches);
observer.observe(info);

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
    if (mobile && scrollAnimations) {
      const indexText = document.getElementById('index-text');
      indexText.style.opacity = entry.intersectionRatio;
    }
  });
}, options2);

observer2.observe(document.getElementById('mobile-video'));