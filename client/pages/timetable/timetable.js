//timetable.js
var subway = require('../../subway')

const app = getApp()

Page({
  data: {
    title: "首末车时间",
    lineId: 0,
    stationId: 0,
    subway: ['a', 'b', 'c'],
    timeInfo: '',
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

  onLoad: function () {

    this.setData({
      subway: subway,
    })
  },

})
