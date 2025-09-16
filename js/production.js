// Cursor behavior
const products = Array.from(document.getElementsByClassName('product'));

var elem = document.querySelector('.products');
var flkty = new Flickity( elem, {
  // options
  cellAlign: 'left',
  wrapAround: true,
  pageDots: false,
  setGallerySize: false,
  cellSelector: '.product',
  groupCells: true
//   draggable: false
});

let mouseX = 0;
let mouseY = 0;
let openProduct = null;

elem.addEventListener('click', (e) => {
    console.log(e);
    let product = e.target.parentNode;
    if (product.classList.contains("open")) {
        product.classList.remove('open');
        openProduct = null;
    } else {
        if (openProduct) { openProduct.classList.remove("open"); }
        product.classList.add('open');
        openProduct = product;
    }
    // Flickity resize
    flkty.resize();
    var cellIndex = products.indexOf( product );
    const viewportWidth = window.innerWidth;
    const mouseX = e.clientX; // Mouse's X-coordinate relative to the viewport

    if (mouseX < viewportWidth / 2) {
    console.log('Mouse is on the left side of the viewport.');
    } else {
    cellAlign: 'right'
    }

    flkty.selectCell( cellIndex, true, false );
    });



document.querySelector(".leftArrowArea").addEventListener('click', (e) => {
    if (openProduct) { openProduct.classList.remove("open"); }
    flkty.resize();
    document.querySelector(".previous").click();
});

document.querySelector(".rightArrowArea").addEventListener('click', (e) => {
    if (openProduct) { openProduct.classList.remove("open"); }
    flkty.resize();
    document.querySelector(".next").click();
});