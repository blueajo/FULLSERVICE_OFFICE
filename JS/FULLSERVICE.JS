document.body.onkeyup = function(e) {
  if (e.key == " " ||
      e.code == "Space" ||      
      e.keyCode == 32      
  ) {
    const items = document.querySelectorAll(".grid_area");
    for (const item of items) {
        if (item.style.cssText == '') {
            item.style.cssText = "outline: .25px dashed red";
        } else {
            item.style.cssText = "";
        }
    }
  }
}