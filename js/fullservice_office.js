document.body.onkeyup = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
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

// Cursor (areas) variations
const blackDotCursor = document.getElementsByClassName("blackDotCursor");
const noCursor = document.getElementsByClassName("noCursor");
const copyrightCursor = document.getElementsByClassName("copyrightCursor");

let lastCursor = document.getElementById("circleBlack");
let curCursor = document.getElementById("circleBlack");

// Cursor : Area Pairs
const cursorAreas = [
  ["circleBlack", blackDotCursor],
  ["", noCursor],
  ["copyright", copyrightCursor]
];

// for each type of cursor
for (let a = 0; a < cursorAreas.length; a++) {
  if (cursorAreas) {
    // for each cursor area of type 'cursorAreas[a]' on the page
  for (let i = 0; i < cursorAreas[a][1].length; i++) {
    // when mouse enters cursor area
    cursorAreas[a][1][i].addEventListener('mouseenter', () => {
      let newCursor = document.getElementById(cursorAreas[a][0]);
      // hide current cursor
      if (curCursor) { curCursor.classList.remove('active'); }
      lastCursor = curCursor;
      // show cursor
      curCursor = newCursor;
      if (curCursor) { curCursor.classList.add('active'); }
    });
    // when mouse leaves cursor area
    cursorAreas[a][1][i].addEventListener('mouseleave', () => {
      if (curCursor) { curCursor.classList.remove('active'); }
      if (lastCursor) { lastCursor.classList.add('active'); }
      curCursor = lastCursor;
      lastCursor = document.getElementById(cursorAreas[a][0]);
    });
  }
  }
}