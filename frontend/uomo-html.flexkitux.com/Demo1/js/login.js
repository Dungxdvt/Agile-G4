// Tài khoản mặc định
const defaultAccount = {
  email: "user@example.com",
  password: "user123",
};

// Hàm xóa tất cả dữ liệu đăng nhập
function clearLoginData() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("email");
}

// Kiểm tra định dạng email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Hàm lấy tham số từ URL
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Hàm đăng xuất
function logout() {
  clearLoginData();
  window.location.href = "./login_register.html";
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #ff4444;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.5s ease-out
  `;
  errorDiv.innerHTML = message;
  document.body.appendChild(errorDiv);

  // Thêm animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    errorDiv.style.animation = "slideOut 0.5s ease-in";
    errorDiv.style.animationFillMode = "forwards";
    style.textContent += `
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    setTimeout(() => {
      document.body.removeChild(errorDiv);
      document.head.removeChild(style);
    }, 500);
  }, 3000);
}

// Xử lý đăng nhập
function checkLogin() {
  console.log("Checking login...");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) {
    console.error("Email or password input not found");
    showError("Không tìm thấy form đăng nhập");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  console.log("Email entered:", email);
  console.log("Password entered:", password);

  // Validate email format
  if (!validateEmail(email)) {
    console.log("Invalid email format");
    showError("Email không hợp lệ");
    emailInput.focus();
    return;
  }

  // Check credentials
  if (email === defaultAccount.email && password === defaultAccount.password) {
    console.log("Login successful");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("email", email);

    // Chuyển hướng đến trang chủ
    window.location.replace("index.html");
  } else {
    console.log("Login failed");
    showError("Email hoặc mật khẩu không đúng");
    passwordInput.value = "";
    passwordInput.focus();
  }
}

// Kiểm tra trạng thái đăng nhập khi tải trang
function checkLoginStatus() {
  console.log("Checking login status...");
  // Xóa dữ liệu đăng nhập cũ khi tải lại trang
  clearLoginData();

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  console.log("Login status:", isLoggedIn);

  // Nếu đã đăng nhập và đang ở trang login, chuyển về trang chủ
  if (
    isLoggedIn === "true" &&
    window.location.pathname.includes("login_register.html")
  ) {
    console.log("User is logged in, redirecting...");
    window.location.href = "./index.html";
  }
}

// Hàm xử lý menu đăng nhập/đăng ký
function handleLoginMenu() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // Tìm tất cả các liên kết đến trang login/register
  const loginLinks = document.querySelectorAll(
    'a[href*="login_register.html"]'
  );

  loginLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (isLoggedIn === "true") {
        e.preventDefault();
        const confirmLogout = confirm("Bạn có muốn đăng xuất không?");
        if (confirmLogout) {
          logout();
        }
      }
    });
  });

  // Xử lý menu đăng nhập/đăng ký
  const loginMenu = document.querySelector(".login-menu");
  if (loginMenu) {
    if (isLoggedIn === "true") {
      // Nếu đã đăng nhập, hiển thị nút đăng xuất
      loginMenu.innerHTML = `
        <a href="#" onclick="logout()">Đăng xuất</a>
      `;
    } else {
      // Nếu chưa đăng nhập, hiển thị menu đăng nhập/đăng ký
      loginMenu.innerHTML = `
        <a href="./login_register.html">Đăng nhập</a>
        <a href="./login_register.html">Đăng ký</a>
      `;
    }
  }
}

// Kiểm tra trạng thái đăng nhập khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded in login.js");

  // Tìm form đăng nhập
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    console.log("Found login form");
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Form submitted");
      checkLogin();
    });
  } else {
    console.log("Login form not found");
  }

  checkLoginStatus();
});
