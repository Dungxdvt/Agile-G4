// Cart drawer functionality
document.addEventListener('DOMContentLoaded', function () {
    // Get cart drawer elements
    const cartDrawer = document.querySelector('#cartDrawer');
    const cartDrawerContent = cartDrawer.querySelector('.aside-content');
    const cartDrawerClose = cartDrawer.querySelector('.aside-close');

    // Open cart drawer when clicking on cart icon
    const cartIcons = document.querySelectorAll('.header-tools__cart');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.preventDefault();
            updateCartDrawer();
            cartDrawer.classList.add('active');
        });
    });

    // Close cart drawer when clicking on close button
    cartDrawerClose.addEventListener('click', function () {
        cartDrawer.classList.remove('active');
    });

    // Close cart drawer when clicking outside
    document.addEventListener('click', function (e) {
        if (cartDrawer.classList.contains('active') && !cartDrawer.contains(e.target) && !e.target.closest('.header-tools__cart')) {
            cartDrawer.classList.remove('active');
        }
    });

    // Update cart drawer content
    function updateCartDrawer() {
        // Get cart items from localStorage
        const cartData = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

        // Generate HTML for cart items
        let cartItemsHtml = '';
        if (cartData.items.length === 0) {
            cartItemsHtml = '<p class="text-center">Giỏ hàng trống</p>';
        } else {
            cartItemsHtml = cartData.items.map(item => `
                <div class="cart-drawer-item" data-product-id="${item.id}">
                    <div class="cart-drawer-item__img">
                        <img src="${item.image}" alt="${item.name}" />
                    </div>
                    <div class="cart-drawer-item__info">
                        <h6 class="cart-drawer-item__title">
                            <a href="#">${item.name}</a>
                        </h6>
                        ${item.color ? `<p class="cart-drawer-item__option text-secondary">Màu sắc: ${item.color}</p>` : ''}
                        ${item.size ? `<p class="cart-drawer-item__option text-secondary">Kích thước: ${item.size}</p>` : ''}
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="qty-control position-relative">
                                <input type="number" class="qty-control__number text-center quantity-input" value="${item.quantity}" min="1" data-product-id="${item.id}" />
                                <div class="qty-control__reduce" data-product-id="${item.id}">-</div>
                                <div class="qty-control__increase" data-product-id="${item.id}">+</div>
                            </div>
                            <div class="cart-drawer-item__price">
                                ${formatPrice(item.price * item.quantity)}đ
                            </div>
                            <button class="remove-item" data-product-id="${item.id}">×</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add subtotal
            cartItemsHtml += `
                <div class="cart-drawer__subtotal d-flex align-items-center justify-content-between mt-4">
                    <span>Tổng tiền:</span>
                    <span class="subtotal">${formatPrice(cartData.total)}đ</span>
                </div>
                <div class="cart-drawer__buttons mt-4">
                    <a href="shop_cart.html" class="btn btn-outline-primary w-100 mb-3">Xem giỏ hàng</a>
                    <a href="shop_checkout.html" class="btn btn-primary w-100">Thanh toán</a>
                </div>
            `;
        }

        // Update cart drawer content
        cartDrawerContent.innerHTML = cartItemsHtml;

        // Add event listeners for quantity controls
        const quantityInputs = cartDrawerContent.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', function () {
                const productId = this.dataset.productId;
                const quantity = parseInt(this.value);

                if (quantity > 0) {
                    cart.updateQuantity(productId, quantity);
                    updateCartDrawer();
                }
            });
        });

        // Add event listeners for quantity increase/decrease buttons
        const increaseButtons = cartDrawerContent.querySelectorAll('.qty-control__increase');
        const decreaseButtons = cartDrawerContent.querySelectorAll('.qty-control__reduce');

        increaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.dataset.productId;
                const input = this.parentElement.querySelector('.quantity-input');
                const currentQuantity = parseInt(input.value);
                const newQuantity = currentQuantity + 1;

                cart.updateQuantity(productId, newQuantity);
                updateCartDrawer();
            });
        });

        decreaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.dataset.productId;
                const input = this.parentElement.querySelector('.quantity-input');
                const currentQuantity = parseInt(input.value);
                const newQuantity = currentQuantity - 1;

                if (newQuantity > 0) {
                    cart.updateQuantity(productId, newQuantity);
                    updateCartDrawer();
                }
            });
        });

        // Add event listeners for remove buttons
        const removeButtons = cartDrawerContent.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.dataset.productId;
                cart.removeItem(productId);
                updateCartDrawer();
            });
        });

        // Update cart count
        updateCartCount();
    }

    // Format price with commas
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function updateCartCount() {
        const cartCount = document.querySelector(".js-cart-items-count");
        if (cartCount) {
            const cartData = JSON.parse(localStorage.getItem('cart')) || { items: [] };
            const totalItems = cartData.items.reduce((total, item) => total + (item.quantity || 0), 0);
            cartCount.textContent = totalItems;

            // Hiển thị/ẩn số lượng dựa vào tổng
            if (totalItems > 0) {
                cartCount.style.display = 'flex';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

    // Thêm dòng này
    updateCartCount();
}); 