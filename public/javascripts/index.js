$(".option").on("click", function() {
  $(".person-type").removeClass("active");
  $(".option").removeClass("active");
  $(this).addClass("active");
  var type = $(this).data("option");
  console.log($(type));

  setTimeout(function() {
    if (type === "home") {
      $(".home-body").addClass("active");
    } else if (type === "outdoor") {
      $(".outdoor-person").addClass("active");
    }
  }, 500);
});


document.addEventListener("DOMContentLoaded", function() {
    const text = "Welcome to my website!";
    const typingElement = document.getElementById("typing");
    let index = 0;

    function type() {
        if (index < text.length) {
            typingElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }

    type();
});
