<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="orderCode">
        <span>{{this.Gbl.LangFun(this.WL.text15, this.Gbl.wayMapUserLang)}}:</span>
        <input type="text" class="inputOrder" ref="inputorder" v-model="inputOrder" disabled="disabled" />
      </div>
      <div class="selectedOrder">
        <div class="alreadyOrder" v-bind:class="{active:alreadyDisplay}" v-on:click="alreadyClick">{{this.Gbl.LangFun(this.WL.text32, this.Gbl.wayMapUserLang)}}</div>
        <div class="surplusOrder" v-bind:class="{active:!alreadyDisplay}" v-on:click="surplusClick">{{this.Gbl.LangFun(this.WL.text33, this.Gbl.wayMapUserLang)}}</div>
      </div>
      <ul class="orderList">
        <li class="item" v-for="(site,index) in orderList" v-bind:key="'index'+index">
          <p><span class="firstSpan">{{index+1}}</span><span>{{this.Gbl.LangFun(this.WL.text79, this.Gbl.wayMapUserLang)}}:{{site.orderNumber}}</span></p>
        </li>
        <li v-if="orderList.length==0" class="noData">{{this.Gbl.LangFun(this.WL.text44, this.Gbl.wayMapUserLang)}}</li>
      </ul>
      <div class="scanAndSubmint">
        <div class="continueSan" v-on:click="continueClick">{{this.Gbl.LangFun(this.WL.text25, this.Gbl.wayMapUserLang)}}</div>
        <div class="submintAudit" v-on:click="submintClick">{{this.Gbl.LangFun(this.WL.text26, this.Gbl.wayMapUserLang)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'bigBagDeliveryList',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/bigBagDeliveryDetail?orderId=' + this.Gbl.GainUrlValueFun('orderId'),
        homeDir: true,
        logoDir: false,
        homePopCtr: true,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text49, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      alreadyDisplay: true,
      alreadyList: [],
      inputOrder: this.Gbl.GainUrlValueFun('orderId'),
      isCanSubmit: true,
      orderList: [],
      surplusList: []
    }
  },
  props: ['message'],
  components: {
    'my-header': headerCpt
  },
  methods: {
    alreadyClick () {
      this.alreadyDisplay = true
      this.orderList = this.alreadyList
    },
    continueClick () {
      this.router.push(this.headerInfo.goBackUrl)
    },
    exitFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.exitTipText, this.Gbl.wayMapUserLang), 'exitLoading'])
    },
    gainErrorRetrun (val1) {
      if (val1 === 'errorCode') {
        this.router.push('/')
      }
    },
    gainOrderDetail () {
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
            console.log(response.data)
            var dataList = response.data.orderList
            var dataListLen = response.data.orderList.length
            var alreadyList = []
            var surplusList = []
            for (var i = 0; i < dataListLen; i++) {
              if (dataList[i].quantityReceived !== 1) {
                surplusList.push(dataList[i])
              } else {
                alreadyList.push(dataList[i])
              }
            }
            this.alreadyList = alreadyList
            this.surplusList = surplusList
            this.alreadyClick()
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
    submintClick () {
      if (this.isCanSubmit) {
        this.isCanSubmit = false
        this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.submitTipText1, this.Gbl.wayMapUserLang), 'submint'])
      }
    },
    submintFun () {
      // 2秒后恢复可点击提交审核
      setTimeout(() => {
        this.isCanSubmit = true
      }, 2000)
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/submitST'
      var veriableList = JSON.stringify({
        'token': this.Gbl.wayMapToken,
        'userId': this.Gbl.wayMapUserId,
        'tranid': this.orderCode,
        'transType': 'ST_BIG'
      })
      this.axios({
        method: 'post',
        url: loginUrl1,
        data: veriableList,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then((response) => {
        console.log(response)
        // 停止超时计时
        this.$emit('stopMoreTime', '')
        // 结束加载图
        this.$emit('loadingFun', false)
        if ((response.status + '') === '200') {
          if ((response.data.status + '') === '200') {
            var downName = this.Gbl.LangFun(this.WL.text67, this.Gbl.wayMapUserLang)
            this.router.push('/successResult?downUrl=deliveryTaskSearch&downName=' + encodeURIComponent(downName))
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
    surplusClick () {
      this.alreadyDisplay = false
      this.orderList = this.surplusList
    }
  },
  watch: {},
  mounted () {
    this.$emit('isInToken')
    this.gainOrderDetail()
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
  height: 8rem;
  overflow-y: scroll;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
}
.pageVM>.content>.orderCode {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.416rem;
  line-height: 0.354rem;
  font-size: 17px;
  color: #3f3f3f;
  text-align: left;
}

.pageVM>.content>.orderCode>span {
  display: inline-block;
  width: auto;
  height: 0.416rem;
  line-height: 0.416rem;
  font-size: 17px;
  color: #3f3f3f;
  float: left;
  margin-left: 5%;
}

.pageVM>.content>.orderCode>.inputOrder {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 60%;
  height: 0.416rem;
  line-height: 0.354rem;
  outline: none;
  border: 1px solid #bfbfbf;
  border-radius: 0.083rem;
  font-size: 14px;
  color: #3f3f3f;
  float: left;
  margin-right: 5%;
  text-align: left;
}

.pageVM>.content>.selectedOrder {
  width: 100%;
  height: 0.479rem;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin-top: 0.2rem;
}

.pageVM>.content>.selectedOrder>.alreadyOrder {
  width: 43.7%;
  height: 0.479rem;
  border-radius: 0.479rem;
  line-height: 0.479rem;
  text-align: center;
  background-color: #d8d8d8;
  font-size: 14px;
  color: #494949;
  float: left;
  margin-left: 3%;
}

.pageVM>.content>.selectedOrder>.surplusOrder {
  width: 43.7%;
  height: 0.479rem;
  border-radius: 0.479rem;
  line-height: 0.479rem;
  text-align: center;
  background-color: #d8d8d8;
  font-size: 14px;
  color: #494949;
  float: right;
  margin-right: 3%;
}

.pageVM>.content>.selectedOrder>.alreadyOrder.active,
.pageVM>.content>.selectedOrder>.surplusOrder.active {
  background-color: #74bc8a;
  color: #FFFFFF;
}

.pageVM>.content>.orderList {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 4.8rem;
  border-top: 1px solid transparent;
  text-align: center;
  overflow: scroll;
  margin-top: 0.1rem;
}
.pageVM>.content .item {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 87.5%;
  height: auto;
  border-radius: 0.083rem;
  background-color: #f3f5f4;
  margin: 0 auto;
  position: relative;
  margin-bottom: 0.083rem;
}

.pageVM>.content .item p {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  display: -webkit-flex;
  display: flex;
  justify-content: flex-start;
}

.pageVM>.content .item p span {
  display: inline-block;
  width: auto;
  height: 0.458rem;
  line-height: 0.458rem;
  font-size: 14px;
  color: #747675;
}

.pageVM>.content .item p .firstSpan {
  width: 0.458rem;
  background-color: #00AE29;
  color: #FFFFFF;
}

.pageVM>.content .noData {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 87.5%;
  height: 1.687rem;
  border: 1px solid #3f3f3f;
  border-radius: 0.083rem;
  margin: 0 auto;
  position: relative;
  margin-bottom: 0.083rem;
  text-align: center;
  line-height: 1.395rem;
  font-size: 14px;
  color: #747675;
}

.pageVM>.content>.scanAndSubmint {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.895rem;
  border-top: 1px solid transparent;
  margin-top: 0.520rem;
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
  float: left;
  margin-left: 7.1%;
}

.pageVM>.content .submintAudit {
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
  float: right;
  margin-right: 7.1%;
}

.pageVM>.content .continueSan:active,
.pageVM>.content .submintAudit:active {
  background-image: -webkit-linear-gradient(top, rgb(81, 244, 189) 0%, rgb(18, 219, 130) 100%);
}
</style>
