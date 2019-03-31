
var util = require('../../utils/util.js');
var app = getApp();
const schoolFee = [288, 382, 428]; //from DET - [Primary, Junior High, Senior High]
const servFee = 1000; //我们的服务费
const appFee = 282; //教育局申请费
const curRate = 5; //澳元兑人民币汇率
const visa = 160; //旅游签证申请费
const flight = 2000;
const accoFee = 110; //一间双（三）人民宿一晚费用
const living = 100; //个人一周生活费
const misc = 300; //入读杂费，包括校服，文具等

Page({
  data: {
    rate: 5, //澳元兑人民币汇率
    serviceFee: 0,
    enrolFee: 0,
    schoolLevelIdx: 0, // 0 - PS; 1 - junior; 2 senior
    learningWeeks: 0,
    learnLevel: '',
    startDate: '',
    endDate: '',
    termStart: 0,
    termEnd: 0,
    tuitionFee: 0,
    miscFee:0,
    studyTotalFeeAud:0,
    studyTotalFeeCny:0,
    otherTotalAud:0,
    otherTotalCny:0,
    peopleArrIndex:0,
    peopleArray:[2, 3, 4, 5],
    peopleNum:2, //by default there are 2 people
    visaFee: 0,
    flightFare: 0,
    accomFee: 0,
    livingFee: 0,
  },
  onLoad: function () {
    //this.getCurrencyRate();

    //计算学费
    this.calcStudyFee();

    //计算其他花费
    this.calcOtherFee();

    this.setData({
      rate: curRate,
      learnLevel: app.globalData.learnLevel,
      startDate: app.globalData.startDate,
      endDate: app.globalData.endDate,
      termStart: app.globalData.termStart,
      termEnd: app.globalData.termEnd,      
    })
  },

  calcStudyFee() {
    var self = this;
    var learnWeeks = app.globalData.learningWeeks;
    var schoolLevel = app.globalData.schoolLevelIdx;
    var tuitionPerWeek = schoolFee[schoolLevel];
    var tuition = learnWeeks * tuitionPerWeek;
    var total = appFee + servFee + tuition + misc;
    var totalCny = total * curRate;

    self.setData({
      schoolLevelIdx: schoolLevel,
      learningWeeks: learnWeeks,
      tuitionFee: tuition,
      studyTotalFeeAud: total,
      studyTotalFeeCny: totalCny,
      serviceFee: servFee,
      enrolFee: appFee,
      miscFee: misc,
    })
  },

  inputNumOfPeople: function(e) {
    var idx = e.detail.value;
    this.setData({
      peopleArrIndex: idx,
    })
    //update other fee
    this.calcOtherFee();
  },

  calcOtherFee() {
    var self = this;
    var num = self.data.peopleArray[self.data.peopleArrIndex]; //人数
    var days = app.globalData.learningDays;
    var weeks = app.globalData.learningWeeks;

    var visaRate = visa * num;
    var flightFee = flight * num;
    var accommNum = (num <= 3)?1:2; //超过3人要2间房
    var accomm = accoFee * days * accommNum;
    var livingRate = living * num * weeks;
    var totalAud = visaRate + flightFee + accomm + livingRate;
    var totalCny = totalAud * curRate;

    self.setData({
      peopleNum: num,
      visaFee:visaRate,
      flightFare: flightFee,
      accomFee: accomm,
      livingFee: livingRate,
      otherTotalAud: totalAud,
      otherTotalCny: totalCny,
    })
  },

  getCurrencyRate() {
    var self = this;
    self.setData({
      rate: app.globalData.curRate,
    });
  },

})