$(function () { // 当页面DOM加载完成时执行
  $("a[href*=#]:not([href=#])").click(function () { // 为所有链接地址中包含#但不完全等于#的<a>元素添加点击事件
    if (location.pathname.replace(/^\//, "") // 检查当前页面路径去掉开头的斜杠是否与链接目标路径去掉开头的斜杠相同
        === this.pathname.replace(/^\//, "") && location.hostname // 检查当前页面主机名是否与链接目标主机名相同
        === this.hostname) {
      var target = $(this.hash); // 获取链接目标的哈希值（#后面的部分），并尝试将其作为选择器获取目标元素
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]"); // 如果没有找到元素，则尝试通过name属性获取目标元素
      if (target.length) { // 如果找到了目标元素
        $("html,body").animate({ scrollTop: target.offset().top }, 700); // 动画方式滚动页面到目标元素位置，动画持续700毫秒
        return false; // 阻止默认的链接跳转行为
      }
    }
  });
});
