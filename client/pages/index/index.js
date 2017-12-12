//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var subway = require('../../subway')

const app = getApp()

Page({
    data: {
        userInfo: {},
        logged: false,
        index: 0,
        takeSession: false,
        requestResult: '',
        subway: ['a', 'b', 'c'],
        lines: [],
        motto: '不疯狂，无人生',
        hasUserInfo: false,
        welcome: "欢迎使用北京地铁票价助手",
    },

    bindPickerChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        index: e.detail.value
      })
    },

    onLoad: function () {

      var lines = [];
      for (var i = 0; i < subway.length; i++) {
        var s = subway[i];
        lines.push(s.name);
      }

      this.setData({
        subway: subway,
        lines: lines,
      })
    },
    
})
