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
        timeInfo: '',
        hasUserInfo: false,
        welcome: "欢迎使用北京地铁票价助手，by Henry.Ma",

        stationListMap: {},
    },

    bindLineChange: function (e) {
      this.setData({
        lineId: e.detail.value,
        stationId: 0,
      })
    },

    bindStationChange: function (e) {
      this.setData({
        stationId: e.detail.value,
      })
    },

    onTimeQuery: function (e) {
      var lineId = this.data.lineId;
      var stationId = this.data.stationId;
      var station = this.data.subway[lineId].stations[stationId];

      var timeTable = station.name + "站：\n";

      for (var i = 0; i < station.lastTrain.length; i++) {
        var time = station.lastTrain[i];
        timeTable += "方向：" + time.direction + "\n";
        timeTable += "首车：" + time.first + "，末车：" + time.last + "\n";
      }

      this.setData({
        timeInfo: timeTable,
      })
    },

    initStationList: function() {
      subway = this.data.subway;
      for (var i = 0; i < subway.length; i++) {
        for (var j = 0; j < subway[i].stations.length; j++) {
          var s = subway[i].stations[j];
          if (this.data.stationListMap.hasOwnProperty(s.name)) {
            // station already in map
          } else {
            this.data.stationListMap[s.name] = s;
          }
        }
      }
    },

    onLoad: function () {

      this.setData({
        subway: subway,
      })

      this.initStationList();
    },
    
})
