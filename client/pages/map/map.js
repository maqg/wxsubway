// map.js

var app = getApp()
var distanceList = [0, 0]; //存储缩放时,双指距离.只有两个数据.第一项为old distance.最后一项为new distance
var disPoint = { x: 0, y: 0 };//手指touch图片时,在图片上的位置

Page({
  data: {
    title: "运行图",
    left: 0,
    top: 50,
    baseScale: 1,
    width: "100%",
    touches: [],
  },

  /**
  * 加载图片
  */
  imageOnload: function (e) {
    this.data.imageWidth = e.detail.width;
    this.data.imageHeight = e.detail.height;
  },

  /**
  * bindtouchmove
  */
  bindTouchMove: function (e) {

    if (e.touches.length == 1 && this.data.move == 1) { //一指移动当前图片
      var left = e.touches[0].clientX - disPoint.x
      var top = e.touches[0].clientY - disPoint.y
      this.setData({
        left: left,
        top: top,
      })
      console.log("0ne left:" + this.data.left + "top: " + this.data.top)
    }

    if (e.touches.length == 2) { //二指缩放

      var xMove = e.touches[1].clientX - e.touches[0].clientX
      var yMove = e.touches[1].clientY - e.touches[0].clientY
      var distance = Math.sqrt(xMove * xMove + yMove * yMove); //开根号

      distanceList.shift()
      distanceList.push(distance)

      if (distanceList[0] == 0) { return }
      var distanceDiff = distanceList[1] - distanceList[0] //两次touch之间, distance的变化. >0,放大图片.<0 缩小图片

      var baseScale = this.data.baseScale + 0.005 * distanceDiff
      if (baseScale > 0) {
        this.data.baseScale = baseScale
        var imgWidth = baseScale * parseInt(this.data.imgWidth)
        var imgHeight = baseScale * parseInt(this.data.imgHeight)
        this.setData({
          left: this.data.left - parseInt(distanceDiff / 2),
          top: this.data.top - parseInt(distanceDiff / 2),
          baseScale: this.data.baseScale,
        })
        console.log("left:" + this.data.left + "top: " + this.data.top + "dis:" + distanceDiff + "scale:" + this.data.baseScale)
      } else {
        this.data.baseScale = 0

        this.setData({
          left: this.data.left,
          top: this.data.top,
          baseScale: this.data.baseScale,
        })
        console.log("left:" + this.data.left + "top: " + this.data.top + "disss:" + distanceDiff + "scale:" + this.data.baseScale)
      }
    }
  },

  bindTouchEnd: function(e) {

  },

  /**
  * bindtouchstart
  */
  bindTouchStart: function (e) {
    distanceList = [0, 0] //回复初始值
    disPoint = { x: 0, y: 0 }
    this.data.touches = [];
    if (e.touches.length == 1) {
      disPoint.x = e.touches[0].clientX - this.data.left
      disPoint.y = e.touches[0].clientY - this.data.top
      this.data.move = 1;
    } else {
      this.data.move = 0;
    }
  },

  onLoad: function (options) {
    this.setData({})
  },
})
