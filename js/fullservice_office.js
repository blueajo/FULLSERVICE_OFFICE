document.body.onkeyup = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    document.documentElement.classList.toggle("show-grid");
    const items = document.querySelectorAll(".grid-area");
    for (const item of items) {
        if (item.style.cssText == "") {
            item.style.cssText = "outline: .25px dashed red";
        } else {
            item.style.cssText = "";
        }
    }
  }
}

// CUSTOM CURSOR --------------------------------------------------------------------------------
const cursor = document.getElementById('cursor');
let cursorOn = true;

// Cursor follows mouse
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Cursor disappears when mouse leaves page
window.addEventListener("mouseout", (e) => {
  if (cursorOn && !e.relatedTarget && !e.toElement) {
    cursor.classList.remove('active');
  }
});

// Cursor appears when mouse enters page
document.body.addEventListener('mouseenter', () => {
  if (cursorOn) {
    cursor.classList.add('active');
  }
});

const links = document.querySelectorAll('a');
for (let i = 0; i < links.length; i++) {
  const link = links[i];
  link.addEventListener('mouseenter', () => {
    cursor.classList.remove('active');
  });
  link.addEventListener('mouseout', () => {
    cursor.classList.add('active');
  });
}


// NAV -----------------------------------------------------------------------------------------

let activePage = document.getElementById("index");
const pageLinks = document.querySelectorAll(".page-link");
for (let i = 0; i < pageLinks.length; i++) {
  const pageLink = pageLinks[i];
  pageLink.addEventListener('click', () => {
    const section = pageLink.id.slice(0, -5);
    const page = document.getElementById(section);

    activePage.classList.add('inactive');
    page.classList.remove('inactive');

    document.querySelector('.current-page').classList.remove('current-page');
    pageLink.classList.add('current-page');

    if (section == 'index') {
      cursorOn = true;
      document.body.classList.add('sp-cursor');
      cursor.classList.add('active');
      document.getElementById('video-dot').classList.add('active');
      document.getElementById('copyright').classList.remove('active');
      document.getElementById('video-credits').classList.add('active');
    } else if (section == 'info') {
      cursorOn = true;
      document.body.classList.add('sp-cursor');
      cursor.classList.add('active');
      document.getElementById('copyright').classList.add('active');
      document.getElementById('video-dot').classList.remove('active');
      document.getElementById('video-credits').classList.remove('active');
    } else {
      cursorOn = false;
      document.getElementById('video-dot').classList.remove('active');
      document.getElementById('copyright').classList.remove('active');
      document.body.classList.remove('sp-cursor');
      cursor.classList.remove('active');
      document.getElementById('video-credits').classList.remove('active');
      if (section == 'production') {
        var flkty = Flickity.data(elem);
        flkty.resize();
      }
    }

    activePage = page;
  });
}
