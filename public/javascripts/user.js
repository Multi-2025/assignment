// 当文档准备好时执行
$(document).ready(function () {
  // 打字动画
  (function ($) {
    // 定义一个jQuery插件writeText
    $.fn.writeText = function (content) {
      // 将内容分割成数组
      var contentArray = content.split(""),
        current = 0, // 当前字符位置
        elem = this; // 当前元素
      // 设置定时器，每隔80毫秒添加一个字符
      setInterval(function () {
        if (current < contentArray.length) {
          // 在元素中添加一个字符
          elem.text(elem.text() + contentArray[current++]);
        }
      }, 80);
    };
  })(jQuery);

  // 为元素#holder设置打字动画，内容为"GAME DEVELOPER + WEB DESIGNER"
  $("#holder").writeText("A student of BMIS + A fan of Formula 1");

  // 初始化wow.js动画库
  new WOW().init();

  // 侧边导航栏动画
  // 将主体和导航栏向右移动285像素
  var main = function () {
    // 点击fa-bars图标时执行
    $(".fa-bars").click(function () {
      // 导航屏幕从右侧滑入
      $(".nav-screen").animate(
        {
          right: "0px"
        },
        200 // 动画持续时间200毫秒
      );

      // 主体内容向右移动285像素
      $("body").animate(
        {
          right: "285px"
        },
        200 // 动画持续时间200毫秒
      );
    });

    // 点击fa-times图标时执行
    $(".fa-times").click(function () {
      // 导航屏幕向右滑出
      $(".nav-screen").animate(
        {
          right: "-285px"
        },
        200 // 动画持续时间200毫秒
      );

      // 主体内容回到原位
      $("body").animate(
        {
          right: "0px"
        },
        200 // 动画持续时间200毫秒
      );
    });

    // 点击导航链接时执行
    $(".nav-links a").click(function () {
      // 导航屏幕向右滑出
      $(".nav-screen").animate(
        {
          right: "-285px"
        },
        500 // 动画持续时间500毫秒
      );

      // 主体内容回到原位
      $("body").animate(
        {
          right: "0px"
        },
        500 // 动画持续时间500毫秒
      );
    });
  };

  // 文档准备好时执行main函数
  $(document).ready(main);

  // 初始化全屏滚动效果
  $("#fullpage").fullpage({
    scrollBar: true, // 启用滚动条
    responsiveWidth: 400, // 响应式宽度
    navigation: true, // 显示导航
    navigationTooltips: ["Home", "About", "Portfolio","Game", "Contact"], // 导航提示
    anchors: ["Home", "About", "Portfolio","Game", "Contact"], // 锚点
    menu: "#myMenu", // 菜单
    fitToSection: false, // 不自动适应部分

    // 在加载部分后执行
    afterLoad: function (anchorLink, index) {
      var loadedSection = $(this);

      // 如果是第一个部分
      if (index === 1) {
        // 设置箭头透明度
        $(".fa-chevron-down").each(function () {
          $(this).css("opacity", "1");
        });
        // 设置链接颜色为白色
        $(".header-links a").each(function () {
          $(this).css("color", "white");
        });
        // 设置背景透明
        $(".header-links").css("background-color", "transparent");
      } else if (index !== 1) {
        // 如果不是第一个部分
        // 设置链接颜色为黑色
        $(".header-links a").each(function () {
          $(this).css("color", "black");
        });
        // 设置背景为白色
        $(".header-links").css("background-color", "white");
      }

      // 如果是第二个部分
      if (index === 2) {
        // 动画显示技能条
        $(".skillbar").each(function () {
          $(this)
            .find(".skillbar-bar")
            .animate(
              {
                width: $(this).attr("data-percent") // 设置宽度为数据属性的值
              },
              2500 // 动画持续时间2500毫秒
            );
        });
      }
    }
  });

  // 点击#moveDown时向下滚动一部分
  $(document).on("click", "#moveDown", function () {
    $.fn.fullpage.moveSectionDown();
  });

  // 平滑滚动效果
  $(function () {
    $("a[href*=#]:not([href=#])").click(function () {
      if (location.pathname.replace(/^\//, "") ===
          this.pathname.replace(/^\//, "") &&
        location.hostname === this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          $("html,body").animate(
            {
              scrollTop: target.offset().top
            },
            700 // 动画持续时间700毫秒
          );
          return false;
        }
      }
    });
  });

  // AJAX表单提交
  $(function () {
    // 获取表单
    var form = $("#ajax-contact");
    // 获取消息显示区域
    var formMessages = $("#form-messages");
    // 设置表单提交事件监听器
    $(form).submit(function (e) {
      // 阻止浏览器默认表单提交
      e.preventDefault();
      // 序列化表单数据
      var formData = $(form).serialize();
      // 使用AJAX提交表单
      $.ajax({
        type: "POST", // 提交方式为POST
        url: $(form).attr("action"), // 表单提交地址
        data: formData // 提交的数据
      })
        .done(function (response) {
          // 确保消息显示区域有'success'类
          $(formMessages).removeClass("error");
          $(formMessages).addClass("success");
          // 设置消息文本
          $(formMessages).text(response);
          // 清空表单
          $("#name").val("");
          $("#email").val("");
          $("#message").val("");
        })
        .fail(function (data) {
          // 确保消息显示区域有'error'类
          $(formMessages).removeClass("success");
          $(formMessages).addClass("error");
          // 设置消息文本
          if (data.responseText !== "") {
            $(formMessages).text(data.responseText);
          } else {
            $(formMessages).text(
              "Oops! An error occured and your message could not be sent."
            );
          }
        });
    });
  });
});
