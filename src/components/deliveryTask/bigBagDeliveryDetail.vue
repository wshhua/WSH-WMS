<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="item1">
        <span>{{this.Gbl.LangFun(this.WL.text15, this.Gbl.wayMapUserLang)}}:</span>
        <input type="text" class="inputOrder" ref="inputorder" v-model="inputOrder" v-on:keydown.enter="input1EnterFun"
          v-bind:placeholder="this.Gbl.LangFun(this.WL.text78, this.Gbl.wayMapUserLang)" />
      </div>
      <div class="item2">
        <span>{{this.Gbl.LangFun(this.WL.text79, this.Gbl.wayMapUserLang)}}:</span>
        <input type="text" class="inputBoxMark" ref="inputboxmark" v-model="inputBoxMark" v-on:keydown.enter="input2EnterFun"
          v-bind:placeholder="this.Gbl.LangFun(this.WL.text78, this.Gbl.wayMapUserLang)" />
      </div>
      <div class="item4">
        <span>{{this.Gbl.LangFun(this.WL.text54, this.Gbl.wayMapUserLang)}}:</span>
        <span>{{progressNum}}</span>
        <span>/</span>
        <span>{{totalNum}}</span>
      </div>
      <div class="scanAndSubmint">
        <a class="continueSan" v-on:click="goListFun">{{this.Gbl.LangFun(this.WL.text24, this.Gbl.wayMapUserLang)}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'bigBagDeliveryDetail',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/deliveryTaskSearch',
        homeDir: true,
        logoDir: false,
        homePopCtr: true,
        backPopCtr: true,
        title: this.Gbl.LangFun(this.WL.text49, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      canGoList: false,
      inputOrder: '',
      inputBoxMark: '',
      isCanSubmit: true,
      orderList: [],
      progressNum: 0,
      totalNum: 0
    }
  },
  props: ['message'],
  components: {
    'my-header': headerCpt
  },
  methods: {
    exitFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.exitTipText, this.Gbl.wayMapUserLang), 'exitLoading'])
    },
    gainErrorRetrun (val1) {
      if (val1 === 'errorCode') {
        this.router.push('/')
      }
    },
    gainOrderDetail (val1) {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTransationItemST' + this.Gbl.commonVariaList + '&tranid=' + this.inputOrder + '&orderNumber='
      this.axios({
        method: 'get',
        url: loginUrl1,
        data: '',
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then((response) => {
        console.log(response)
        // 停止超时计时
        this.$emit('stopMoreTime', '')
        // 结束加载图
        this.$emit('loadingFun', false)
        if ((response.status + '') === '200') {
          if ((response.data.status + '') === '200') {
            if (val1 === 'verify') {
              this.router.push('/bigBagDeliveryList?orderId=' + this.inputOrder)
            } else if (response.data.username !== '0' && response.data.username !== this.Gbl.wayMapUserName) {
              var lockedInfo = this.Gbl.LangFun(this.WL.text116, this.Gbl.wayMapUserLang) + response.data.username + this.Gbl.LangFun(this.WL.text117, this.Gbl.wayMapUserLang)
              this.$emit('fInfoFun', ['errorInfo', lockedInfo])
            } else {
              this.inputBoxMark = ''
              this.orderList = response.data.orderList
              this.totalNum = response.data.sum
              this.progressNum = response.data.scaned
              this.$refs.inputboxmark.focus()
            }
          } else if ((response.data.errorCode + '') === '4000' || (response.data.errorCode + '') === '4001' || (response.data.errorCode + '') === '4002') {
            this.$emit('fInfoFun', ['errorInfo', response.data.msg, 'errorCode'])
          } else {
            console.log(response.data)
          }
        } else {
          this.$emit('fInfoFun', ['errorInfo', response.msg])
        }
      }).catch((error) => {
        console.log(error)
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text141, this.Gbl.wayMapUserLang)])
      })
    },
    goBackFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text94, this.Gbl.wayMapUserLang), 'goBack'])
    },
    goHomeFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text95, this.Gbl.wayMapUserLang), 'goHome'])
    },
    goListFun () {
      if (this.inputOrder === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text101, this.Gbl.wayMapUserLang)])
      } else {
        this.gainOrderDetail('verify')
      }
    },
    input1EnterFun () {
      // 获取单号详情
      this.gainOrderDetail('gain')
    },
    input2EnterFun () {
      var orderListLen = this.orderList.length
      for (var i = 0; i < orderListLen; i++) {
        if (this.orderList[i].orderNumber === this.inputBoxMark) {
          if (this.orderList[i].quantityReceived !== 1) {
            this.submintFun()
          } else {
            this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text124, this.Gbl.wayMapUserLang)])
          }
          break
        } else if (i === (orderListLen - 1)) {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text125, this.Gbl.wayMapUserLang)])
        }
      }
    },
    submintFun () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTransationItemST' + this.Gbl.commonVariaList + '&tranid=' + this.inputOrder + '&orderNumber=' + this.inputBoxMark
      this.axios({
        method: 'get',
        url: loginUrl1,
        data: '',
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then((response) => {
        console.log(response)
        // 停止超时计时
        this.$emit('stopMoreTime', '')
        // 结束加载图
        this.$emit('loadingFun', false)
        if ((response.status + '') === '200') {
          if ((response.data.status + '') === '200') {
            console.log(response.data)
            this.inputBoxMark = ''
            this.orderList = response.data.orderList
            this.totalNum = response.data.sum
            this.progressNum = response.data.scaned
            this.$refs.inputboxmark.focus()
          } else if ((response.data.errorCode + '') === '4000' || (response.data.errorCode + '') === '4001' || (response.data.errorCode + '') === '4002') {
            this.$emit('fInfoFun', ['errorInfo', response.data.msg, 'errorCode'])
          } else {
            console.log(response.data)
          }
        } else {
          this.$emit('fInfoFun', ['errorInfo', response.msg])
        }
      }).catch((error) => {
        console.log(error)
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text141, this.Gbl.wayMapUserLang)])
      })
    }
  },
  watch: {},
  mounted () {
    this.$emit('isInToken')
    if (this.Gbl.GainUrlValueFun('orderId') !== '') {
      // 当URLOrderId不为空的时候做请求
      this.inputOrder = this.Gbl.GainUrlValueFun('orderId')
      this.gainOrderDetail()
    }
    console.log(this.message)
    console.log(this.Gbl)
  }
}

</script>

<style scoped>
.pageVM {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url(../../../static/img/pageBg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.pageVM .content {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid transparent;
  width: 100%;
  height: 8.458rem;
  overflow-y: scroll;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.pageVM>.content>.item1,
.pageVM>.content>.item2,
.pageVM>.content>.item4 {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 87.5%;
  height: auto;
  margin-bottom: 0.2rem;
  display: -webkit-flex;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.pageVM>.content>.item1>span,
.pageVM>.content>.item2>span,
.pageVM>.content>.item4>span:nth-child(1) {
  display: inline-block;
  width: 30%;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 17px;
  color: #3f3f3f;
}
.pageVM>.content>.item4>span:nth-child(2),
.pageVM>.content>.item4>span:nth-child(3),
.pageVM>.content>.item4>span:nth-child(4) {
  display: inline-block;
  width: auto;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 17px;
  color: #3f3f3f;
}
.pageVM>.content>.item1>input,
.pageVM>.content>.item2>input {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 60%;
  height: 0.6rem;
  line-height: 0.6rem;
  outline: none;
  border: 1px solid #bfbfbf;
  border-radius: 0.083rem;
  font-size: 14px;
  color: #3f3f3f;
  margin-right: 5%;
  text-align: left;
}

.pageVM>.content .item1,
.pageVM>.content .item2,
.pageVM>.content .item4 {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 87.5%;
  height: auto;
  margin: 0 auto;
  position: relative;
  margin-top: 0.27rem;
}

.pageVM>.content>.scanAndSubmint {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.895rem;
  border-top: 1px solid transparent;
  margin-top: 0.1rem;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pageVM>.content .continueSan {
  display: inline-block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 38.1%;
  height: 0.895rem;
  line-height: 0.895rem;
  font-size: 17px;
  border: 1px solid #bfbfbf;
  text-align: center;
  color: #595959;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
}

.pageVM>.content .continueSan:active,
.pageVM>.content .submintAudit:active {
  background-image: -webkit-linear-gradient(top, rgb(81, 244, 189) 0%, rgb(18, 219, 130) 100%);
}
</style>
