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

    oriLeft: 0,
    oriTop: 0,

    ballleft: 0,
    screenWidth: 0,
    balltop: 0,

    startX: 0,
    startY: 0,

    imageHeight: 0,
    imageWidth: 0,
  },

  onLoad: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          imageHeight: parseInt(res.windowHeight / 2),
          imageWidth: res.windowWidth,
        });
      }
    });
  },

  ballMoveEvent: function (e) {
    var touchs = e.touches[0];
    var pageX = touchs.pageX;
    console.log('屏幕宽度：' + this.data.screenWidth)
    console.log('启始pageX: ' + pageX);

    if (e.touches.length == 2) { // 二指缩放
      this.setData({
        imageWidth: 1500,
        imageHeight: 900,
      });
      return;
    }

    var newLeft = this.data.oriLeft;
    if (this.data.startX > pageX) { // move to left
      newLeft -= (this.data.startX - pageX);
    } else {
      newLeft += (pageX - this.data.startX);
    }

    console.log('NEW LEFT:' + newLeft)
    this.setData({
      ballleft: newLeft,
      balltop: 20,
    });
  },

  ballMoveEndEvent: function (e) {
    //this.data.oriLeft = e.currentTarget.offsetLeft;
    //this.data.oriTop = e.currentTarget.offsetTop;
  },

  ballMoveStartEvent: function (e) {
    this.data.startX = e.touches[0].pageX;
    this.data.startY = e.touches[0].pageY;
    this.data.oriLeft = e.currentTarget.offsetLeft;
    this.data.oriTop = e.currentTarget.offsetTop;
  },
})
