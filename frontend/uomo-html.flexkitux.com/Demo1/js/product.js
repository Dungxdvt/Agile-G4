// Product page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Add to cart button click handler
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get product details from the button's data attributes
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice);
            const productImage = this.dataset.productImage;

            // Get selected color and size if available
            let color = '';
            let size = '';

            const colorInputs = document.querySelectorAll('input[name="color"]');
            colorInputs.forEach(input => {
                if (input.checked) {
                    color = input.value;
                }
            });

            const sizeInputs = document.querySelectorAll('input[name="size"]');
            sizeInputs.forEach(input => {
                if (input.checked) {
                    size = input.value;
                }
            });

            // Get quantity
            const quantityInput = document.querySelector('input[name="quantity"]');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                color: color,
                size: size,
                quantity: quantity
            };

            // Add to cart
            cart.addItem(product);

            // Show success message
            alert('Sản phẩm đã được thêm vào giỏ hàng!');

            // Open cart drawer
            const cartDrawer = document.querySelector('#cartDrawer');
            cartDrawer.classList.add('active');
        });
    });

    // Quantity input handler
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function () {
            const productId = this.dataset.productId;
            const quantity = parseInt(this.value);

            if (quantity > 0) {
                cart.updateQuantity(productId, quantity);
            }
        });
    });
}); 