document.addEventListener("DOMContentLoaded", function () {
  // Xóa tất cả các sự kiện hover và click trên các menu chính
  const mainMenuItems = document.querySelectorAll(
    ".navigation__item > .navigation__link"
  );
  mainMenuItems.forEach((item) => {
    // Xóa class js-nav-right để vô hiệu hóa hành vi mở submenu
    item.classList.remove("js-nav-right");

    // Thêm href cho các menu chính nếu chưa có
    if (item.getAttribute("href") === "#" || !item.getAttribute("href")) {
      if (item.textContent.includes("Home")) {
        item.setAttribute("href", "index.html");
      } else if (item.textContent.includes("Shop")) {
        item.setAttribute("href", "shop1.html");
      } else if (item.textContent.includes("Blog")) {
        item.setAttribute("href", "blog_list1.html");
      } else if (item.textContent.includes("Pages")) {
        item.setAttribute("href", "about.html");
      }
    }
  });

  // Ẩn tất cả các submenu
  const subMenus = document.querySelectorAll(".sub-menu, .sub-menu__wrapper");
  subMenus.forEach((submenu) => {
    submenu.style.display = "none";
  });

  // Xóa các sự kiện click và hover mặc định
  const allLinks = document.querySelectorAll(".navigation__link");
  allLinks.forEach((link) => {
    link.style.cursor = "pointer";
    // Xóa các event listener mặc định
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
  });
});
