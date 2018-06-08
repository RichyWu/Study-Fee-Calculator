//index.js
const app = getApp()
var util = require("../../utils/util.js")
const psYrLevel = ['学前班', '1年级', '2年级', '3年级', '4年级', '5年级', '6年级']
const collegeYrLevel = ['7年级', '8年级', '9年级', '10年级', '11年级', '12年级']
const termDate = [{ year: 2018, term1: { startMonth: 1, startDate: 29, endMonth: 3, endDate: 29 }, term2: { startMonth: 4, startDate: 16, endMonth: 6, endDate: 29 }, term3: { startMonth: 7, startDate: 16, endMonth: 9, endDate: 21 }, term4: { startMonth: 10, startDate: 8, endMonth: 12, endDate: 21 }},
  { year: 2019, term1: { startMonth: 1, startDate: 29, endMonth: 4, endDate: 5 }, term2: { startMonth: 4, startDate: 23, endMonth: 6, endDate: 28 }, term3: { startMonth: 7, startDate: 15, endMonth: 9, endDate: 20 }, term4: { startMonth: 10, startDate: 7, endMonth: 12, endDate: 20 }},
  { year: 2020, term1: { startMonth: 1, startDate: 28, endMonth: 3, endDate: 27 }, term2: { startMonth: 4, startDate: 14, endMonth: 6, endDate: 26 }, term3: { startMonth: 7, startDate: 13, endMonth: 9, endDate: 18 }, term4: { startMonth: 10, startDate: 5, endMonth: 12, endDate: 18 } }
]

Page({
  data: {
    //生日选择的日期
    birthDate:'请选择生日日期',

    //common data for 日历
    week: ["日", "一", "二", "三", "四", "五", "六"],
    dayListThisMth: [],
    dayListNextOneMth: [],
    dayListNextTwoMth: [],
    firstDayIdxThisMth: 0,
    firstDayIdxNextOneMth: 0,
    firstDayIdxNextTwoMth: 0,
    thisMonth: 0,
    yearThisMth: 0,
    today: '',
    termNow: 0,

    //data for 计划入读日期 日历
    learnStartDate:'请点选您计划的日期',
    hideStartCal: true,
    dayOfStartThisMth: 0, //入读选的几号
    
    //data for 结束日期 日历（3个月日历）
    learnEndDate: '请点选您计划的日期',
    highLightDate: 0,
    nextOneMonth: 0,
    nextTwoMonth: 0,
    yearNextOneMth: 0,
    yearNextTwoMth: 0,
    dateValue: [9999, 13, 32],
    hideEndCal: true,

    //判断读几年级
    age: 0,   //以计划入读那年4月30日为基准的年龄  
    termOfStartLearn: 0, //入读时候是term几
  },

  //页面载入时计算当日日期,渲染日历
  onLoad: function () {
    var that = this;

    //初始化当天日期
    var date = new Date();
    that.setData({
      today: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    })
    var termNum = that.checkTermNum(date.getFullYear(), (date.getMonth() + 1), date.getDate());
    that.setData({
      termNow:termNum
    })
    that.renderCalendar(date.getFullYear(), (date.getMonth() + 1), date.getDate()); //使用方法： 在此函数内传入年、月、日
  },

  /*事件处理函数*/

  //触发picker改变生日日期
  bindBirthDateChange: function (e) {
    this.setData({
      birthDate: e.detail.value
    })
  },

  /*入读日期日历的年月被点击时会出现picker。此函数是处理这个picker触发。
    结果是更新日历，因此最后会有renderCalendar()
    选择日期由choose...Date()函数完成。
    如果日历更新后未选择，则日期为picker所选日期
    */
  bindLearnStartDateChange: function (e) {
    var that = this;
    var learnDate = e.detail.value;
    that.setData({
      learnStartDate: learnDate
    })
    var year = learnDate.substring(0,4);
    var month = learnDate.substring(5, 7);
    that.renderCalendar(year, month); //不指定day，表示无需高亮某一天
  },

  /*隐藏或显示两个日历的函数*/
  hideStartCal() {
    var that = this;
    that.setData({
      hideStartCal: true,
    })
  },

  hideEndCal() {
    var that = this;
    that.setData({
      hideEndCal: true,
    })    
  },

  showStartCal() {
    var that = this;
    that.setData({
      hideStartCal: false
    })
  },

  showEndCal() {
    var that = this;
    that.setData({
      hideEndCal: false
    })
  },
  
  /*“看看吧” 按钮的处理，完成：
  1. 是否有日期未选择
  2. 调用函数通过选择日期验证是否满足入读条件，及如果满足，应该入读什么年级
  */
  bindCalcBtn:function(){
    var that = this;
    if ((that.data.birthDate == '请选择生日日期') || (that.data.learnStartDate == '请点选您计划的日期') || (that.data.learnEndDate == '请点选您计划的日期')) {
      //有该填的未填
      wx.showModal({
        title: '注意！',
        content: '请确保生日及计划赴澳学习日期都正确填写',
        showCancel:false,
        confirmText:"知道了",
      })
    }
    else{
      that.learnInfoValidate();
    }
    
  },

  //验证信息，给予用户提示
  learnInfoValidate:function(){
    var that = this;

    var birthDate = that.data.birthDate;
    var learnDate = that.data.learnStartDate;
    var dateThresh = learnDate.substring(0,4) + '/04/30'; //入学年龄以当年4月30日判断
    
    that.setData({age : util.getAge(birthDate, dateThresh)});

    var age = that.data.age
    if (age < 5){
      wx.showModal({
        title: '注意',
        content: '在计划入读时间不满5岁，无法入读小学。请确认生日信息，以及计划就读日期是否正确。',
        showCancel:false,
        confirmText:"知道了"
      })
    }
    else if (age >= 20){
      wx.showModal({
        title: '注意',
        content: '在计划入读时间已超过入读高中的最大年龄。请确认生日信息，以及计划就读日期是否正确。',
        showCancel: false,
        confirmText: "知道了"
      })
    }
    else{
      var learnLevel = ' '
      if(age <=11){
        learnLevel = psYrLevel[age-5];
        app.globalData.schoolLevelIdx = 0; //0 -- PS, 1 -- junior, 2 -- senior
      }
      else {
        age = (age<=17?age:17)
        learnLevel = collegeYrLevel[age-12]
        app.globalData.schoolLevelIdx = (age<=14?1: 2)
      }
      //计算入读周数
      /*var learnWeeks = that.calcLearnWeeks();
      app.globalData.learningWeeks = learnWeeks;
      console.log(learnWeeks);*/

      var dispContent = '您的孩子将于' + that.data.learnStartDate + '就读' + learnLevel + ' 的第 ' + that.data.termOfStartLearn + ' 个Term';
      wx.showModal({
        title: '提示',
        content: dispContent,
        cancelText:"重填",
        confirmText:"继续",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')//前往结果页
          }
          if(res.cancel){
            console.log('用户点击取消')//留在当前页
          }
        }
      })
    }
  },

  /*使用方法：传入年月日。绘制当年当月的日历，并高亮传入日期。
    day有缺省值，如果调用时没有传入day，则无需高亮日期。比如入读日历的picker改变时间后，重新渲染日历
    需要高亮的场景：
    1. 初始化，高亮当天日期
    2. 入读时间选择后，点开结束时间日历，高亮入读日期
  */
  renderCalendar(year, month, day=0) {
    var that = this;

    //计算下一月，判断是否翻年
    var yearNextMth = parseInt(year);
    var monthNextMth = parseInt(month) + 1;
    if (monthNextMth > 12) {
      monthNextMth = 1;
      yearNextMth++;
    }

    //计算下两月，判断是否翻年
    var yearNextTwoMth = yearNextMth;
    var monthNextTwoMth = monthNextMth + 1;
    if (monthNextTwoMth > 12) {
      monthNextTwoMth = 1;
      yearNextTwoMth++;
    }

    //计算需显示日历的月份中，1号的index
    var d = new Date();
    d.setFullYear(year);
    d.setMonth(month - 1);
    d.setDate(1);
    var firstDayIdxThisMth = d.getDay(); //本月1号在 0（周日） - 6（周六）的index

    d.setFullYear(yearNextMth);
    d.setMonth(monthNextMth - 1);
    d.setDate(1);
    var firstDayIdxNextMth = d.getDay();//下一个月1号的index

    d.setFullYear(yearNextTwoMth);
    d.setMonth(monthNextTwoMth - 1);
    d.setDate(1);
    var firstDayIdxNexTwotMth = d.getDay();//再下一个月1号的index

    var arrThisMth = [];
    var arrNextOneMth = [];
    var arrNextTwoMth = [];
    var Index = 0;
    //var dayElement = {day:0, bgColor:'white',color:'black'};

    //本月总共多少天，从1号开始放入数组
    //同时判断当日是否为学期假期，若是，则在数组中加入对应的background color（#f1f1f1)
    for (var i = 1; i <= that.getDayNum(year, month); i++) {
      let backgroundColor = ((that.isHoliday(year, month, i))?'#f1f1f1':'white');
      arrThisMth.push({day:i, bgColor:backgroundColor, color:'black'});
    }
    for (var i = 1; i <= that.getDayNum(yearNextMth, monthNextMth); i++) {
      let backgroundColor = ((that.isHoliday(yearNextMth, monthNextMth, i)) ? '#f1f1f1' : 'white');
      arrNextOneMth.push({ day: i, bgColor: backgroundColor, color: 'black' });
    }
    for (var i = 1; i <= that.getDayNum(yearNextTwoMth, monthNextTwoMth); i++) {
      let backgroundColor = ((that.isHoliday(yearNextTwoMth, monthNextTwoMth, i)) ? '#f1f1f1' : 'white');
      arrNextTwoMth.push({ day: i, bgColor: backgroundColor, color: 'black' });
    }
   
    //判断是否传入了day，需要高亮
    if (day != 0) {
      Index = day-1;
      arrThisMth[Index].bgColor = 'blue';
      arrThisMth[Index].color = 'white';
    } 
    
    that.setData({
      firstDayIdxThisMth: firstDayIdxThisMth,
      firstDayIdxNextOneMth: firstDayIdxNextMth,
      firstDayIdxNextTwoMth: firstDayIdxNexTwotMth,
      dayListThisMth: arrThisMth,
      dayListNextOneMth: arrNextOneMth,
      dayListNextTwoMth: arrNextTwoMth,
      thisMonth: month,
      yearThisMth: year,
      nextOneMonth: monthNextMth,
      yearNextOneMth: yearNextMth,
      nextTwoMonth: monthNextTwoMth,
      yearNextTwoMth: yearNextTwoMth,
    })
  },

//传入参数年份 和 要计算的月份， 可以为字符串，也可以为数字。
  getDayNum(year, month) {
    var that = this;
    var d = new Date();
    d.setFullYear(year);
    d.setMonth(month);
    d.setDate(0);
    return (d.getDate()); //d.getDate() 即为此月的总天数！  
  },

  /*在入读日历上选择的操作
    当在日历上选择时，dayListThisMth已经更新了，点选的日期可以在list里找到（index = date - 1)
    找到对应的日期后，bgColor不为#f1f1f1的才可以操作 - 即非假期
    并且选择的term必须大于当前时间所处term（onLoad时计算） - 因为申请必须至少提前一个term
    点选完毕后，除了设置learnStartDate，还需要隐藏日历
  */
  chooseStartDate(e) {
    var that = this;
    var val = e.currentTarget.dataset.value;
    var idx = parseInt(val) - 1;
    var selectTerm = that.checkTermNum(that.data.yearThisMth, that.data.thisMonth, val);

    if ((parseInt(that.data.yearThisMth) > (new Date().getFullYear())) || (selectTerm > that.data.termNow)) {
      if(that.data.dayListThisMth[idx].bgColor != '#f1f1f1') {
        that.setData({
          learnStartDate: that.data.yearThisMth + "-" + that.data.thisMonth + "-" + val,
          hideStartCal:true,
          termOfStartLearn: selectTerm,
          dayOfStartThisMth: val,
        })
        //更新入读日期后，同时render日历，并高亮日期
        that.renderCalendar(that.data.yearThisMth, that.data.thisMonth, parseInt(val));
      }
    }
    else {
      wx.showModal({
        title: '注意',
        content: '申请至少需要提前一个Term。您选的入读日期太近了',
        showCancel: false,
        confirmText:'知道了'
      })
    }
  },

  /*在结束日历上选择的操作
    结束日历显示3个月的，第一个日历（thisMth）根据入读日期而来
    在第一个日历上点选时，不能比入读日期（高亮的）提前
    同样，不能选择假期（背景色为#f1f1f1的）
    其余两个日历，只是不能选择假期
    选择完毕后，需要判断所处的Term是否和termOfStartLearn一致
  */
  chooseEndDateThisMth(e) {
    var that = this;
    var val = e.currentTarget.dataset.value;
    var idx = parseInt(val) - 1;
    var selectTerm = that.checkTermNum(that.data.yearThisMth, that.data.thisMonth, val);
    var sameTerm = (selectTerm == that.data.termOfStartLearn);

    //点取结束时间在开始时间之后
    if (parseInt(val) > that.data.dayOfStartThisMth) {
      //所选时间不是假期
      if (that.data.dayListThisMth[idx].bgColor != '#f1f1f1') {
        //若跨term了
        if(!sameTerm) {
          wx.showModal({
            title: '注意',
            content: '您所选的日期涵盖了2个Term，中间有学校假期，您确定？',
            confirmText:'执意如此',
            cancelText:'重选日期',
            success: function (res) {
              if (res.confirm) {
                sameTerm = true;//强制继续
              }
            }
          })
        }
        if (sameTerm) { //在同一个term，或是强制继续的
          that.setData({
            learnEndDate: that.data.yearThisMth + "-" + that.data.thisMonth + "-" + val,
            hideEndCal: true,
          })
        }
      }
    }
  },

  chooseEndDateNextMth(e) {
    var that = this;
    var val = e.currentTarget.dataset.value;
    var idx = parseInt(val) - 1;
    var selectTerm = that.checkTermNum(that.data.yearNextOneMth, that.data.nextOneMonth, val);
    var sameTerm = (selectTerm == that.data.termOfStartLearn);

    //所选时间不是假期
    if (that.data.dayListNextOneMth[idx].bgColor != '#f1f1f1') {
      //若跨term了
      if (!sameTerm) {
        wx.showModal({
          title: '注意',
          content: '您所选的日期涵盖了2个Term，中间有学校假期，您确定？',
          confirmText: '执意如此',
          cancelText: '重选日期',
          success: function (res) {
            if (res.confirm) {
              sameTerm = true;//强制继续
            }
          }
        })
      }
      if (sameTerm) { //在同一个term，或是强制继续的
        that.setData({
          learnEndDate: that.data.yearNextOneMth + "-" + that.data.nextOneMonth + "-" + val,
          hideEndCal: true,
        })
      }
    }
    
  },

  chooseEndDateNextTwoMth(e) {
    var that = this;
    var val = e.currentTarget.dataset.value;
    var idx = parseInt(val) - 1;
    var selectTerm = that.checkTermNum(that.data.yearNextTwoMth, that.data.nextTwoMonth, val);
    var sameTerm = (selectTerm == that.data.termOfStartLearn);

    //所选时间不是假期
    if (that.data.dayListNextTwoMth[idx].bgColor != '#f1f1f1') {
      //若跨term了
      if (!sameTerm) {
        wx.showModal({
          title: '注意',
          content: '您所选的日期涵盖了2个Term，中间有学校假期，您确定？',
          confirmText: '执意如此',
          cancelText: '重选日期',
          success: function (res) {
            if (res.confirm) {
              sameTerm = true;//强制继续
            }
          }
        })
      }
      if (sameTerm) { //在同一个term，或是强制继续的
        that.setData({
          learnEndDate: that.data.yearNextTwoMth + "-" + that.data.nextTwoMonth + "-" + val,
          hideEndCal: true,
        })
      }
    }
  },

  /*根据所选日期，首先找到termDate中同样的年份
    调用checkTermNum（），得到所选日期所处的term。
    如果所选日期在start，end间，则isHoliday为false，否则，视为holiday
  */
  isHoliday(selectYear, selectMonth, selectDay){
    var that = this;
    var year = parseInt(selectYear);
    var month = parseInt(selectMonth);
    var day = parseInt(selectDay);
    var yearIdx = 0;
    var isHoliday = true;
    var term = 0;

    for (var i = 0; i < 3; i++) {//总共3年数据,找到对应年份的数据
      if (year == termDate[i].year) {
        yearIdx = i;
        break;
      }
    } 

    term = that.checkTermNum(selectYear, selectMonth, selectDay);

    switch (term) {
      case 1:
        if ((month > termDate[yearIdx].term1.startMonth) && (month < termDate[yearIdx].term1.endMonth)){
          isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term1.startMonth) && (day >= termDate[yearIdx].term1.startDate)) {
            isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term1.endMonth) && (day <= termDate[yearIdx].term1.endDate)){
            isHoliday = false;
        } 
        break;
      case 2:
        if ((month > termDate[yearIdx].term2.startMonth) && (month < termDate[yearIdx].term2.endMonth)) {
          isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term2.startMonth) && (day >= termDate[yearIdx].term2.startDate)) {
          isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term2.endMonth) && (day <= termDate[yearIdx].term2.endDate)) {
          isHoliday = false;
        } 
        break;
      case 3:
        if ((month > termDate[yearIdx].term3.startMonth) && (month < termDate[yearIdx].term3.endMonth)) {
          isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term3.startMonth) && (day >= termDate[yearIdx].term3.startDate)) {
          isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term3.endMonth) && (day <= termDate[yearIdx].term3.endDate)) {
          isHoliday = false;
        } 
        break;
      case 4:
        if ((month > termDate[yearIdx].term4.startMonth) && (month < termDate[yearIdx].term4.endMonth)) {
          isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term4.startMonth) && (day >= termDate[yearIdx].term4.startDate)) {
          isHoliday = false;
        }
        else if ((month == termDate[yearIdx].term4.endMonth) && (day <= termDate[yearIdx].term4.endDate)) {
          isHoliday = false;
        } 
        break;
      default:
        break;
    }

    return isHoliday;
  },

  /*根据所选日期，首先找到termDate中同样年份的数据
    从term 1开始查找，如果未超过该term的结束日期，则为此term
    如果超过了今年term 4的日期，则视为下一年的term 1
  */
  checkTermNum (selectYear, selectMonth, selectDay) {
    var year = parseInt(selectYear);
    var month = parseInt(selectMonth);
    var day = parseInt(selectDay);
    var yearIdx = 0;
    var term = 0;

    for (var i = 0; i < 3; i++) {//总共3年数据,找到对应年份的数据
      if (year == termDate[i].year){
        yearIdx = i;
        break;
      }
    } 

    if ((month < termDate[yearIdx].term1.endMonth) || ((month == termDate[yearIdx].term1.endMonth) && (day <= termDate[yearIdx].term1.endDate))){
      term = 1;
    }
    else if ((month < termDate[yearIdx].term2.endMonth) || ((month == termDate[yearIdx].term2.endMonth) && (day <= termDate[yearIdx].term2.endDate))) {
      term = 2;
    }
    else if ((month < termDate[yearIdx].term3.endMonth) || ((month == termDate[yearIdx].term3.endMonth) && (day <= termDate[yearIdx].term3.endDate))) {
      term = 3;
    }
    else if ((month < termDate[yearIdx].term4.endMonth) || ((month == termDate[yearIdx].term4.endMonth) && (day <= termDate[yearIdx].term4.endDate))) {
      term = 4;
    }
    else {
      term = 1; //选择为当年之term 4结束后的日期，即下一年的term 1
    }

    return term;
  },

  /*根据page data的learnStartDate和learnEndDate，计算相差的天数
    根据天数得到周数，不满一周视为一周。
  */
  calcLearnWeeks(){
    var that = this;

    var startDate = that.data.learnStartDate;
    var endDate = that.data.learnEndDate;

    var startYear = startDate.substring(0,4);
    var startMonth = startDate.substring(5,7);
    var startDay = startDate.substring(8,10);
    
    var endYear = endDate.substring(0, 4);
    var endMonth = endDate.substring(5, 7);
    var endDay = endDate.substring(8, 10);

    var start = new Date();
    var end = new Date();

    start.setFullYear(startYear);
    start.setMonth(startMonth - 1);
    start.setDate(endDay);

    end.setFullYear(endYear);
    end.setMonth(endMonth);
    end.setDate(endDay);

    var gapDays = ((end.getTime() - start.getTime()) / (1000*3600*24)) + 1;

    var weeks = ((gapDays%7 == 0)?(gapDays/7):(Math.floor(gapDays/7)+1));

    return weeks;
  },

  /**  
  * 弹出框蒙层截断touchmove事件  
  */
  preventTouchMove: function () {
  },

})
