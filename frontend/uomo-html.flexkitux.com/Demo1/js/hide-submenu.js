document.addEventListener("DOMContentLoaded", function () {
  // Ẩn tất cả các menu con
  const hideElements = [
    ".box-menu",
    ".mega-menu",
    ".default-menu",
    ".sub-menu__list",
  ];

  hideElements.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.style.display = "none";
    });
  });

  // Xóa các sự kiện hover và click trên các menu chính
  document.querySelectorAll(".navigation__item").forEach((item) => {
    item.style.pointerEvents = "none";
    const link = item.querySelector(".navigation__link");
    if (link) {
      link.style.pointerEvents = "auto";
    }
  });
});
