var elem = document.querySelector('.products');
var flkty = new Flickity( elem, {
  // options
  cellAlign: 'left',
  wrapAround: true,
  pageDots: false,
  setGallerySize: false,
  cellSelector: '.product'
});

let openProduct = null;

function openCloseProduct(cellElement, cellIndex) {
      if (flkty.options.groupCells) {
        flkty.destroy();
        flkty = new Flickity( elem, {
        // options
        cellAlign: 'left',
        wrapAround: true,
        pageDots: false,
        setGallerySize: false,
        cellSelector: '.product',
        groupCells: false
        //   draggable: false
        });
    }
  if (openProduct) {
    openProduct.classList.remove("open");
  }
  if (cellElement !== openProduct) {
      cellElement.classList.add('open');
  }
  flkty.reposition();
  flkty.selectCell(cellIndex, true, false);
  openProduct = cellElement.classList.contains('open') ? cellElement : null;
}

flkty.on( 'staticClick', function( event, pointer, cellElement, cellIndex ) {
  if ( !cellElement ) {
    return;
  }
  openCloseProduct(cellElement, cellIndex);
});

document.querySelector(".leftArrowArea").addEventListener('click', (e) => {
    if (openProduct) {
        let prevIndex = (flkty.selectedIndex - 1) % flkty.cells.length;
        let prevElement = flkty.cells[prevIndex].element;
        openCloseProduct(prevElement, prevIndex);
    } else {
        flkty.selectCell(flkty.selectedIndex - 5, true, false);
    }
});

document.querySelector(".rightArrowArea").addEventListener('click', (e) => {
    if (openProduct) {
        let nextIndex = (flkty.selectedIndex + 1) % flkty.cells.length;
        let nextElement = flkty.cells[nextIndex].element;
        openCloseProduct(nextElement, nextIndex);
    } else {
        flkty.selectCell(flkty.selectedIndex + 5, true, false);
    }
});