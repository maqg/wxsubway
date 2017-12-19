//index.js
var subway = require('../../subway')

const app = getApp()

Page({
  data: {
    title: "票价查询",
    startLineId: 0,
    startStationId: 0,
    endLineId: 0,
    endStationId: 0,
    subway: [],
    stationListMap: {},
  },

  bindLineChange1: function (e) {
    this.setData({
      startLineId: e.detail.value,
      startStationId: 0,
    })
  },

  bindStationChange1: function (e) {
    this.setData({
      startStationId: e.detail.value,
    })
  },

  bindLineChange2: function (e) {
    this.setData({
      endLineId: e.detail.value,
      endStationId: 0,
    })
  },

  bindStationChange2: function (e) {
    this.setData({
      endStationId: e.detail.value,
    })
  },

  onTimeQuery: function (e) {
    var startLineId = this.data.startLineId;
    var startStationId = this.data.startStationId;
    var station = this.data.subway[startLineId].stations[startStationId];

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

  initStationList: function () {
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
