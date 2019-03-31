//app.js
var util = require('/utils/util.js');
const appKey = '0f045b3f9b0e6cb1';

App({
  onLaunch: function () {
    var now = new Date();
    now = util.formatDate(now, '-');

    if (this.globalData.readCurrency) {
      //this.globalData.curRate = this.getCurRate();
      //console.log('readCurrency为true，汇率接口调用')
      this.globalData.today = now;
      this.globalData.readCurrency = false;
    }
    else if(this.globalData.today != now){
      //this.globalData.curRate = this.getCurRate();
      //console.log('不是同一天，汇率接口调用')
      this.globalData.today = now;
    }
  },

  getCurRate: function(){
    /*极速API接口调用,返回格式示例：
    {
    "status": "0",
    "msg": "ok",
    "result": {
        "from": "CNY",
        "to": "USD",
        "fromname": "人民币",
        "toname": "美元",
        "updatetime": "2015-10-26 16:56:22",
        "rate": "0.1574",
        "camount": "1.574"
      }
    }
    */
    var self = this;
    wx.request({
      url: 'https://api.jisuapi.com/exchange/convert?appkey=' + appKey + '&from=AUD&to=CNY&amount=1',
      header: {
        "contentType": "application/json",
        "dataType": "json"
      },
      success: function (res) {
        var status = parseInt(res.data.status);
        if (status == 0) {//返回成功
          self.globalData.curRate = res.data.result.rate;
          console.log('get rate successfully, it is 1:' + self.globalData.curRate);
        }
        else {
          console.log('request sent successfully but not get data')
        }
      },
      fail: function (res) {
        console.log('request failure')
      }
    });
  },

  globalData: {
    schoolLevelIdx: 0,
    schoolFee: [288, 382, 428], //from DET - [Primary, Junior High, Senior High]
    curRate:0,
    readCurrency:true,
    today:'2018-08-08',
    schoolLevelIdx: 0, // 0 - PS; 1 - junior; 2 senior
    learningWeeks: 0,
    learningDays: 0,
    learnLevel:'',
    startDate: '',
    endDate:'',
    termStart: 0,
    termEnd: 0,
  }
})