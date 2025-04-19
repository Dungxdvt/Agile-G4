document.addEventListener("DOMContentLoaded", function () {
  // Xóa tất cả các submenu
  const subMenus = document.querySelectorAll(".sub-menu, .sub-menu__wrapper");
  subMenus.forEach((submenu) => {
    submenu.remove();
  });

  // Xóa các icon mũi tên
  const arrows = document.querySelectorAll(".navigation__link svg");
  arrows.forEach((arrow) => {
    arrow.remove();
  });

  // Đơn giản hóa các menu chính
  const mainMenuItems = document.querySelectorAll(
    ".navigation__item > .navigation__link"
  );
  mainMenuItems.forEach((item) => {
    // Xóa class js-nav-right
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
});
