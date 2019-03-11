<template>
  <div id="app" v-on:click="pageClick">
    <router-view
      v-on:fInfoFun="sureInfoFun"
      v-on:loadingFun="loadingFun"
      v-on:moreTimeSetTime="moreTimeSetTime"
      v-on:stopMoreTime="stopMoreTimeFun"
      v-on:exitEvent="sOrCInfoFun"
      v-on:isInToken="IsInToken"
      v-bind:message="message" ref="child-cpt" />
    <div class="moreTimeBox" v-show="mTBoxDir">
      <div class="popContent">
        <p>{{moreTimeInfo}}</p>
        <button class="sureButton" v-on:click="boxSureFun('moreTime')">{{langFun(this.WL.text11)}}</button>
      </div>
    </div>
    <div class="errorInfoBox" v-show="eIBoxDir">
      <div class="popContent">
        <p>{{errorInfo}}</p>
        <button class="sureButton" v-on:click="boxSureFun('errorInfo')">{{langFun(this.WL.text11)}}</button>
      </div>
    </div>
    <div class="sOrCBox" v-show="sOrCBoxDir">
      <div class="popContent">
        <p>{{sOrCBoxInfo}}</p>
        <div class="cancelAndSrue">
          <div class="cancel" v-on:click="cancelFun('sOrC')">{{langFun(this.WL.text12)}}</div>
          <div class="sure" v-on:click="sureFun('sOrC')">{{langFun(this.WL.text11)}}</div>
        </div>
      </div>
    </div>
    <div class="loadingPage" v-show="loadingDir"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      eIBoxDir: false,
      errorInfo: '',
      errorReturnInfo: '',
      loadingDir: false,
      message: {},
      moreTimeInfo: '',
      moreTimer: 0,
      mTBoxDir: false,
      sOrCBoxCF: '',
      sOrCBoxDir: false,
      sOrCBoxInfo: ''
    }
  },
  methods: {
    boxSureFun (val1) {
      // 弹出框中确定按钮绑定事件
      if (val1 === 'errorInfo') {
        this.errorInfo = ''
        this.eIBoxDir = false
        if (this.errorReturnInfo !== '') {
          this.$refs['child-cpt'].gainErrorRetrun(this.errorReturnInfo)
        }
      } else if (val1 === 'moreTime') {
        this.moreTimeInfo = ''
        this.mTBoxDir = false
        this.moreTimer = -1
      }
    },
    cancelFun (val1) {
      // 选择弹出框中取消事件
      if (val1 === 'sOrC') {
        this.sOrCBoxCF = ''
        this.sOrCBoxInfo = ''
        this.sOrCBoxDir = false
      }
    },
    exitSuccessFun () {
      // 退出登录函数
      window.localStorage.setItem('wayMapToken', '')
      window.localStorage.setItem('wayMapAccountId', '')
      window.localStorage.setItem('wayMapLocationId', '')
      window.localStorage.setItem('wayMapLocationName', '')
      window.localStorage.setItem('wayMapTokenTime', '')
      window.localStorage.setItem('wayMapUserId', '')
      this.router.push('/')
    },
    IsInToken () {
      // 判断有无token，以及有效期
      var nowDateCommon = new Date()
      if (this.Gbl.wayMapToken === '' || this.Gbl.wayMapToken === 'null' || (this.Gbl.wayMapTokenTime - 600000) < (nowDateCommon.getTime() - 0)) {
        if (window.location.href.split('#/')[1] !== '') {
          this.router.push('/')
        }
      }
    },
    langFun (val) {
      return this.Gbl.LangFun(val, this.Gbl.wayMapUserLang)
    },
    loadingFun (val) {
      this.loadingDir = val
    },
    moreTimeSetTime () {
      // 超时定时器
      setTimeout(() => {
        if (this.moreTimer === -1) {
          this.moreTimer = 0
          this.boxSureFun('moreTime')
        } else if (this.moreTimer === 3) {
          this.sureInfoFun(['moreTime', this.Gbl.LangFun(this.WL.text140, this.Gbl.wayMapUserLang)])
          this.moreTimeSetTime()
        } else {
          this.moreTimer++
          this.moreTimeSetTime()
        }
      }, 1000)
    },
    pageClick () {
      // 点击页面其它部分
      if (this.$route.path !== '/') {
        // this.$refs['child-cpt'].$refs['myheader'].myList = false
      }
    },
    sOrCInfoFun (val1) {
      // 页面调用选择框
      this.sOrCBoxDir = true
      this.sOrCBoxCF = val1[1]
      this.sOrCBoxInfo = val1[0]
    },
    startFun () {
      // 获取屏幕高度
      var ele = document.getElementsByTagName('html')[0]
      var viewH = window.localStorage.getItem('wayMapLocationHeight')
      if (viewH === '' || (viewH + '') === 'null') {
        viewH = document.documentElement.clientHeight || document.body.clientHeight
        window.localStorage.setItem('wayMapLocationHeight', viewH)
      }
      var size = ((viewH - 0) / 100) * 10
      ele.style.fontSize = size + 'px'
    },
    stopMoreTimeFun () {
      // 停止超时定时器
      this.moreTimer = -1
    },
    sureInfoFun (val1) {
      // 子Vue超时弹框和错误弹框
      if (val1[0] === 'errorInfo') {
        this.errorInfo = val1[1]
        this.eIBoxDir = true
        if (val1.length === 3) {
          this.errorReturnInfo = val1[2]
        } else {
          this.errorReturnInfo = ''
        }
      } else if (val1[0] === 'moreTime') {
        this.moreTimeInfo = val1[1]
        this.mTBoxDir = true
      }
    },
    sureFun (val1) {
      if (val1 === 'sOrC') {
        if (this.sOrCBoxCF === 'exitLoading') {
          this.sOrCBoxCF = ''
          this.sOrCBoxInfo = ''
          this.sOrCBoxDir = false
          this.exitSuccessFun()
        } else if (this.sOrCBoxCF === 'submint') {
          this.$refs['child-cpt'].submintFun()
          this.sOrCBoxCF = ''
          this.sOrCBoxInfo = ''
          this.sOrCBoxDir = false
        } else if (this.sOrCBoxCF === 'markOk') {
          this.$refs['child-cpt'].markOk()
          this.sOrCBoxCF = ''
          this.sOrCBoxInfo = ''
          this.sOrCBoxDir = false
        } else if (this.sOrCBoxCF === 'goHome') {
          this.router.push('/home')
          this.sOrCBoxCF = ''
          this.sOrCBoxInfo = ''
          this.sOrCBoxDir = false
        } else if (this.sOrCBoxCF === 'goBack') {
          this.router.push(this.$refs['child-cpt'].headerInfo.goBackUrl)
          this.sOrCBoxCF = ''
          this.sOrCBoxInfo = ''
          this.sOrCBoxDir = false
        }
      }
    }
  },
  watch: {},
  mounted () {
    this.startFun()
    // 判断有无token，以及有效期
    var nowDateCommon = new Date()
    if (this.Gbl.wayMapToken === '' || this.Gbl.wayMapToken === 'null' || (this.Gbl.wayMapTokenTime - 600000) < (nowDateCommon.getTime() - 0)) {
      if (window.location.href.split('#/')[1] !== '') {
        this.router.push('/')
      }
    }
    console.log(this.Gbl.LangFun)
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  position: absolute;
  left:0;
  top:0;
}
#app>.moreTimeBox,
#app>.errorInfoBox {
  width:100%;
  height: 100%;
  background-color: rgba(238,233,230,0.8);
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 20;
}
#app>.moreTimeBox>.popContent,
#app>.errorInfoBox>.popContent {
  width: 84.3%;
  height: 2.5rem;
  background-color: #FFFFFF;
  border-radius: 0.125rem;
  overflow: hidden;
  margin: 0 auto;
  margin-top: 1rem;
}
#app>.moreTimeBox>.popContent>p,
#app>.errorInfoBox>.popContent>p {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 1.666rem;
  text-align: center;
  line-height: 0.5rem;
  padding-top: 0.4rem;
  font-size: 17px;
  color: #808080;
}
#app>.moreTimeBox>.popContent>.sureButton,
#app>.errorInfoBox>.popContent>.sureButton {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.83rem;
  line-height: 0.83rem;
  text-align: center;
  border: none;
  border-top: 1px solid #bfbfbf;
  color: #23a660;
  font-size: 15px;
}
#app>.sOrCBox{
  width:100%;
  height: 100%;
  background-color: rgba(238,233,230,0.8);
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 20;
}
#app>.sOrCBox>.popContent{
  width:84.3%;
  height: 2.5rem;
  background-color: #FFFFFF;
  border-radius: 0.125rem;
  overflow: hidden;
  margin:0 auto;
  margin-top: 1rem;
}
#app>.sOrCBox>.popContent>p{
  width:100%;
  height: 1.666rem;
  text-align: center;
  line-height: 1.666rem;
  font-size: 17px;
  color:#808080;
}
#app>.sOrCBox>.popContent>.cancelAndSrue{
  width:100%;
  height: 0.833rem;
}
#app>.sOrCBox>.popContent .cancel{
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width:50%;
  height: 0.833rem;
  line-height: 0.833rem;
  text-align: center;
  border-top: 1px solid #bfbfbf;
  color:#808080;
  float: left;
  font-size: 14px;
}
#app>.sOrCBox>.popContent .sure{
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width:50%;
  height: 0.833rem;
  line-height: 0.833rem;
  text-align: center;
  color:#FFFFFF;
  float: right;
  background-color: #74bb88;
  font-size: 14px;
}
#app .loadingPage {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../static/img/loadingPic.gif);
  background-color: rgba(0, 0, 0, 0.5);
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1000;
}
</style>
