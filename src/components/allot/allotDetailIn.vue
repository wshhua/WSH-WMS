<template>
  <div class='pageVM' id='pageVM' v-on:click="pageOtherClick">
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="numContrl">
        <div class="inputStyle" v-bind:class="{active:item7Dir}" v-on:click="styleContrl('input')">{{this.Gbl.LangFun(this.WL.text16, this.Gbl.wayMapUserLang)}}</div>
        <div class="scanStyle" v-bind:class="{active:!item7Dir}" v-on:click="styleContrl('scan')">{{this.Gbl.LangFun(this.WL.text17, this.Gbl.wayMapUserLang)}}</div>
      </div>
      <div class="item1">
        <div class="left">{{this.Gbl.LangFun(this.WL.text15, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">{{orderCode}}</div>
      </div>
      <div class="item2">
        <div class="left">{{this.Gbl.LangFun(this.WL.text102, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">
          <input type="text" ref="barcode" class="barCode" v-model="barCode" v-on:keyup.enter="barCodeEnter"
            v-on:click.stop="barCodeClickFun" />
          <div class="barCodeList" v-show="barCodeListDir">
            <div class="barCodeItem" v-bind:class="{active:(item.result===0 ||item.result==item.quantityScaned)}"
              v-for="(item,index) in barCodeList" v-bind:key="'index'+index" v-on:click="barCodeItemClick($event)">{{item.itemName}}</div>
          </div>
        </div>
      </div>
      <div class="item9">
        <div class="left">{{this.Gbl.LangFun(this.WL.text19, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">
          <input type="text" ref="batchnum" class="batchNum" v-model="batchNum" v-on:keyup.enter="batchNumEnter" />
        </div>
      </div>
      <div class="item3">
        <div class="left">{{this.Gbl.LangFun(this.WL.text20, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">
          <p>{{pdtDetail.pdtName}}</p>
        </div>
      </div>
      <div class="item4">
        <div class="left">{{this.Gbl.LangFun(this.WL.text18, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">{{pdtDetail.pdtUpc}}</div>
      </div>
      <div class="item5">
        <div class="left">{{this.Gbl.LangFun(this.WL.text22, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">{{pdtDetail.binName}}</div>
      </div>
      <div class="item6">
        <div class="left">{{this.Gbl.LangFun(this.WL.text23, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right"><span>{{pdtDetail.pdtNum}}(</span><span>{{alreadyNum}}</span><span>/</span><span>{{pdtDetail.waitNum}}</span><span>)</span></div>
      </div>
      <div class="item10">
        <div class="left">{{this.Gbl.LangFun(this.WL.text24, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">{{progress+'/'+totalSku}}</div>
      </div>
      <div class="item7" v-bind:class="{active:item7Dir}">
        <div class="itemName" v-show="item7Dir">{{this.Gbl.LangFun(this.WL.text23, this.Gbl.wayMapUserLang)}}:</div>
        <div class="substract" v-on:click="subClick" v-show="item7Dir"></div>
        <input type="number" ref="alreadynum" v-model="alreadyNum" class="productNum" v-show="item7Dir" />
        <div class="add" v-on:click="addClick" v-show="item7Dir"></div>
      </div>
      <div class="item8">
        <div class="exitScan" v-on:click="exitScanClick">{{this.Gbl.LangFun(this.WL.text24, this.Gbl.wayMapUserLang)}}</div>
        <div class="submint" v-on:click="submintClick">{{this.Gbl.LangFun(this.WL.text27, this.Gbl.wayMapUserLang)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'allotDetailIn',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/allotSearchIn',
        homeDir: true,
        logoDir: false,
        homePopCtr: true,
        backPopCtr: true,
        title: this.Gbl.LangFun(this.WL.text37, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      alreadyNum: 0, // 提交数
      barCodeListDir: false, // 条码列表显示字段
      barCodeList: [], // 条码列表数据
      batchNum: '', // 批次号数据
      inTask: false,
      item7Dir: false,
      orderCode: this.Gbl.GainUrlValueFun('orderId'),
      orderList: [],
      orderListIndex: 0,
      orderListLen: 1,
      orderType: this.Gbl.GainUrlValueFun('orderType'),
      barCode: '',
      barCodeBackup: '',
      pdtDetail: {
        binName: '',
        pdtName: '',
        pdtNum: 0,
        pdtUpc: '',
        waitNum: 0
      },
      progress: 0,
      totalSku: 0
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
    exitScanClick () {
      this.router.push('/allotListIn?orderId=' + this.orderCode + '&orderType=' + this.orderType)
    },
    gainErrorRetrun (val1) {
      if (val1 === 'errorCode') {
        this.router.push('/')
      } else if (val1 === 'barCodeError') {
        this.$refs.barcode.focus()
      } else if (val1 === 'sub' || val1 === 'add' || val1 === 'alreadyNum') {
        this.$refs.alreadynum.focus()
      } else if (val1 === 'submint') {
        this.$refs.barcode.focus()
      } else if (val1 === 'barCodeOk') {
        if (this.item7Dir) {
          this.$refs.alreadynum.focus()
        } else {
          this.$refs.barcode.focus()
        }
      }
    },
    gainOrderDetail () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTransationDetailList' + this.Gbl.commonVariaList + '&tranid=' + this.orderCode + '&transactionType=' + this.orderType + '&location=' + this.Gbl.wayMapLocationId + '&entry=IN'
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
            this.orderList = retData
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
    addClick () {
      this.alreadyNum++
    },
    barCodeEnter (event) {
      if (this.barCode === '') {
        this.$refs.barcode.className = 'barCode ERROR'
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text90, this.Gbl.wayMapUserLang), 'barCodeError'])
      } else {
        // 判断是否在订单内
        for (var i = 0; i < this.orderListLen; i++) {
          if ((this.barCode + '') === (this.orderList[i].itemName + '') || (this.barCode + '') === (this.orderList[i].upc + '')) {
            this.orderListIndex = i
            if (this.barCodeBackup === '') {
              this.upDataToPage(i)
            }
            this.$refs.barcode.className = 'barCode OK'
            if (this.item7Dir) {
              this.$refs.alreadynum.focus()
              this.barCodeBackup = this.barCode
            } else {
              if (this.barCodeBackup !== this.barCode && this.barCodeBackup !== '') {
                this.barCode = ''
                this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text91, this.Gbl.wayMapUserLang), 'barCodeError'])
              } else {
                this.barCodeBackup = this.barCode
                this.$refs.barcode.focus()
                this.barCode = ''
                this.orderList[i].quantityScaned++
                this.alreadyNum++
              }
            }
            break
          } else if (i === this.orderListLen - 1) {
            this.$refs.barcode.className = 'barCode ERROR'
            this.barCode = ''
            if (this.item7Dir) {
              this.upDataToPage(-1)
            }
            this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text92, this.Gbl.wayMapUserLang), 'barCodeError'])
          }
        }
      }
    },
    barCodeClickFun () {
      if (this.barCodeListDir) {
        this.barCodeListDir = false
      } else {
        this.barCodeListDir = true
      }
      var alreadyList = []
      var surplusList = []
      for (var i = 0; i < this.orderListLen; i++) {
        if ((this.orderList[i].result - 0) === 0 || (this.orderList[i].result - 0) === (this.orderList[i].quantityScaned - 0)) {
          alreadyList.push(this.orderList[i])
        } else {
          surplusList.push(this.orderList[i])
        }
      }
      this.barCodeList = surplusList.concat(alreadyList)
    },
    barCodeItemClick (event) {
      this.barCode = event.target.innerHTML
      this.barCodeEnter()
    },
    batchNumEnter () {
      if (this.item7Dir) {
        this.$refs.alreadynum.focus()
      } else {
        this.$refs.barcode.focus()
      }
    },
    pageOtherClick () {
      this.$refs.myheader.myList = false
      this.barCodeListDir = false
    },
    progressFun () {
      this.progress = 0
      for (var i = 0; i < this.totalSku; i++) {
        if ((this.orderList[i].result - 0) === 0 || (this.orderList[i].result - 0) === (this.orderList[i].quantityScaned - 0)) {
          this.progress++
        }
      }
    },
    subClick () {
      if ((this.alreadyNum - 0) >= 1) {
        this.alreadyNum--
      } else {
        this.alreadyNum = 0
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text97, this.Gbl.wayMapUserLang), 'sub'])
      }
    },
    submintClick () {
      if (this.inTask) {
        this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.submitTipText1, this.Gbl.wayMapUserLang), 'submint'])
      } else {
        this.alreadyNum = 0
        this.barCode = ''
        this.upDataToPage(-1)
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text92, this.Gbl.wayMapUserLang), 'submint'])
      }
    },
    submintFun () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/saveTransationDetailLine?entry=IN'
      var veriableList = JSON.stringify({
        'token': this.Gbl.wayMapToken,
        'userId': this.Gbl.wayMapUserId,
        'transactionId': this.orderCode,
        'transactionType': this.orderType,
        'itemId': this.orderList[this.orderListIndex].itemId,
        'lotNumber': this.batchNum,
        'quantityReceived': this.alreadyNum - 0,
        'quantityFulfilled': 0
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
            this.orderList[this.orderListIndex].quantityScaned = this.alreadyNum - 0
            this.barCode = ''
            this.barCodeBackup = ''
            this.alreadyNum = 0
            this.upDataToPage(-1)
            this.progressFun()
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
    styleContrl (val) {
      if (val === 'input') {
        this.item7Dir = true
      } else if (val === 'scan') {
        this.item7Dir = false
      }
      this.barCode = ''
      this.$refs.barcode.focus()
    },
    upDataToPage (val1) {
      this.progressFun()
      if (val1 < 0) {
        this.pdtDetail.pdtName = ''
        this.pdtDetail.pdtUpc = ''
        this.pdtDetail.binName = ''
        this.pdtDetail.pdtNum = 0
        this.pdtDetail.waitNum = 0
        this.inTask = false
        this.alreadyNum = 0
      } else {
        this.pdtDetail.pdtName = this.orderList[val1].itemDescription
        this.pdtDetail.pdtUpc = this.orderList[val1].upc
        this.pdtDetail.binName = this.orderList[val1].binName
        this.pdtDetail.pdtNum = this.orderList[val1].quantity
        this.pdtDetail.waitNum = this.orderList[val1].result
        this.alreadyNum = this.orderList[val1].quantityScaned
        this.inTask = true
      }
    }
  },
  watch: {
    alreadyNum (val) {
      if (this.pdtDetail.waitNum <= '0' && this.pdtDetail.pdtNum > 0) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text98, this.Gbl.wayMapUserLang), 'alreadyNum'])
        this.alreadyNum = this.pdtDetail.waitNum
      } else if (this.pdtDetail.pdtNum > 0) {
        if ((this.alreadyNum - 0) > (this.pdtDetail.waitNum - 0)) {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text99, this.Gbl.wayMapUserLang), 'alreadyNum'])
          this.alreadyNum = this.pdtDetail.waitNum
        } else if ((this.alreadyNum - 0) < 0) {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text97, this.Gbl.wayMapUserLang), 'alreadyNum'])
          this.alreadyNum = 0
        }
      }
    },
    orderList () {
      this.orderListLen = this.orderList.length
      this.totalSku = this.orderList.length
      this.progressFun()
    }
  },
  mounted () {
    this.$emit('isInToken')
    this.gainOrderDetail()
    this.$refs.barcode.focus()
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
  height: 8.458rem;
  overflow-y: scroll;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.pageVM>.content>.numContrl {
  width: 100%;
  height: 0.541rem;
}

.pageVM>.content>.numContrl>.scanStyle,
.pageVM>.content>.numContrl>.inputStyle {
  width: 43.75%;
  height: 0.541rem;
  line-height: 0.541rem;
  font-size: 15px;
  float: left;
  margin-left: 3.125%;
  border-radius: 0.541rem;
  text-align: center;
  background-color: #caccc9;
  color: #3f3f3f;
}

.pageVM>.content>.numContrl>.scanStyle {
  float: right;
  margin-left: 0;
  margin-right: 3.125%;
}

.pageVM>.content>.numContrl>.scanStyle.active,
.pageVM>.content>.numContrl>.inputStyle.active {
  background-color: #76bc88;
  color: #FFFFFF;
}

.pageVM>.content>.item1,
.pageVM>.content>.item2,
.pageVM>.content>.item9,
.pageVM>.content>.item4,
.pageVM>.content>.item5,
.pageVM>.content>.item6,
.pageVM>.content>.item10 {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.5rem;
  clear: both;
  position: relative;
}

.pageVM>.content>.item2,
.pageVM>.content>.item9 {
  height: 0.6rem;
}

.pageVM>.content>.item3 {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 1rem;
  clear: both;
}

.pageVM>.content>.item7 {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.5rem;
  clear: both;
  opacity: 0;
}

.pageVM>.content>.item7.active {
  opacity: 1;
}

.pageVM>.content .left {
  width: 21.8%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 17px;
  text-align: left;
  float: left;
  margin-left: 7.8%;
  color: #595959;
}

.pageVM>.content .right {
  width: 65.9%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 17px;
  text-align: left;
  float: left;
  color: #595959;
  overflow: hidden;
}

.pageVM>.content>.item2 .left,
.pageVM>.content>.item9 .left {
  height: 0.6rem;
  line-height: 0.6rem;
}

.pageVM>.content>.item2 .barCode,
.pageVM>.content>.item9 .batchNum {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 86%;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 14px;
  text-align: left;
  color: #595959;
  outline: none;
  border: 2px solid #bfbfbf;
  border-radius: 0.083rem;
}

.pageVM>.content>.item2 .barCode.OK,
.pageVM>.content>.item9 .batchNum.OK {
  border: 2px solid #039844;
}

.pageVM>.content>.item2 .barCode.ERROR,
.pageVM>.content>.item9 .batchNum.ERROR {
  border: 2px solid #fe0000;
}

.pageVM>.content>.item2 .right,
.pageVM>.content>.item9 .right {
  height: 0.6rem;
  background-repeat: no-repeat;
  background-position: right center;
  background-image: url(../../../static/img/keyboardPic.png);
  background-size: auto 0.5rem;
  position: relative;
  overflow: inherit;
}

.pageVM>.content>.item2 .barCodeList {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 86%;
  height: auto;
  max-height: 2rem;
  border: 1px solid #bfbfbf;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  overflow: scroll;
  position: absolute;
  top: 0.5rem;
  left: 0;
  z-index: 10;
}

.pageVM>.content>.item2 .barCodeItem {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  line-height: 0.5rem;
  font-size: 14px;
  text-align: left;
  color: #595959;
  border-bottom: 1px solid #bfbfbf;
  padding: 0 5px;
  background-color: #FFFFFF;
}

.pageVM>.content>.item2 .barCodeItem.active {
  color: #49B1E4;
}

.pageVM>.content>.item3 .right {
  width: 65.9%;
  height: 1rem;
  text-align: left;
  float: left;
}

.pageVM>.content>.item3 .right p {
  width: 100%;
  height: auto;
  color: #565658;
  line-height: 0.5rem;
  font-size: 17px;
  text-align: left;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.pageVM>.content>.item1 {
  margin-top: 0.354rem;
}

.pageVM>.content>.item2,
.pageVM>.content>.item3,
.pageVM>.content>.item9,
.pageVM>.content>.item4,
.pageVM>.content>.item5,
.pageVM>.content>.item6,
.pageVM>.content>.item7,
.pageVM>.content>.item10 {
  margin-top: 0.062rem;
}

.pageVM>.content>.item6 .right>span {
  display: inline-block;
  width: auto;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 17px;
  float: left;
}

.pageVM>.content>.item6 .right>span:nth-child(2) {
  color: #20a45b;
}

.pageVM>.content>.item6 .right>span:nth-child(4) {
  color: #fc312d;
}

.pageVM>.content>.item7>.itemName {
  width: 25.9%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 17px;
  text-align: left;
  float: left;
  margin-left: 8.4%;
  color: #595959;
}

.pageVM>.content>.item7>.substract {
  width: 13.1%;
  height: 0.5rem;
  float: left;
  background: url(../../../static/img/subPic.png) no-repeat left center;
  background-size: auto 24px;
}

.pageVM>.content>.item7>.productNum {
  width: 19.7%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 12px;
  color: #595959;
  text-align: center;
  border: 1px solid #bfbfbf;
  border-radius: 0.083rem;
  float: left;
  outline: none;
}

.pageVM>.content>.item7>.add {
  width: 13.1%;
  height: 0.5rem;
  float: left;
  background: url(../../../static/img/addPic.png) no-repeat right center;
  background-size: auto 24px;
}

.pageVM>.content>.item8 {
  width: 100%;
  height: 0.895rem;
  text-align: center;
  margin-top: 0.1rem;
}

.pageVM>.content>.item8>.exitScan {
  width: 37.5%;
  height: 0.895rem;
  line-height: 0.895rem;
  font-size: 17px;
  border: 1px solid #bfbfbf;
  text-align: center;
  color: #595959;
  margin: 0 auto;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  float: left;
  margin-left: 8.4%;
}

.pageVM>.content>.item8>.submint {
  width: 37.5%;
  height: 0.895rem;
  line-height: 0.895rem;
  font-size: 17px;
  border: 1px solid #bfbfbf;
  text-align: center;
  color: #595959;
  margin: 0 auto;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  float: right;
  margin-right: 8.4%;
}

.pageVM>.content>.item8>.exitScan:active,
.pageVM>.content>.item8>.submint:active {
  background-image: -webkit-linear-gradient(top, rgb(81, 244, 189) 0%, rgb(18, 219, 130) 100%);
}
</style>
