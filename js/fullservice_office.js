document.body.onkeyup = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    document.documentElement.classList.toggle("show-grid");
    const items = document.querySelectorAll(".grid_area");
    for (const item of items) {
        if (item.style.cssText == "") {
            item.style.cssText = "outline: .25px dashed red";
        } else {
            item.style.cssText = "";
        }
    }
  }
}

// Cursor behavior
const cursor = document.getElementById('cursor');

// Cursor follows mouse
document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// Cursor disappears when mouse leaves page
window.addEventListener("mouseout", (e) => {
  if (!e.relatedTarget && !e.toElement) {
    cursor.classList.remove('active');
  }
});

// Cursor appears when mouse enters page
document.body.addEventListener('mouseenter', () => {
  cursor.classList.add('active');
});


let lastCursor = null;
let curCursor = null;

// Cursors
const cursors = ["dot", "noCursor", "copyright", "leftArrow", "rightArrow", "plusMinusDot"];

// for each type of cursor
for (let i = 0; i < cursors.length; i++) {
  const cursorAreas = document.getElementsByClassName(cursors[i] + "Area");
  if (cursorAreas) {
    // for all cursor areas of type [i] on the page
    for (let j = 0; j < cursorAreas.length; j++) {
      // add an eventlistener when mouse enters cursor area
      let newCursor = document.getElementById(cursors[i]);
      cursorAreas[j].addEventListener('mouseenter', () => {
        // hide current cursor
        if (curCursor) { curCursor.classList.remove('active'); }
        lastCursor = curCursor;
        // show cursor
        curCursor = newCursor;
        if (curCursor) { curCursor.classList.add('active'); }
      });
      
      // add an eventlistener when mouse leaves cursor area
      cursorAreas[j].addEventListener('mouseleave', () => {
        if (curCursor) { curCursor.classList.remove('active'); }
        // for cursor areas nested inside larger cursor areas
        if (lastCursor) { lastCursor.classList.add('active'); }
        curCursor = lastCursor;
        lastCursor = newCursor;
      });
    }
  }
}