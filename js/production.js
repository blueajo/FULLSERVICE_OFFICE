var elem = document.querySelector('.production');
var flkty;

window.onload = function() {
    flkty = new Flickity( elem, {
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

  document.querySelector('.flickity-slider').style.transform = 'translateX(0)';}

let openProduct = null;
let unclicked = true;

function openCloseProduct(cellElement, cellIndex) {
  if (openProduct) {
    openProduct.classList.remove("open");
    openProduct.querySelector('img').style.width =  '15vw';
    document.querySelector('#plusMinusDot img').src = "./img/cursors/plusDot.svg";
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
      document.querySelector('#plusMinusDot img').src = "./img/cursors/minusDot.svg";
  }
  flkty.reposition();
  if (cellIndex) {
    flkty.selectCell(cellIndex, true, false);
  }
  openProduct = cellElement.classList.contains('open') ? cellElement : null;
}

// document.querySelector(".leftArrowArea").addEventListener('click', (e) => {
//     if (openProduct) {
//         let prevIndex = (flkty.selectedIndex - 1) % flkty.cells.length;
//         let prevElement = flkty.cells[prevIndex].element;
//         openCloseProduct(prevElement, prevIndex);
//     } else {
//         flkty.selectCell(flkty.selectedIndex - 5, true, false);
//     }
// });

// document.querySelector(".rightArrowArea").addEventListener('click', (e) => {
//     if (openProduct) {
//         let nextIndex = (flkty.selectedIndex + 1) % flkty.cells.length;
//         let nextElement = flkty.cells[nextIndex].element;
//         openCloseProduct(nextElement, nextIndex);
//     } else {
//         flkty.selectCell(flkty.selectedIndex + 5, true, false);
//     }
// });

const products = document.getElementsByClassName('product');
for (let i = 0; i < products.length; i++) {
  const product = products[i];
  const productImg = product.querySelector('img');
  product.addEventListener('mouseenter', () => {
        if (product.classList.contains('open')) {
            document.querySelector('#plusMinusDot img').src = "./img/cursors/minusDot.svg";
        } else if (!product.classList.contains('open')) {
            document.querySelector('#plusMinusDot img').src = "./img/cursors/plusDot.svg";
        }
  });
}