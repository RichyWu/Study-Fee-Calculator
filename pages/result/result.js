
var util = require('../../utils/util.js');
var app = getApp();
const schoolFee = [278, 369, 414];//1st for PS; 2nd for junior; 3rd for senior

Page({
  data: {
    rate: 0, //澳元兑人民币汇率
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
    totalFeeAud:0,
    totalFeeCny:0,
  },
  onLoad: function () {
    this.getCurrencyRate();
    //计算学费
    var learnWeeks = app.globalData.learningWeeks;
    var schoolLevel = app.globalData.schoolLevelIdx;
    var tuitionPerWeek = schoolFee[schoolLevel];
    var tuition = learnWeeks * tuitionPerWeek;
    var total = this.data.enrolFee + this.data.serviceFee + tuition;
    var totalCny = (total * this.data.rate).toFixed(1);

    this.setData({
      schoolLevelIdx: schoolLevel,
      learningWeeks: learnWeeks,
      learnLevel: app.globalData.learnLevel,
      startDate: app.globalData.startDate,
      endDate: app.globalData.endDate,
      termStart: app.globalData.termStart,
      termEnd: app.globalData.termEnd,
      tuitionFee: tuition,
      totalFeeAud: total,
      totalFeeCny: totalCny,
    })
  },

  testInput() {
    console.log('input box has been clicked')
  },

  getCurrencyRate() {
    var self = this;
    self.setData({
      rate: app.globalData.curRate,
    });
  },

})