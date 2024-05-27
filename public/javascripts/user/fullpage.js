$(document).ready(function () { // 当文档加载完毕时执行
  $("#fullpage").fullpage({ // 初始化 fullPage 插件
    scrollBar: true, // 启用滚动条
    responsiveWidth: 600, // 设置响应式宽度为400px
    navigation: true, // 启用导航
    navigationTooltips: ["Home", "About", "Portfolio","Game" , "Contact"], // 设置导航提示
    anchors: ["Home", "About", "Portfolio","Game" , "Contact"], // 设置锚点链接
    menu: "#myMenu", // 绑定菜单
    fitToSection: false, // 关闭自动适应部分
    afterLoad: function (anchorLink, index) { // 在部分加载后执行
      var loadedSection = $(this); // 当前加载的部分
      if (index === 1) { // 如果是第一个部分
        $(".fa-chevron-down").each(function () { // 对所有 .fa-chevron-down 元素
          $(this).css("opacity", "1"); // 设置透明度为 1
        });
      }
      if (index === 2) { // 如果是第二个部分
        $(".skillbar").each(function () { // 对所有 .skillbar 元素
          $(this).find(".skillbar-bar").animate({ // 查找 .skillbar 内的 .skillbar-bar 并执行动画
            width: $(this).attr("data-percent") // 将宽度设置为 data-percent 属性值
          }, 2500); // 动画时长为 2500 毫秒
        });
      }
    }
  });

  $(document).on("click", "#moveDown", function () { // 当点击 #moveDown 元素时执行
    $.fn.fullpage.moveSectionDown(); // 调用 fullPage 插件的 moveSectionDown 方法，向下移动一个部分
  });
});
