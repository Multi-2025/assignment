(function ($) {
  $.fn.writeText = function (content) {
    var contentArray = content.split(""),
      current = 0,
      elem = this;
    setInterval(function () {
      if (current < contentArray.length) {
        elem.text(elem.text() + contentArray[current++]);
      }
    }, 80);
  };
})(jQuery);

$(document).ready(function () {
  $("#holder").writeText("A student of BMIS + A fan of Formula 1");
});
