<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <p class="orderCode"><span>{{this.Gbl.LangFun(this.WL.text15, this.Gbl.wayMapUserLang)}}:{{orderCode}}</span></p>
      <div class="pageControl" v-if="orderList.length>0">
        <div class="upPage" v-on:click="goDataPage(pageIndex>1?pageIndex-1:pageIndex)">{{this.Gbl.LangFun(this.WL.text29, this.Gbl.wayMapUserLang)}}</div>
        <div class="goText">{{this.Gbl.LangFun(this.WL.text31, this.Gbl.wayMapUserLang)}}</div>
        <input type="number" class="goPageIndex" v-model="goPageIndex" />
        <div class="goButton" v-on:click="goDataPage(goPageIndex)"></div>
        <div class="pageNum">({{pageIndex}}/{{totalPageNum}}{{this.Gbl.LangFun(this.WL.pageText, this.Gbl.wayMapUserLang)}})</div>
        <div class="downPage" v-on:click="goDataPage(pageIndex<totalPageNum?pageIndex+1:pageIndex)">{{this.Gbl.LangFun(this.WL.text30, this.Gbl.wayMapUserLang)}}</div>
      </div>
      <div class="selectedOrder">
        <div class="alreadyOrder" ref="already-button" v-bind:class="{active:alreadyDisplay}" v-on:click="alreadyClick">{{this.Gbl.LangFun(this.WL.text61, this.Gbl.wayMapUserLang)}}</div>
        <div class="surplusOrder" ref="surplus-button" v-bind:class="{active:!alreadyDisplay}" v-on:click="surplusClick">{{this.Gbl.LangFun(this.WL.text62, this.Gbl.wayMapUserLang)}}</div>
      </div>
      <ul class="orderList">
        <li class="item" v-for="(site,index) in orderList" v-bind:key="'index'+index">
          <div class="itemInfo">
            <div class="itemSUK">{{listText.text1}}:{{site.item_name}}</div>
            <div class="itemName">{{site.item_description}}</div>
            <div class="itemBatch" v-show="site.lot_number!=''">{{listText.text2}}:{{site.lot_number}}</div>
            <div class="itemNumInfo">
              <div class="itemGoodsShelf">{{site.bin_number}}</div>
              <div class="itemNum">{{site.quantity_scaned}}</div>
              <div class="itemOthers">{{site.result}}</div>
            </div>
          </div>
          <div class="itemIndex">{{index+1}}</div>
          <div class="leftLine"></div>
          <div class="rightLine"></div>
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
  name: 'allotListOut',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/allotDetailOut?orderId=' + this.Gbl.GainUrlValueFun('orderId') + '&orderType=' + this.Gbl.GainUrlValueFun('orderType'),
        homeDir: true,
        logoDir: false,
        homePopCtr: true,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text38, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      listText: {
        text1: this.Gbl.LangFun(this.WL.skuText, this.Gbl.wayMapUserLang),
        text2: this.Gbl.LangFun(this.WL.text19, this.Gbl.wayMapUserLang)
      },
      alreadyDisplay: true,
      alreadyList: [],
      goPageIndex: 1,
      isCanSubmit: true,
      orderCode: this.Gbl.GainUrlValueFun('orderId'),
      orderList: [],
      orderType: this.Gbl.GainUrlValueFun('orderType'),
      pageIndex: 1,
      surplusList: [],
      totalListData: [],
      totalPageNum: 1
    }
  },
  props: ['message'],
  components: {
    'my-header': headerCpt
  },
  methods: {
    alreadyClick () {
      this.alreadyDisplay = true
      this.totalPageNum = Math.ceil(this.alreadyList.length / 10)
      this.gainDataPageList(1, this.alreadyList)
    },
    continueClick () {
      this.router.push(this.headerInfo.goBackUrl)
    },
    exitFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.exitTipText, this.Gbl.wayMapUserLang), 'exitLoading'])
    },
    gainDataPageList (val1, val2) {
      var dataList = []
      var val2Len = val2.length
      for (var i = ((val1 - 1) * 10); i < val2Len; i++) {
        dataList.push(val2[i])
        if (i === val1 * 10 + 9) {
          break
        }
      }
      this.orderList = dataList
      this.pageIndex = val1
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
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTxSubmitDetail' + this.Gbl.commonVariaList + '&tranid=' + this.orderCode + '&transactionType=' + this.orderType
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
            var retData = response.data.result
            console.log(retData)
            this.totalListData = retData
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
    goDataPage (val1) {
      if (this.alreadyDisplay) {
        this.gainDataPageList(val1, this.alreadyList)
      } else {
        this.gainDataPageList(val1, this.surplusList)
      }
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
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/submitTransaction?entry=OUT'
      var veriableList = JSON.stringify({
        'token': this.Gbl.wayMapToken,
        'userId': this.Gbl.wayMapUserId,
        'transactionId': this.orderCode,
        'transactionType': this.orderType,
        'location': this.Gbl.wayMapLocationId
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
            var downName = this.Gbl.LangFun(this.WL.text66, this.Gbl.wayMapUserLang)
            this.router.push('/successResult?downUrl=allotSearchOut&downName=' + encodeURIComponent(downName))
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
      this.totalPageNum = Math.ceil(this.surplusList.length / 10)
      this.gainDataPageList(1, this.surplusList)
    }
  },
  watch: {
    goPageIndex () {
      if (this.goPageIndex < 1) {
        this.goPageIndex = 1
      } else if (this.goPageIndex > this.totalPageNum) {
        this.goPageIndex = this.totalPageNum
      }
    },
    totalListData () {
      this.alreadyList = []
      this.surplusList = []
      var newAlreadyList = this.totalListData.submitted
      var newSurplusList = this.totalListData.notComplete
      for (var i = 0; i < newAlreadyList.length; i++) {
        this.alreadyList.push({
          item_name: newAlreadyList[i].item_name ? newAlreadyList[i].item_name : '',
          item_description: newAlreadyList[i].item_description ? newAlreadyList[i].item_description : '',
          lot_number: newAlreadyList[i].lot_number ? newAlreadyList[i].lot_number : '',
          bin_number: newAlreadyList[i].bin_number ? newAlreadyList[i].bin_number : '',
          quantity_scaned: this.Gbl.LangFun(this.WL.text115, this.Gbl.wayMapUserLang) + '：' + (newAlreadyList[i].quantity ? newAlreadyList[i].quantity : '0'),
          result: ''
        })
      }
      for (var j = 0; j < newSurplusList.length; j++) {
        this.surplusList.push({
          item_name: newSurplusList[j].item_name ? newSurplusList[j].item_name : '',
          item_description: newSurplusList[j].item_description ? newSurplusList[j].item_description : '',
          lot_number: newSurplusList[j].lot_number ? newSurplusList[j].lot_number : '',
          bin_number: newSurplusList[j].bin_number ? newSurplusList[j].bin_number : '',
          quantity_scaned: this.Gbl.LangFun(this.WL.text113, this.Gbl.wayMapUserLang) + '：' + ((newSurplusList[j].quantity_fulfilled - 0) + (newSurplusList[j].quantity_scaned - 0)),
          result: this.Gbl.LangFun(this.WL.text114, this.Gbl.wayMapUserLang) + '：' + ((newSurplusList[j].quantity - 0) - ((newSurplusList[j].quantity_fulfilled - 0) + (newSurplusList[j].quantity_scaned - 0)))
        })
      }
      this.$refs['already-button'].click()
    }
  },
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
.pageVM>.content {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid transparent;
  width: 100%;
  height: 8rem;
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

.pageVM>.content>.orderCode>span:nth-child(1) {
  display: inline-block;
  width: auto;
  height: 0.416rem;
  line-height: 0.354rem;
  font-size: 17px;
  color: #3f3f3f;
  float: left;
  margin-left: 5%;
}

.pageVM>.content>.orderCode>span:nth-child(2) {
  display: inline-block;
  width: auto;
  height: 0.416rem;
  line-height: 0.354rem;
  font-size: 14px;
  color: #3f3f3f;
  float: right;
  margin-right: 5%;

}

.pageVM>.content>.pageControl {
  width: 100%;
  height: 0.5rem;
  margin: 0.145rem 0 0.062rem 0;
}

.pageVM>.content>.pageControl>.upPage {
  width: 17%;
  height: 0.479rem;
  line-height: 0.479rem;
  font-size: 14px;
  text-align: center;
  color: #333333;
  border: 1px solid #9f9f9d;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  float: left;
  margin-left: 5%;
}

.pageVM>.content>.pageControl>.goText {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 13.4%;
  height: 0.479rem;
  line-height: 0.479rem;
  text-align: right;
  padding-right: 2px;
  font-size: 14px;
  color: #333333;
  float: left;
}

.pageVM>.content>.pageControl>.goPageIndex {
  width: 11.5%;
  height: 0.479rem;
  line-height: 0.479rem;
  border: 1px solid #9e9e9e;
  text-align: center;
  font-size: 14px;
  color: #333333;
  float: left;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  text-align: center;
}

.pageVM>.content>.pageControl>.goButton {
  width: 8.75%;
  height: 0.479rem;
  float: left;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(../../../static/img/searchPic.png);
  background-size: 71% auto;
}

.pageVM>.content>.pageControl>.pageNum {
  width: 19%;
  height: 0.479rem;
  line-height: 0.479rem;
  font-size: 14px;
  text-align: left;
  color: #333333;
  float: left;
}

.pageVM>.content>.pageControl>.downPage {
  width: 17%;
  height: 0.479rem;
  line-height: 0.479rem;
  font-size: 14px;
  text-align: center;
  color: #333333;
  border-radius: 0.083rem;
  border: 1px solid #9f9f9d;
  background-color: #FFFFFF;
  float: right;
  margin-right: 5%;
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
  border: 1px solid #3f3f3f;
  border-top: none;
  border-radius: 0.083rem;
  margin: 0 auto;
  position: relative;
  margin-top: 0.27rem;
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

.pageVM>.content .itemInfo {
  width: 95%;
  height: auto;
  min-height: 1.645rem;
  margin-left: 2%;
  border: 1px solid transparent;
}

.pageVM>.content .itemSUK {
  width: 100%;
  height: 0.458rem;
  line-height: 0.458rem;
  font-size: 14px;
  text-align: left;
  color: #3f3f41;
  overflow: hidden;
  margin-top: 0.1rem;
}

.pageVM>.content .itemName {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 14px;
  text-align: left;
  color: #3f3f41;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pageVM>.content .itemBatch {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 14px;
  text-align: left;
  color: #3f3f41;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pageVM>.content .itemNumInfo {
  width: 100%;
  height: 0.25rem;
  margin-top: 0.104rem;
  margin-bottom: 0.1rem;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.pageVM>.content .itemGoodsShelf {
  width: auto;
  height: 0.25rem;
  line-height: 0.25rem;
  color: #3f3f41;
  font-size: 12px;
}

.pageVM>.content .itemNum {
  width: auto;
  height: 0.25rem;
  line-height: 0.25rem;
  color: #3f3f41;
  font-size: 12px;
}

.pageVM>.content .itemOthers {
  width: auto;
  height: 0.25rem;
  line-height: 0.25rem;
  color: #3f3f41;
  font-size: 12px;
}

.pageVM>.content .itemIndex {
  width: 0.229rem;
  height: 0.25rem;
  text-align: center;
  line-height: 0.25rem;
  font-size: 12px;
  position: absolute;
  top: -0.125rem;
  left: 48.2%;
}

.pageVM>.content .leftLine {
  width: 46%;
  height: 0.062rem;
  border-bottom: 1px solid #3f3f3f;
  position: absolute;
  top: -0.065rem;
  left: 0.021rem;
}

.pageVM>.content .rightLine {
  width: 46%;
  height: 0.062rem;
  border-bottom: 1px solid #3f3f3f;
  position: absolute;
  top: -0.065rem;
  right: 0.021rem;
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
