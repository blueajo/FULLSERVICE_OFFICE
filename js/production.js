var elem = document.getElementById('production');

window.onload = function() {
    var flkty = new Flickity( elem, {
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
  var flkty = Flickity.data(elem);
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
  var flkty = Flickity.data(elem);
  flkty.resize();
  document.querySelector('.flickity-slider').style.transform = 'translateX(0)';
});

document.getElementById("left-arrow-area").addEventListener('click', (e) => {
  var flkty = Flickity.data(elem);
  if (openProduct) {
    let prevIndex = (flkty.selectedIndex - 1) % flkty.cells.length;
    let prevElement = flkty.cells[prevIndex].element;
    openCloseProduct(prevElement, prevIndex);
  } else {
    flkty.selectCell((flkty.selectedIndex - 5) % flkty.cells.length, true, false);
  }
});

document.getElementById("right-arrow-area").addEventListener('click', (e) => {
  var flkty = Flickity.data(elem);
  if (openProduct) {
    let nextIndex = (flkty.selectedIndex + 1) % flkty.cells.length;
    let nextElement = flkty.cells[nextIndex].element;
    openCloseProduct(nextElement, nextIndex);
  } else {
    flkty.selectCell((flkty.selectedIndex + 5) % flkty.cells.length, true, false);
  }
});