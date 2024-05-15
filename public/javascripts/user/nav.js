$(document).ready(function () {
  $(".fa-bars").click(function () {
    $(".nav-screen").animate({ right: "0px" }, 200);
    $("body").animate({ right: "285px" }, 200);
  });

  $(".fa-times").click(function () {
    $(".nav-screen").animate({ right: "-285px" }, 200);
    $("body").animate({ right: "0px" }, 200);
  });

  $(".nav-links a").click(function () {
    $(".nav-screen").animate({ right: "-285px" }, 500);
    $("body").animate({ right: "0px" }, 500);
  });
});
