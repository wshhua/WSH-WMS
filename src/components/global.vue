<script>
// 公共地址URL
// const commonUrl = '/wms'
// 测试接口
const commonUrl = 'http://120.76.203.182/wms'
// 公共变量
let wayMapUserName = window.localStorage.getItem('wayMapUserName') + ''
let wayMapToken = window.localStorage.getItem('wayMapToken') + ''
let wayMapAccountId = window.localStorage.getItem('wayMapAccountId') + ''
let wayMapLocationId = window.localStorage.getItem('wayMapLocationId') + ''
let wayMapLocationName = window.localStorage.getItem('wayMapLocationName') + ''
let wayMapTokenTime = window.localStorage.getItem('wayMapTokenTime') + ''
let wayMapUserId = window.localStorage.getItem('wayMapUserId') + ''
let wayMapUserLang = window.localStorage.getItem('wayMapUserLang') + ''
let commonVariaList = '?token=' + wayMapToken + '&userId=' + wayMapUserId
let tokenErrorDir = false
// 测试函数
let testFun = (val) => {
  return val
}
// 获取URL变量传值
let GainUrlValueFun = (val) => {
  var pageUrl = (window.location.href + '').split('#/')[1]
  var returnValue = ''
  if (pageUrl.indexOf('?') > 0) {
    var variable = pageUrl.split('?')[1]
    if (variable.indexOf('&') > 0) {
      var arguList = []
      if (variable.indexOf('&&') > 0) {
        arguList = variable.split('&&')
      } else {
        arguList = variable.split('&')
      }
      for (var i = 0; i < arguList.length; i++) {
        if (arguList[i].indexOf('=') > 0 && arguList[i].split('=')[0] === val) {
          returnValue = arguList[i].split('=')[1]
          break
        } else if (i === (arguList.length - 1)) {
          returnValue = ''
        }
      }
    } else {
      if (variable.indexOf('=') > 0 && variable.split('=')[0] === val) {
        returnValue = variable.split('=')[1]
      } else {
        returnValue = ''
      }
    }
  } else {
    returnValue = ''
  }
  return returnValue
}
// 中英文切换
let LangFun = (val1, val2) => {
  if (val2 === 'English') {
    return val1[1]
  } else {
    return val1[0]
  }
}
export default {
  commonUrl,
  commonVariaList,
  wayMapUserName,
  wayMapToken,
  wayMapAccountId,
  wayMapLocationId,
  wayMapLocationName,
  wayMapTokenTime,
  wayMapUserId,
  wayMapUserLang,
  tokenErrorDir,
  GainUrlValueFun,
  LangFun,
  testFun
}
</script>
