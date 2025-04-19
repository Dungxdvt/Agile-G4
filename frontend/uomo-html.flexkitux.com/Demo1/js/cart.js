// Lưu trữ giỏ hàng trong localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Ẩn tất cả các nút Add to Cart
document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".pc__atc");
  addToCartButtons.forEach((button) => {
    button.style.display = "none";
    button.style.visibility = "hidden";
    button.style.opacity = "0";
  });
});

// Hàm xóa toàn bộ giỏ hàng
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  displayCartItems();
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(product) {
  try {
    console.log("Thêm sản phẩm vào giỏ hàng:", product);

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProduct = cart.find(
      (item) =>
        item.id === product.id &&
        item.color === product.color &&
        item.size === product.size
    );

    if (existingProduct) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng
      existingProduct.quantity += product.quantity;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      cart.push(product);
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartCount();

    // Hiển thị thông báo thành công
    showNotification("Đã thêm sản phẩm vào giỏ hàng!", "success");

    // Hiển thị lại giỏ hàng
    displayCartItems();

    // Mở giỏ hàng sau khi thêm sản phẩm
    const cartDrawer = document.getElementById("cartDrawer");
    if (cartDrawer) {
      cartDrawer.classList.add("aside--active");
      document.body.classList.add("overflow-hidden");
    }

    console.log("Giỏ hàng hiện tại:", cart);
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    showNotification("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng", "error");
  }
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
  const cartCount = document.querySelector(".js-cart-items-count");
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  displayCartItems(); // Hiển thị lại giỏ hàng
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;

  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    cart[index].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Cập nhật hiển thị giỏ hàng
    updateCartCount();
    displayCartItems();

    // Hiển thị thông báo
    showNotification("Đã cập nhật số lượng sản phẩm!", "success");
  }
}

// Hàm hiển thị thông báo
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const content = document.createElement("div");
  content.className = "notification-content";

  const icon = document.createElement("i");
  icon.className = `fas ${
    type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
  } notification-icon`;

  const messageSpan = document.createElement("span");
  messageSpan.className = "notification-message";
  messageSpan.textContent = message;

  const progress = document.createElement("div");
  progress.className = "notification-progress";

  const progressBar = document.createElement("div");
  progressBar.className = "notification-progress-bar";

  content.appendChild(icon);
  content.appendChild(messageSpan);
  progress.appendChild(progressBar);

  notification.appendChild(content);
  notification.appendChild(progress);

  document.body.appendChild(notification);

  // Bắt đầu animation cho thanh tiến trình
  setTimeout(() => {
    progressBar.style.width = "100%";
  }, 10);

  // Tự động xóa thông báo sau 3 giây
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-in";
    notification.style.animationFillMode = "forwards";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Hàm hiển thị sản phẩm trong giỏ hàng
function displayCartItems() {
  const cartDrawer = document.getElementById("cartDrawer");
  if (!cartDrawer) {
    console.error("Không tìm thấy phần tử giỏ hàng");
    return;
  }

  const cartItemsList = cartDrawer.querySelector(".cart-drawer-items-list");
  if (!cartItemsList) {
    console.error("Không tìm thấy danh sách sản phẩm trong giỏ hàng");
    return;
  }

  // Xóa tất cả sản phẩm hiện có trong giỏ hàng
  cartItemsList.innerHTML = "";

  if (cart.length === 0) {
    cartItemsList.innerHTML =
      '<div class="text-center py-5"><p>Giỏ hàng trống</p></div>';

    // Cập nhật tổng tiền = 0 khi giỏ hàng trống
    const subtotalElement = cartDrawer.querySelector(
      ".cart-drawer-subtotal__price"
    );
    if (subtotalElement) {
      subtotalElement.textContent = "$0.00";
    }
    return;
  }

  // Hiển thị từng sản phẩm trong giỏ hàng
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-drawer-item d-flex position-relative";
    cartItem.setAttribute("data-product-id", item.id);
    cartItem.innerHTML = `
      <div class="position-relative">
        <a href="product1_simple.html">
          <img loading="lazy" class="cart-drawer-item__img" src="${item.image}" alt="${item.name}">
        </a>
      </div>
      <div class="cart-drawer-item__info flex-grow-1">
        <h6 class="cart-drawer-item__title fw-normal">
          <a href="product1_simple.html">${item.name}</a>
        </h6>
        <p class="cart-drawer-item__option text-secondary">Màu sắc: ${item.color}</p>
        <p class="cart-drawer-item__option text-secondary">Kích cỡ: ${item.size}</p>
        <div class="d-flex align-items-center justify-content-between mt-1">
          <div class="qty-control position-relative">
            <input type="number" name="quantity" value="${item.quantity}" min="1" class="qty-control__number border-0 text-center">
            <div class="qty-control__reduce text-start">-</div>
            <div class="qty-control__increase text-end">+</div>
          </div>
          <span class="cart-drawer-item__price money price">${item.price}</span>
        </div>
      </div>
      <button type="button" class="btn-close-xs position-absolute top-0 end-0 js-cart-item-remove" data-product-id="${item.id}"></button>
    `;
    cartItemsList.appendChild(cartItem);
  });

  // Cập nhật tổng tiền
  updateCartSubtotal(cartDrawer);

  // Thêm sự kiện cho các nút trong giỏ hàng
  addCartItemEventListeners();
}

// Hàm cập nhật tổng tiền
function updateCartSubtotal(cartDrawer) {
  if (!cartDrawer) {
    cartDrawer = document.getElementById("cartDrawer");
  }
  if (!cartDrawer) return;

  // Tính tổng tiền
  let subtotal = 0;
  cart.forEach((item) => {
    let price = item.price;

    // Đảm bảo giá là số
    if (typeof price === "string") {
      // Loại bỏ tất cả các ký tự không phải số và dấu chấm
      price = price.replace(/[^\d.]/g, "");
      // Loại bỏ dấu chấm ngăn cách hàng nghìn
      price = price.replace(/\./g, "");
    }
    const numericPrice = parseFloat(price) || 0;
    const itemTotal = numericPrice * item.quantity;
    subtotal += itemTotal;
  });

  // Kiểm tra xem đang ở trang index hay không
  const isIndexPage = window.location.pathname.includes("index.html");

  // Cập nhật tổng tiền
  const subtotalElement = cartDrawer.querySelector(
    ".cart-drawer-subtotal__price"
  );
  if (subtotalElement) {
    if (isIndexPage) {
      // Hiển thị tổng tiền VND trên trang index
      const formattedSubtotalVND = `${subtotal.toLocaleString()}đ`;
      subtotalElement.textContent = formattedSubtotalVND;
    } else {
      // Hiển thị tổng tiền USD trên các trang khác
      const subtotalUSD = subtotal / 23000; // Giả sử tỷ giá 1 USD = 23000 VND
      subtotalElement.textContent = `$${subtotalUSD.toFixed(2)}`;
    }
  }

  // Cập nhật tổng tiền VND (nếu có)
  const cartSubtotalElement = cartDrawer.querySelector(".cart-subtotal");
  if (cartSubtotalElement) {
    const formattedSubtotalVND = `${subtotal.toLocaleString()}đ`;
    cartSubtotalElement.textContent = formattedSubtotalVND;
  }

  console.log("Tổng tiền VND:", subtotal);
  console.log("Tổng tiền USD:", subtotal / 23000);
}

// Hàm thêm sự kiện cho các nút trong giỏ hàng
function addCartItemEventListeners() {
  // Xử lý sự kiện xóa sản phẩm
  const removeButtons = document.querySelectorAll(".js-cart-item-remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      removeFromCart(productId);
    });
  });

  // Xử lý sự kiện cập nhật số lượng
  const quantityInputs = document.querySelectorAll(".qty-control__number");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const productId =
        this.closest(".cart-drawer-item").getAttribute("data-product-id");
      const newQuantity = parseInt(this.value);
      updateQuantity(productId, newQuantity);
    });
  });

  // Xử lý sự kiện tăng/giảm số lượng
  const reduceButtons = document.querySelectorAll(".qty-control__reduce");
  const increaseButtons = document.querySelectorAll(".qty-control__increase");

  reduceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.nextElementSibling;
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
        const productId =
          this.closest(".cart-drawer-item").getAttribute("data-product-id");
        updateQuantity(productId, currentValue - 1);
      }
    });
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const currentValue = parseInt(input.value);
      input.value = currentValue + 1;
      const productId =
        this.closest(".cart-drawer-item").getAttribute("data-product-id");
      updateQuantity(productId, currentValue + 1);
    });
  });
}

// Thêm event listener cho nút mở giỏ hàng
document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo giỏ hàng
  updateCartCount();
  displayCartItems();

  // Xử lý sự kiện mở giỏ hàng
  const cartButtons = document.querySelectorAll(
    '.js-open-aside[data-aside="cartDrawer"]'
  );
  const cartDrawer = document.getElementById("cartDrawer");

  cartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      if (cartDrawer) {
        cartDrawer.classList.add("aside--active");
        document.body.classList.add("overflow-hidden");
        displayCartItems(); // Cập nhật nội dung giỏ hàng khi mở
      } else {
        console.error("Không tìm thấy phần tử giỏ hàng");
      }
    });
  });

  // Xử lý sự kiện đóng giỏ hàng
  const closeButtons = document.querySelectorAll(".js-close-aside");
  closeButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const aside = this.closest(".aside");
      if (aside) {
        aside.classList.remove("aside--active");
        document.body.classList.remove("overflow-hidden");
      }
    });
  });

  // Xử lý sự kiện click ra ngoài để đóng giỏ hàng
  document.addEventListener("click", function (e) {
    if (cartDrawer && cartDrawer.classList.contains("aside--active")) {
      if (
        !cartDrawer.contains(e.target) &&
        !e.target.closest(".js-open-aside")
      ) {
        cartDrawer.classList.remove("aside--active");
        document.body.classList.remove("overflow-hidden");
      }
    }
  });

  // Thêm sự kiện cho nút Add to Cart
  const addToCartButtons = document.querySelectorAll(
    ".btn-addtocart, .pc__atc"
  );
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Tìm phần tử cha chứa thông tin sản phẩm
      const productCard = this.closest(".product-card") || this.closest("form");
      if (!productCard) {
        console.error("Không tìm thấy thông tin sản phẩm");
        return;
      }

      // Lấy thông tin sản phẩm
      let productName = "";
      let productImage = "";
      let productPrice = "";

      // Nếu là trang chi tiết sản phẩm
      const productTitle = document.querySelector(".product-single__name");
      if (productTitle) {
        productName = productTitle.textContent.trim();
        productImage =
          document.querySelector(".product-single__image img")?.src || "";

        // Lấy giá sản phẩm từ trang chi tiết (chỉ lấy số)
        const priceElement = document.querySelector(
          ".product-single__price .current-price"
        );
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          const priceMatch = priceText.match(/(\d+(\.\d+)*)/); // Trích xuất số, bỏ qua dấu chấm ngăn cách hàng nghìn
          productPrice = priceMatch ? priceMatch[0].replace(/\./g, "") : "0"; // Bỏ dấu chấm
        } else {
          productPrice = "0"; // Giá mặc định nếu không tìm thấy
        }
      }
      // Nếu là trang danh sách sản phẩm
      else {
        const imgElement = productCard.querySelector(".pc__img");
        productName =
          imgElement?.getAttribute("alt") || "Sản phẩm không có tên";
        productImage = imgElement?.src || "";

        // Lấy giá sản phẩm từ trang danh sách
        const priceElement = productCard.querySelector(".price");
        if (priceElement) {
          const priceText = priceElement.textContent.trim();
          const priceMatch = priceText.match(/(\d+(\.\d+)?)/);
          productPrice = priceMatch ? priceMatch[0].replace(/\./g, "") : "0";
        } else {
          productPrice = "0";
        }
      }

      console.log("Tên sản phẩm:", productName);
      console.log("Ảnh sản phẩm:", productImage);
      console.log("Giá sản phẩm (số):"), parseFloat(productPrice);

      const quantity = parseInt(
        productCard.querySelector(".qty-control__number")?.value || "1"
      );

      // Lấy màu sắc và size đã chọn
      const selectedColor =
        productCard.querySelector('input[name="color"]:checked')?.value ||
        productCard.querySelector('input[name="colour"]:checked')?.value ||
        "Không có màu";

      const selectedSize =
        productCard.querySelector('input[name="size"]:checked')?.value ||
        productCard.querySelector('input[name="sizes"]:checked')?.value ||
        "Không có size";

      // Tạo ID duy nhất cho sản phẩm
      const productId = `${productName}-${selectedColor}-${selectedSize}`
        .replace(/\s+/g, "-")
        .toLowerCase();

      // Tạo đối tượng sản phẩm
      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: quantity,
        color: selectedColor,
        size: selectedSize,
      };

      console.log("Thông tin sản phẩm:", product);
      addToCart(product);
    });
  });
});
