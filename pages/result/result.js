
var util = require('../../utils/util.js');

Page({
  data: {
    rate:0
  },
  onLoad: function () {
    this.getCurrencyRate();
  },

  testInput() {
    console.log('input box has been clicked')
  },

  getCurrencyRate() {
    var self = this;
    var now = new Date();
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
    });
  },

})