// Cursor behavior
const products = document.getElementsByClassName('product');

for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(product);
    product.addEventListener("click", (e) => {
        if (product.classList.contains("open")) {
            product.classList.remove('open');
        } else {
            product.classList.add('open');
        }
    });
}