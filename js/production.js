// Cursor behavior
const products = document.getElementsByClassName('product');

var elem = document.querySelector('.products');
var flkty = new Flickity( elem, {
  // options
  cellAlign: 'left',
  wrapAround: true,
  pageDots: false,
  setGallerySize: false,
  cellSelector: '.product',
  groupCells: '80%'
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
    var cellIndex = product && elem.cells.indexOf( product );
    console.log(cellIndex);
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