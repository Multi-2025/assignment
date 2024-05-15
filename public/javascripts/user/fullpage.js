$(document).ready(function () {
  $("#fullpage").fullpage({
    scrollBar: true,
    responsiveWidth: 400,
    navigation: true,
    navigationTooltips: ["Home", "About", "Portfolio", "Contact"],
    anchors: ["Home", "About", "Portfolio", "Contact"],
    menu: "#myMenu",
    fitToSection: false,
    afterLoad: function (anchorLink, index) {
      var loadedSection = $(this);
      if (index === 1) {
        $(".fa-chevron-down").each(function () {
          $(this).css("opacity", "1");
        });
        $(".header-links a").each(function () {
          $(this).css("color", "white");
        });
        $(".header-links").css("background-color", "transparent");
      } else {
        $(".header-links a").each(function () {
          $(this).css("color", "black");
        });
        $(".header-links").css("background-color", "white");
      }
      if (index === 2) {
        $(".skillbar").each(function () {
          $(this).find(".skillbar-bar").animate({
            width: $(this).attr("data-percent")
          }, 2500);
        });
      }
    }
  });

  $(document).on("click", "#moveDown", function () {
    $.fn.fullpage.moveSectionDown();
  });
});
