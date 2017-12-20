//index.js
var subway = require('../../subway')

var JICHANG_LINE_105 = 105;
var MAXINT = 999999;

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
    distances: [],
    prevNodes: {},
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

    var startStationName = this.data.subway[this.data.startLineId].stations[this.data.startStationId].name;
    var endStationName = this.data.subway[this.data.endLineId].stations[this.data.endStationId].name;

    var startStation = this.data.stationListMap[startStationName];
    var endStation = this.data.stationListMap[endStationName];

    this.dijkstra(startStation);

    var stationList = this.getStationList(startStation["position"], endStation["position"]);

    var outText = "注意：以下结果给出的是最短距离的计价方案，并不一定是最优的换乘方案";
    outText += "\n总距离：" + this.data.distances[endStation["position"]] + " 米";
    outText += "\n消耗时间：约 " + 20 + " 分钟";
    outText += "\n单次费用：" + "price" + " 元";
    outText += "\n每月花费：约 " + "price" + " 元";
    outText += "\n每年花费：约 " + "price" + " 元";
    outText += "\n经停站：（共计 " + (stationList.length - 1) + " 站）";
    outText += "\n" + "";

    outText += endStation.name + "站";

    this.setData({
      timeInfo: outText,
    })
  },

  getOldStation: function (stationName) {
    if (this.data.stationListMap.hasOwnProperty(stationName)) {
      return this.data.stationListMap[stationName];
    } else {
      return null;
    }
  },

  getPrevStation: function (line, index) {
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

  getStationList: function(start, end) {
    var pathList = [];
    var	prevStation = this.data.prevNodes[end];

    while (prevStation != -1 && prevStation != start) {
      var temp = [this.data.stationList[prevStation]];
      pathList = temp.concat(pathList);
      prevStation = this.data.prevNodes[prevStation];
    }
	
    var temp = [this.data.stationList[start]];
    pathList = temp.concat(pathList);
    pathList.push(this.data.stationList[end]);

    return pathList;
  },

  getShortest: function(total, visited, distances) {
    var min = MAXINT;
    var shortest = -1;
    for (var i = 0; i < this.data.stationCount; i++) {
      if (visited[i] == false && distances[i] < min) {
        min = distances[i];
        shortest = i;
      }
    }
    return shortest;
  },

  getDistance: function (key) {
    if (this.data.distanceMap.hasOwnProperty(key)) {
      return this.data.distanceMap[key];
    } else {
      return MAXINT;
    }
  },

  dijkstra: function (station) {
    var stationCount = this.data.stationCount;
    var visited = [];
    var prevNodes = {}; //当前节点的前一节点
    var distances = []; //到下一点的距离

    var start = station["position"];

    // init something
    for (var i = 0; i < stationCount; i++) {
      visited.push(false);
      distances.push(MAXINT);
    }

    for (var i = 0; i < stationCount; i++) {
      distances[i] = this.getDistance(start + "-" + i);
      if (i != start && distances[i] < MAXINT) {
        prevNodes[i] = start;
      } else {
        prevNodes[i] = -1;
      }
    }

    while (true) {

      var latest = this.getShortest(stationCount, visited, distances)
      if (latest == -1) {
        break;
      }
      visited[latest] = true;
      for (var i = 0; i < stationCount; i++) {
        var dist = this.getDistance(latest + "-" + i);
        if (visited[i] == false && dist != MAXINT && distances[latest] + dist < distances[i]) {
          distances[i] = distances[latest] + dist;
          prevNodes[i] = latest;
        }
      }
    }
    this.data.distances = distances;
    this.data.prevNodes = prevNodes;
  },

  initDijkstra: function () {

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
