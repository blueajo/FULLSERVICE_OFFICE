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
const rootFontSize = 10;

function remToPx(remValue) {
  return remValue * rootFontSize;
}

// CUSTOM CURSORS -------------------------------------------------------------------------------

// Index cursor objects
const videoDot = document.getElementById('index-cursor');
const allVideos = videoDot.querySelectorAll("video");
let curVideo = null;
let activeLink = null;
const quadrants = [['production', 'service-providers'],
                   ['pitches', 'info']];
let cursorInterval = null;
// Cursor object
var mouseX=window.innerWidth/2,
    mouseY=window.innerHeight/2;
var videoXOffset = (mouseX / window.innerWidth) > .5 ? remToPx(45) : 0;
var videoYOffset = (mouseY / window.innerHeight) > .5 ? remToPx(45) : 0;;

var indexCursor = { 
    el: document.getElementById('index-cursor'),
    x: window.innerWidth/2, 
    y: window.innerHeight/2,
    update: function() {
              const xOffset = (this.x / window.innerWidth) > .5 ? remToPx(45) : 0;
              const yOffset = (this.y / window.innerHeight) > .5 ? remToPx(45) : 0;
              videoXOffset = lerp (videoXOffset, xOffset, 0.075);
              videoYOffset = lerp (videoYOffset, yOffset, 0.075);
              this.x = lerp (this.x, mouseX, 0.05);
              this.y = lerp (this.y, mouseY, 0.05);
              this.el.style = 'transform: translate3d('+ (this.x - videoXOffset) +'px,'+ (this.y - videoYOffset) +'px, 0);'
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
  const videoNumber = Math.floor(indexCursor.x / (window.innerWidth/16)) % 8;
  const yQuadrant = (indexCursor.y / window.innerHeight) > .5 ? 1 : 0;
  const xQuadrant = (indexCursor.x / window.innerWidth) > .5 ? 1 : 0;
  const category = quadrants[yQuadrant][xQuadrant];
  const video = category + '-' + videoNumber + '-video';
  
  if (curVideo != video) {
    hideVideo(curVideo);
    startVideo(video);
  }
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

function hideVideo(videoName) {
    const video = document.getElementById(videoName);
    if (video && video.classList.contains("active")) {
        video.classList.remove("active");
        video.pause();
    }
}

function startVideo(videoName) {
    const video = document.getElementById(videoName);
    if (video && !video.classList.contains("active")) {
        video.classList.add("active");
        video.play();
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
  const section = location.hash ? location.hash.substring(1) : 'index';
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
    var flkty = Flickity.data(production);
    if (flkty) {
      closeOpenProduct();
      flkty.destroy();
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
    createCarousel();
  }

  // set anchor link
  if (section == 'index') {
    history.pushState("", document.title, window.location.pathname);
  } else {
    location.hash = section;
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
    accessibility: true,
    prevNextButtons: false,
    cellSelector: '.product'
  });

  document.querySelector('.flickity-slider').style.transform = 'translateX(0%)';

  // cellElement Element If a cell was clicked, the element.
  // cellIndex Integer If a cell was clicked, the cell’s zero-based number.
  flkty.on( 'staticClick', function( event, pointer, cellElement, cellIndex ) {
    if ( !cellElement ) {
      return;
    }

    // if the product is open, close it; if not, open it
    if (cellElement == currOpenProduct) {
      closeOpenProduct();
      return;
    } else {
      openProduct(cellElement, cellIndex);
    }
  });
}

let currOpenProduct = null;
let unclicked = true;

// Closes the currently open product if there is one
function closeOpenProduct() {
  if (currOpenProduct) {
    var flkty = Flickity.data(production);

    currOpenProduct.classList.remove("open");
    let productImg = currOpenProduct.querySelector('img');
    if (!productImg) {
      productImg = currOpenProduct.querySelector('video');
      productImg.pause();
    }
    productImg.style.width = '15vw';

    // reposition flkty to center the opened and scaled product
    flkty.reposition();

    currOpenProduct = null;
    document.getElementById("left-arrow-area").classList.remove('expanded');
    document.getElementById("right-arrow-area").classList.remove('expanded');

    flkty.options.dragThreshold = 3;
    flkty.updateDraggable();
  }
}

// Opens a product
// cellElement | Element | The product to open.
// cellIndex | Integer | The product to open’s zero-based index.
function openProduct(cellElement, cellIndex) {
  var flkty = Flickity.data(production);

  // if the product is not already open
  if (currOpenProduct != cellElement) {
    closeOpenProduct();
    // open the clicked product
    cellElement.classList.add('open');
    // scale the image
    let productImg = cellElement.querySelector('img');
    let w = 0;
    let h = 0;
    if (!productImg) {
      productImg = cellElement.querySelector('video');
      w = productImg.videoWidth;
      h = productImg.videoHeight;
      productImg.play();
    } else {
      w = productImg.naturalWidth;
      h = productImg.naturalHeight;
    }
    const heightRatio = 0.8 * window.innerHeight / h;
    const widthRatio = 0.8 * window.innerWidth / w;
    const scaleRatio = Math.min(heightRatio, widthRatio);
    productImg.style.width = (w * scaleRatio) + 'px';
    // reposition flkty to center the opened and scaled product
    flkty.reposition();
    flkty.selectCell(cellIndex, true, false);
    currOpenProduct = cellElement;

    flkty.options.dragThreshold = 10000;
    flkty.updateDraggable();

    document.getElementById("left-arrow-area").classList.add('expanded');
    document.getElementById("right-arrow-area").classList.add('expanded');
  }
}

document.getElementById("left-arrow-area").addEventListener('click', (e) => {
  var flkty = Flickity.data(production);
  if (currOpenProduct) {
    let prevIndex = (flkty.selectedIndex - 1) % flkty.cells.length;
    prevIndex = prevIndex < 0 ? flkty.cells.length - 1 : prevIndex;
    let prevElement = flkty.cells[prevIndex].element;
    openProduct(prevElement, prevIndex);
    // temporarily pause cursor events for flkty on left/right arrow press until mouse is moved
    document.querySelector(".flickity-viewport").style.zIndex = "-1";
    production.addEventListener('mousemove', function(event) {
      document.querySelector(".flickity-viewport").style.zIndex = "1";
    }, { once: true });
  } else {
    let selectedIndex = ((flkty.selectedIndex - 5) % flkty.cells.length);
    selectedIndex = selectedIndex < 0 ? flkty.cells.length + selectedIndex : selectedIndex;
    flkty.selectCell(selectedIndex, true, false);
  }
});

document.getElementById("right-arrow-area").addEventListener('click', (e) => {
  var flkty = Flickity.data(production);
  if (currOpenProduct) {
    let nextIndex = (flkty.selectedIndex + 1) % flkty.cells.length;
    let nextElement = flkty.cells[nextIndex].element;
    openProduct(nextElement, nextIndex);
    // temporarily pause cursor events for flkty on left/right arrow press until mouse is moved
    document.querySelector(".flickity-viewport").style.zIndex = "-1";
    production.addEventListener('mousemove', function(event) {
      document.querySelector(".flickity-viewport").style.zIndex = "1";
    }, { once: true });
  } else {
    flkty.selectCell((flkty.selectedIndex + 5) % flkty.cells.length, true, false);
  }
});

document.getElementById("center-area").addEventListener('click', (e) => {
  closeOpenProduct();
});

// SERVICE PROVIDERS --------------------------------------------------------------------------------

const serviceProviderLinks = document.querySelectorAll(".service-provider-link");
const serviceProviderPortraits = document.querySelectorAll(".portrait");

for (let i = 0; i < serviceProviderLinks.length; i++) {
  serviceProviderLinks[i].addEventListener('mouseenter', () => {
    serviceProviderPortraits[i].classList.add('visible');
  });
  serviceProviderLinks[i].addEventListener('mouseleave', () => {
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
    if (mobile) {
      const indexText = document.getElementById('index-text');
      indexText.style.opacity = entry.intersectionRatio;
    }
  });
}, options2);

observer2.observe(document.getElementById('mobile-video'));