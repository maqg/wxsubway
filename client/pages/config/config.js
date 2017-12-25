//config.js

Page({
  data: {
    title: "关于地铁助手",
    author: "Henry.Ma",
    releaseTime: "2017年8月10日",
    version: "1.0.2",
    dataUpdateTime: "2017年8月10日",
    desc: "超级简单实用的北京地铁票价助手，采用全离线数据，可以查询所有的地铁线路票价以及首末车信息，为您的出行提供帮助（本次更新增加了16号线内容，抓取并更新了部分线路的首末车时间）。",
    welcome: "欢迎使用北京地铁票价助手，by Henry.Ma",
    ballleft: -20,
    screenWidth: 0,
    balltop: -20,
  },

  onLoad: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },

  ballMoveEvent: function (e) {
    var touchs = e.touches[0];
    var pageX = touchs.pageX;
    console.log('屏幕宽度：' + this.data.screenWidth)
    console.log('启始pageX: ' + pageX);

    //这里用right和bottom.所以需要将pageX pageY转换  
    var x = this.data.screenWidth / 2 - pageX - 20;
    if (this.data.screenWidth > 385) {
      if (x > 42) { x = 42; }
    } else {
      if (x > 32) { x = 32; }
    }
    if (x < 0) { x = 0; }
    console.log('x:' + x)
    this.setData({
      ballleft: -x,
      balltop: 20,
    });
  },
})
