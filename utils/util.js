const termDate2018 = [{ min: '01/29', max: '03/29' }, { min: '04/16', max: '06/29' }, { min: '07/16', max: '09/26' }, { min: '10/08', max: '12/21' }]
const termDate2019 = [{ min: '01/29', max: '04/05' }, { min: '04/23', max: '06/28' }, { min: '07/15', max: '09/20' }, { min: '10/07', max: '12/20' }]
const termDate2020 = [{ min: '01/28', max: '03/27' }, { min: '04/14', max: '06/26' }, { min: '07/13', max: '09/18' }, { min: '10/05', max: '12/18' }]

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = (date, separator) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join(separator)
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getAge = function (birthDate, targetDate) {//both parameters are string
  var age = parseInt(targetDate.substring(0,4)) - parseInt(birthDate.substring(0,4));
  var m = parseInt(targetDate.substring(5, 7)) - parseInt(birthDate.substring(5, 7));
  if (m < 0 || (m === 0 && parseInt(targetDate.substring(8, 10)) < parseInt(birthDate.substring(8, 10)))) {
    age--;
  }
  console.log('util getAge被调用')
  console.log()
  return age;
}

const termCalc = function (targetDate) {
  var targetYr = targetDate.substring(0,4)

}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  getAge:getAge,
}
