//lineId.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var subway = require('../../subway')

const app = getApp()

Page({
    data: {
        userInfo: {},
        lineId: 0,
        stationId: 0,
        takeSession: false,
        requestResult: '',
        subway: ['a', 'b', 'c'],
        timeInfo: '不疯狂，无人生',
        hasUserInfo: false,
        welcome: "欢迎使用北京地铁票价助手，by Henry.Ma",
    },

    bindLineChange: function (e) {
      this.setData({
        lineId: e.detail.value,
        stationId: 0,
      })
    },

    bindStationChange: function (e) {
      var lineId = this.data.lineId;
      var stationId = parseInt(e.detail.value);
      var station = this.data.subway[lineId].stations[stationId];

      var timeTable = "首末车：" + station.name + "\n";

      for (var i = 0; i < station.lastTrain.length; i++) {
        var time = station.lastTrain[i];
        timeTable += "方向：" + time.direction + "，首车：" + time.first + "，末车：" + time.last + "\n";
      }

      this.setData({
        stationId: e.detail.value,
        timeInfo: timeTable,
      })
    },

    onLoad: function () {
      this.setData({
        subway: subway,
      })
    },
    
})
