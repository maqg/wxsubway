//index.js
var subway = require('../../subway')

var JICHANG_LINE_105 = 105;

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
    stationList: [],
    stationCount: 0,
    distanceMap: {},
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

  getOldStation: function(stationName) {
    if (this.data.stationListMap.hasOwnProperty(stationName)) {
      return this.data.stationListMap[stationName];
    } else {
      return null;
    }
  },

  getPrevStation: function(line, index) {
    if (index == 0) {
      return null;
    } else {
      return line["stations"][index - 1];
    }
  },

  getNextStation: function (line, index) {
    if (index == line["stations"].length - 1) {
      return null;
    } else {
      return line["stations"][index + 1];
    }
  },

  initDijkstra: function() {

    var position = 0;

    // init station prevLength
    for (var i = 0; i < this.data.subway.length; i++) {
      var line = this.data.subway[i];
      for (var j = 0; j < line.stations.length; j++) {
        var station = line.stations[j];
        if (j == 0) {
          station["prevLength"] = 0;
        } else {
          station["prevLength"] = line.stations[j - 1]["length"];
        }
      }
    }

    // init subStations
    for (var i = 0; i < this.data.subway.length; i++) {
      var line = this.data.subway[i];
      if (line.id == JICHANG_LINE_105) {
        continue;
      }

      for (var j = 0; j < line.stations.length; j++) {
        var station = line.stations[j];
        var oldStation = this.getOldStation(station["name"])
        var prevStation = this.getPrevStation(line, j)
        var nextStation = this.getNextStation(line, j)
        if (oldStation != null) { // station already in MAP
          oldStation["lineIds"].push(line["id"]);

          if (nextStation != null) { // having next station
            var oldNextStation = this.getOldStation(nextStation["name"]);
            if (oldNextStation != null) { // 该下一跳站点已通过其他线路，添加到队列中
              oldStation["subStations"].push({
                "station": oldNextStation["position"],
                "length": station["length"]
              });
            } else {
              oldStation["subStations"].push({
                "station": oldStation["position"] + 1,
                "length": station["length"]
              });
            }
          }

          if (prevStation != null) { // having prevStation
            var oldPrevStation = this.getOldStation(prevStation["name"]);
            if (oldPrevStation == prevStation) { // 前趋站点已加入队列
              oldStation["subStations"].push({
                "station": prevStation["position"],
                "length": station["prevLength"]
              });
            } else { // 前趋站点已通过其他线路加入队列
              oldStation["subStations"].push({
                "station": oldPrevStation["position"],
                "length": prevStation["length"]
              });
            }
          } 

        } else { // 该站点首次被录入
          station["lineIds"] = [line["id"]];
          station["subStations"] = [];
          station["position"] = position;
          position = position + 1;
          this.data.stationListMap[station["name"]] = station
          this.data.stationList.push(station)

          if (nextStation != null) { // having nextStation
            var oldNextStation = this.getOldStation(nextStation["name"]);
            if (oldNextStation != null) { // 该下一跳站点已通过其他线路，添加到队列中
              station["subStations"].push({
                "station": oldNextStation["position"],
                "length": station["length"]
              });
            } else { // 该下一跳站点尚未被录入
              station["subStations"].push({
                "station": station["position"] + 1,
                "length": station["length"]
              });
            }
          }
          
          if (prevStation != null) { // having prevStation
            var oldPrevStation = this.getOldStation(prevStation["name"]);
            station["subStations"].push({
              "station": oldPrevStation["position"],
              "length": station["prevLength"]
            });
          }
        }
      }
    } // end initSubStations

    this.data.stationCount = this.data.stationList.length;

    // initDistanceMap
    for (var i = 0; i < this.data.stationList.length; i++) {
      var station = this.data.stationList[i];
      for (var j = 0; j < station["subStations"].length; j++) {
        var subConfig = station["subStations"][j];
        var subStation = this.data.stationList[subConfig["station"]];
        var length = subConfig["length"];
        var key = station["position"] + "-" + subStation["position"];
        var key2 = subStation["position"] + "-" + station["position"];
        this.data.distanceMap[key] = length;
        this.data.distanceMap[key2] = length;
      }
    }
  },

  onLoad: function () {

    this.setData({
      subway: subway,
    })

    this.initDijkstra();
  },

})
