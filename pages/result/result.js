
var util = require('../../utils/util.js');
var app = getApp();
const schoolFee = [278, 369, 414];//1st for PS; 2nd for junior; 3rd for senior

Page({
  data: {
    rate:0, //人民币兑澳元汇率
    schoolLevelIdx: 0, // 0 - PS; 1 - junior; 2 senior
    learningWeeks: 0,
    learnLevel: '',
    startDate: '',
    endDate: '',
    termStart: 0,
    termEnd: 0,
    enrolFee: 284,
    tuitionFee: 0,
    serviceFee: 1000,
  },
  onLoad: function () {
    this.getCurrencyRate();
    //计算学费
    var learnWeeks = app.globalData.learningWeeks;
    var schoolLevel = app.globalData.schoolLevelIdx;
    var tuitionPerWeek = schoolFee[schoolLevel];
    var tuition = learnWeeks * tuitionPerWeek;

    this.setData({
      schoolLevelIdx: schoolLevel,
      learningWeeks: learnWeeks,
      learnLevel: app.globalData.learnLevel,
      startDate: app.globalData.startDate,
      endDate: app.globalData.endDate,
      termStart: app.globalData.termStart,
      termEnd: app.globalData.termEnd,
      tuitionFee: tuition,
    })
  },

  testInput() {
    console.log('input box has been clicked')
  },

  getCurrencyRate() {
    var self = this;
    self.setData({
      rate: 5,
    });
    /*var now = new Date();
    var nowDate = util.formatDate(now, '-');

    wx.request({
      url: 'https://api.getweapp.com/thirdparty/95516/web.exchange.rate?date=' + nowDate + '&baseCurrency=CNY' + '&transactionCurrency=AUD',
      header: {
        "contentType": "application/json",
        "dataType": "json"
      },
      success: function (res) {
        var realRateValue = parseFloat(res.data.params.result);
        if (realRateValue) {
          self.setData({
            rate: res.data.params.result
          });
          console.log('get rate successfully, it is 1:' + self.data.rate);
        }
        else {
          console.log('request sent successfully but not get data')
        }
      },
      fail: function (res) {
        console.log('request failure')
      }
    });*/
  },

})