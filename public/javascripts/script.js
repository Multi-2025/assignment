
// 当鼠标悬停在导航链接上时
$("#nav a").on("mouseover", function () {
    // 获取链接父元素的位置
    var position = $(this).parent().position();
    // 获取链接父元素的宽度
    var width = $(this).parent().width();
    // 设置.slide2的样式，并添加类名squeeze
    $("#nav .slide2").css({ opacity: 1, left: +position.left, width: width }).addClass("squeeze");
});

// 当鼠标离开导航链接时
$("#nav a").on("mouseout", function () {
    // 设置.slide2的样式，将透明度设为0，并移除类名squeeze
    $("#nav .slide2").css({ opacity: 0 }).removeClass("squeeze");
});

// 获取第三个导航链接父元素的宽度
var currentWidth = $("#nav li:nth-of-type(3) a").parent("li").width();
// 获取第三个导航链接的位置
var current = $("li:nth-of-type(3) a").position();


// 添加点击事件监听器到menu-btn
document.getElementById('menu-btn').addEventListener('click', function() {
    // 获取导航栏元素
    var nav = document.getElementById('nav');
    // 切换collapsed类
    nav.classList.toggle('collapsed');
});
