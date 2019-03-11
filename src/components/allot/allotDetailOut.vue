<template>
  <div class='pageVM' id='pageVM' >
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
          <input type="text" class="barCode" v-model="barCode" v-on:click.stop="barCodeClickFun" v-on:keyup.enter="barCodeEnter"
            ref='inputbarcode' />
          <div class="barCodeList" v-show="barCodeListDir">
            <div class="barCodeItem" v-bind:class="{active:(item.result===0||item.result==item.quantityScaned)}"
              v-on:click="barCodeItemClick($event)" v-for="(item,index) in barCodeList" v-bind:key="'indexBar'+index">{{item.itemName}}</div>
          </div>
        </div>
      </div>
      <div class="item5" v-show="binNameDivDir">
        <div class="left">{{this.Gbl.LangFun(this.WL.text22, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">
          <input type="text" class="binName" v-model="binName" v-on:keyup.enter="binNameEnter" v-on:click.stop="binNameClickFun"
            ref='inputbinname' />
          <div class="binNameList" v-show="binNameListDir">
            <div class="binNameItem" v-for="(item,index) in binNameData" v-bind:key="'indexBin'+index" v-on:click="itemClick('binName', $event)">{{item.binName}}</div>
          </div>
        </div>
      </div>
      <div class="item9" v-show="batchNumDivDir">
        <div class="left">{{this.Gbl.LangFun(this.WL.text19, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">
          <input type="text" class="batchNum" v-model="batchNum" v-on:keyup.enter="batchNumEnter" v-on:click.stop="batchNumClickFun"
            ref='inputbatchnum' />
          <div class="batchNumList" v-show="batchNumListDir">
            <div class="batchNumItem" v-for="(item,index) in batchNumData" v-bind:key="'indexBatch'+index" v-on:click="itemClick('batchNum', $event)">{{item.lotNumber}}</div>
          </div>
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
      <div class="item6">
        <div class="left">{{this.Gbl.LangFun(this.WL.text23, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right"><span>{{pdtDetail.pdtNum}}(</span><span>{{alreadyNum}}</span><span>/</span><span>{{pdtDetail.waitNum}}</span><span>)</span><span>{{this.Gbl.LangFun(this.WL.text68, this.Gbl.wayMapUserLang)}}：{{binNameMaxNum}}</span></div>
      </div>
      <div class="item10">
        <div class="left">{{this.Gbl.LangFun(this.WL.text54, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">{{progress+'/'+totalSku}}</div>
      </div>
      <div class="item7" v-bind:class="{active:item7Dir}">
        <div class="itemName" v-show="item7Dir">{{this.Gbl.LangFun(this.WL.text23, this.Gbl.wayMapUserLang)}}:</div>
        <div class="substract" v-on:click="subClick" v-show="item7Dir"></div>
        <input type="number" v-model="alreadyNum" class="productNum" v-show="item7Dir" ref='inputalreadynum' />
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
  name: 'allotDetailOut',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/allotSearchOut',
        homeDir: true,
        logoDir: false,
        homePopCtr: true,
        backPopCtr: true,
        title: this.Gbl.LangFun(this.WL.text38, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      alreadyNum: 0,
      alreadySubmintData: [],
      alreadySubmintNumBackup: '',
      barCode: '',
      barCodeBackup: '',
      barCodeList: [],
      barCodeListDir: false,
      batchNum: '',
      batchNumData: [],
      batchNumListDir: false,
      binAndBatchData: [],
      binName: '',
      binNameData: [],
      binNameListDir: false,
      binNameMaxNum: 0,
      inTask: false,
      item7Dir: false,
      itemType: 'LB',
      orderCode: this.Gbl.GainUrlValueFun('orderId'),
      orderList: [],
      orderListIndex: 0,
      orderListLen: 1,
      orderType: this.Gbl.GainUrlValueFun('orderType'),
      pdtDetail: {
        pdtName: '',
        pdtNum: 0,
        pdtUpc: '',
        waitNum: 0
      },
      progress: 0,
      totalSku: 0
    }
  },
  computed: {
    batchNumDivDir () {
      if (this.itemType === 'L' || this.itemType === 'LB') {
        return true
      } else {
        return false
      }
    },
    binNameDivDir () {
      if (this.itemType === 'IB' || this.itemType === 'LB') {
        return true
      } else {
        return false
      }
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
    gainBinListData (val1, val2) {
      // 获取库位和批次信息
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTransationBinName' + this.Gbl.commonVariaList + '&itemId=' + val1 + '&entry=OUT'
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
            this.upDataToPage(val2)
            this.binAndBatchData = retData
          } else if ((response.data.errorCode + '') === '4000' || (response.data.errorCode + '') === '4001' || (response.data.errorCode + '') === '4002') {
            this.$emit('fInfoFun', ['errorInfo', response.data.msg, 'errorCode'])
          } else {
            this.binAndBatchData = []
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
    gainErrorRetrun (val1) {
      if (val1 === 'errorCode') {
        this.router.push('/')
      } else if (val1 === 'sub' || val1 === 'addd' || val1 === 'alreadyNum') {
        this.$refs.inputalreadynum.focus()
      } else if (val1 === 'submint') {
        this.$refs.inputbarcode.focus()
      } else if (val1 === 'barCodeError') {
        this.$refs.inputbarcode.focus()
      }
    },
    gainOrderDetail () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTransationDetailList' + this.Gbl.commonVariaList + '&tranid=' + this.orderCode + '&transactionType=' + this.orderType + '&location=' + this.Gbl.wayMapLocationId + '&entry=OUT'
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
    gainBinSubmintData (val1) {
      // 获取库位或批次已提交信息
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTransactionItemInventoryDetails' + this.Gbl.commonVariaList + '&trainid=' + this.orderCode + '&itemId=' + val1 + '&entry=OUT&binNumber='
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
            this.alreadySubmintData = retData
          } else if ((response.data.errorCode + '') === '4000' || (response.data.errorCode + '') === '4001' || (response.data.errorCode + '') === '4002') {
            this.$emit('fInfoFun', ['errorInfo', response.data.msg, 'errorCode'])
          } else {
            this.alreadySubmintData = []
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
      this.barCodeListDir = false
      if (this.barCode === '') {
        this.$refs.inputbarcode.className = 'barCode ERROR'
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text90, this.Gbl.wayMapUserLang)], 'barCodeError')
      } else {
        // 判断是否在订单内
        for (var i = 0; i < this.orderListLen; i++) {
          if ((this.barCode + '') === (this.orderList[i].itemName + '') || (this.barCode + '') === (this.orderList[i].upc + '')) {
            this.orderListIndex = i
            this.itemType = this.orderList[i].itemType // sku项目类型
            // 获取条码的库位和批次信息
            if (this.barCodeBackup === '' && (this.binNameDivDir || this.batchNumDivDir)) {
              this.gainBinListData(this.orderList[i].itemId, i)
            }
            // 获取条码已提交数据
            if (this.barCodeBackup === '') {
              this.binName = ''
              this.batchNum = ''
              this.alreadyNum = 0
              this.gainBinSubmintData(this.orderList[i].itemId)
            }
            this.$refs.inputbarcode.className = 'barCode OK'
            if (this.barCodeBackup !== this.barCode && this.barCodeBackup !== '') {
              // 商品数据未提交扫描别的商品
              this.barCode = ''
              this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text91, this.Gbl.wayMapUserLang)], 'barCodeError')
            } else if (this.item7Dir) {
              // 点数模式
              if (this.binNameDivDir) {
                this.$refs.inputbinname.focus()
              } else if (this.batchNumDivDir) {
                this.$refs.inputbatchnum.focus()
              } else {
                this.$refs.inputalreadynum.focus()
              }
              this.barCodeBackup = this.barCode
            } else {
              // 扫描模式
              if (this.barCodeBackup !== '') {
                this.$refs.inputbarcode.focus()
                this.orderList[i].quantityScaned++
                this.alreadyNum++
              } else {
                if (this.binNameDivDir) {
                  this.$refs.inputbinname.focus()
                } else if (this.batchNumDivDir) {
                  this.$refs.inputbatchnum.focus()
                } else {
                  this.$refs.inputbarcode.focus()
                }
                this.barCodeBackup = this.barCode
              }
              this.barCode = ''
            }
            break
          } else if (i === this.orderListLen - 1) {
            this.$refs.inputbarcode.className = 'barCode ERROR'
            this.barCode = ''
            if (this.item7Dir) {
              this.upDataToPage(-1)
            }
            this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text92, this.Gbl.wayMapUserLang)], 'barCodeError')
          }
        }
      }
    },
    barCodeClickFun () {
      this.binNameListDir = false
      this.batchNumListDir = false
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
    binNameClickFun () {
      this.barCodeListDir = false
      this.batchNumListDir = false
      if (this.binNameListDir) {
        this.binNameListDir = false
      } else {
        this.binNameListDir = true
      }
    },
    binNameEnter () {
      if (this.batchNumDivDir) {
        this.$refs.inputbatchnum.focus()
      } else if (this.item7Dir) {
        this.$refs.inputalreadynum.focus()
      } else {
        this.$refs.inputbarcode.focus()
      }
    },
    batchNumClickFun () {
      this.binNameListDir = false
      this.barCodeListDir = false
      if (this.batchNumListDir) {
        this.batchNumListDir = false
      } else {
        this.batchNumListDir = true
      }
    },
    batchNumEnter () {
      if (this.item7Dir) {
        this.$refs.inputalreadynum.focus()
      } else {
        this.$refs.inputbarcode.focus()
      }
    },
    computeAlreadyNum () {
      var alreadySubmintDataLen = this.alreadySubmintData.length
      var alreadySubminNum = 0
      if (this.itemType === 'I') {
        for (var i = 0; i < alreadySubmintDataLen; i++) {
          alreadySubminNum += (this.alreadySubmintData[i].quantity - 0)
        }
        if (this.barCodeBackup !== '') {
          this.alreadySubmintNumBackup = alreadySubminNum + '/' + this.barCodeBackup
        } else {
          this.alreadySubmintNumBackup = ''
        }
      } else if (this.itemType === 'L') {
        for (var j = 0; j < alreadySubmintDataLen; j++) {
          if (this.alreadySubmintData[j].lotNumber === this.batchNum) {
            alreadySubminNum += (this.alreadySubmintData[j].quantity - 0)
          }
        }
        if (this.barCodeBackup !== '' && this.batchNum !== '') {
          this.alreadySubmintNumBackup = alreadySubminNum + '/' + this.barCodeBackup + '/' + this.batchNum
        } else {
          this.alreadySubmintNumBackup = ''
        }
      } else if (this.itemType === 'IB') {
        for (var k = 0; k < alreadySubmintDataLen; k++) {
          if (this.alreadySubmintData[k].binNumber === this.binName) {
            alreadySubminNum += (this.alreadySubmintData[k].quantity - 0)
          }
        }
        if (this.barCodeBackup !== '' && this.binName !== '') {
          this.alreadySubmintNumBackup = alreadySubminNum + '/' + this.barCodeBackup + '/' + this.binName
        } else {
          this.alreadySubmintNumBackup = ''
        }
      } else if (this.itemType === 'LB') {
        for (var l = 0; l < alreadySubmintDataLen; l++) {
          if (this.alreadySubmintData[l].binNumber === this.binName && this.alreadySubmintData[l].lotNumber === this.batchNum) {
            alreadySubminNum += (this.alreadySubmintData[l].quantity - 0)
          }
        }
        if (this.barCodeBackup !== '' && this.batchNum !== '' && this.binName !== '') {
          this.alreadySubmintNumBackup = alreadySubminNum + '/' + this.barCodeBackup + '/' + this.binName + '/' + this.batchNum
        } else {
          this.alreadySubmintNumBackup = ''
        }
      }
      this.alreadyNum = alreadySubminNum
    },
    exitScanClick () {
      this.router.push('/allotListOut?orderId=' + this.orderCode + '&orderType=' + this.orderType)
    },
    itemClick (val1, event) {
      if (val1 === 'binName') {
        this.binName = event.target.innerHTML
        this.binNameListDir = false
        this.binNameEnter()
      } else if (val1 === 'batchNum') {
        this.batchNum = event.target.innerHTML
        this.batchNumListDir = false
        this.batchNumEnter()
      }
    },
    pageOtherClick () {
      this.myList = false
      this.binNameListDir = false
      this.barCodeListDir = false
      this.batchNumListDir = false
    },
    progressFun () {
      this.progress = 0
      for (var i = 0; i < this.totalSku; i++) {
        if ((this.orderList[i].result - 0) === 0 || (this.orderList[i].result - 0) === (this.orderList[i].quantityScaned - 0)) {
          this.progress++
        }
      }
    },
    styleContrl (val) {
      if (val === 'input') {
        this.item7Dir = true
      } else if (val === 'scan') {
        this.item7Dir = false
      }
      this.barCode = ''
      this.$refs.inputbarcode.focus()
    },
    subClick () {
      if ((this.alreadyNum - 0) >= 1) {
        this.alreadyNum--
      } else {
        this.alreadyNum = 0
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text97, this.Gbl.wayMapUserLang)], 'sub')
      }
    },
    submintClick () {
      if (this.inTask) {
        if (this.binNameDivDir && this.binName === '') {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text109, this.Gbl.wayMapUserLang)], 'submint')
        } else if (this.batchNumDivDir && this.batchNum === '') {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text110, this.Gbl.wayMapUserLang)], 'submint')
        } else {
          var rightBinName = false
          var rightBatchNum = false
          for (var i = 0; i < this.binNameData.length; i++) {
            if (this.binName === this.binNameData[i].binName) {
              rightBinName = true
            }
          }
          for (var j = 0; j < this.batchNumData.length; j++) {
            if (this.batchNum === this.batchNumData[j].lotNumber) {
              rightBatchNum = true
            }
          }
          if (this.binNameDivDir && !rightBinName) {
            this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text111, this.Gbl.wayMapUserLang)], 'submint')
          } else if (this.batchNumDivDir && !rightBatchNum) {
            this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text112, this.Gbl.wayMapUserLang)], 'submint')
          } else {
            this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.submitTipText1, this.Gbl.wayMapUserLang), 'submint'])
          }
        }
      } else {
        this.alreadyNum = 0
        this.barCode = ''
        this.upDataToPage(-1)
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text192, this.Gbl.wayMapUserLang)], 'submint')
      }
    },
    submintFun () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/saveTransationDetailLine?entry=OUT'
      var veriableList = JSON.stringify({
        'token': this.Gbl.wayMapToken,
        'userId': this.Gbl.wayMapUserId,
        'transactionId': this.orderCode,
        'itemId': this.orderList[this.orderListIndex].itemId,
        'lotNumber': this.batchNum,
        'quantityReceived': 0,
        'quantityFulfilled': this.alreadyNum - 0,
        'transactionType': 'TO_WAVE',
        'binNumber': this.binName
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
            this.barCodeBackup = ''
            this.alreadySubmintNumBackup = ''
            this.alreadyNum = 0
            this.barCode = ''
            this.batchNum = ''
            this.binName = ''
            this.$refs.inputbarcode.focus()
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
    upDataToPage (val1) {
      this.progressFun()
      if (val1 < 0) {
        this.pdtDetail.pdtName = ''
        this.pdtDetail.pdtUpc = ''
        this.binName = ''
        this.pdtDetail.pdtNum = 0
        this.pdtDetail.waitNum = 0
        this.inTask = false
        this.binNameData = []
        this.alreadyNum = 0
      } else {
        this.pdtDetail.pdtName = this.orderList[val1].itemDescription
        this.pdtDetail.pdtUpc = this.orderList[val1].upc
        this.pdtDetail.pdtNum = this.orderList[val1].quantity
        this.pdtDetail.waitNum = this.orderList[val1].result
        this.inTask = true
        // 获取库位数据
      }
    }
  },
  watch: {
    alreadyNum (val) {
      this.pdtDetail.waitNum -= 0
      this.pdtDetail.pdtNum -= 0
      this.alreadyNum -= 0
      this.binNameMaxNum -= 0
      if (this.alreadyNum > this.binNameMaxNum) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text103, this.Gbl.wayMapUserLang)], 'alreadyNum')
        this.alreadyNum = this.binNameMaxNum
      } else if (this.pdtDetail.waitNum <= 0 && this.pdtDetail.pdtNum > 0) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text98, this.Gbl.wayMapUserLang)], 'alreadyNum')
        this.alreadyNum = this.pdtDetail.waitNum - 0
      } else {
        if (this.alreadyNum > this.pdtDetail.waitNum) {
          if (this.pdtDetail.waitNum > 0) {
            this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text105, this.Gbl.wayMapUserLang)], 'alreadyNum')
          }
          this.alreadyNum = this.pdtDetail.waitNum
        } else if (this.alreadyNum < 0) {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text97, this.Gbl.wayMapUserLang)], 'alreadyNum')
          this.alreadyNum = 0
        }
      }
    },
    alreadySubmintData () {
      this.computeAlreadyNum()
    },
    batchNum () {
      if (this.itemType === 'I' || this.itemType === 'IB') {
        // 不做操作
      } else if (this.itemType === 'L') {
        if (this.alreadySubmintNumBackup !== '' && (this.alreadyNum - 0) !== (this.alreadySubmintNumBackup.split('/')[0] - 0)) {
          this.batchNum = this.alreadySubmintNumBackup.split('/')[2]
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text91, this.Gbl.wayMapUserLang)], 'barCodeError')
        } else if (this.alreadySubmintNumBackup === '' || this.batchNum !== (this.alreadySubmintNumBackup.split('/')[2])) {
          this.alreadyNum = 0
          this.binNameMaxNum = 0
          var batchNumDataLen = this.batchNumData.length
          for (var i = 0; i < batchNumDataLen; i++) {
            if ((this.batchNum + '') === this.batchNumData[i].lotNumber) {
              this.binNameMaxNum = this.batchNumData[i].quantityAvailable
              break
            }
          }
          this.computeAlreadyNum()
        }
      } else if (this.itemType === 'LB') {
        if (this.alreadySubmintNumBackup !== '' && (this.alreadyNum - 0) !== (this.alreadySubmintNumBackup.split('/')[0] - 0)) {
          this.batchNum = this.alreadySubmintNumBackup.split('/')[3]
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text91, this.Gbl.wayMapUserLang)], 'barCodeError')
        } else if (this.alreadySubmintNumBackup === '' || this.batchNum !== (this.alreadySubmintNumBackup.split('/')[3])) {
          this.alreadyNum = 0
          this.binNameMaxNum = 0
          var batchNumDataLenB = this.batchNumData.length
          for (var j = 0; j < batchNumDataLenB; j++) {
            if ((this.batchNum + '') === this.batchNumData[j].lotNumber) {
              this.binNameMaxNum = this.batchNumData[j].quantityAvailable
              break
            }
          }
          this.computeAlreadyNum()
        }
      }
    },
    binAndBatchData () {
      if (this.itemType === 'I') {
        this.binNameData = []
        this.batchNumData = []
      } else if (this.itemType === 'L') {
        this.binNameData = []
        this.batchNumData = this.binAndBatchData
      } else if (this.itemType === 'IB') {
        this.binNameData = this.binAndBatchData
        this.batchNumData = []
      } else if (this.itemType === 'LB') {
        this.batchNumData = []
        var binAndBatchDataLen = this.binAndBatchData.length
        var NewBinNameData = []
        for (var i = 0; i < binAndBatchDataLen; i++) {
          var NewBinNameDataLen = NewBinNameData.length
          if (NewBinNameDataLen === 0) {
            var itemData = {
              binName: this.binAndBatchData[i].binName,
              batchNumData: [this.binAndBatchData[i]]
            }
            NewBinNameData.push(itemData)
          } else {
            for (var j = 0; j < NewBinNameDataLen; j++) {
              if (NewBinNameData[j].binName === this.binAndBatchData[i].binName) {
                NewBinNameData[j].batchNumData.push(this.binAndBatchData[i])
                break
              } else if (j === (NewBinNameDataLen - 1)) {
                var itemDataB = {
                  binName: this.binAndBatchData[i].binName,
                  batchNumData: [this.binAndBatchData[i]]
                }
                NewBinNameData.push(itemDataB)
              }
            }
          }
        }
        this.binNameData = NewBinNameData
      }
    },
    binName (val1) {
      if (this.itemType === 'I' || this.itemType === 'L') {
        // 不做操作
      } else if (this.itemType === 'IB') {
        if (this.alreadySubmintNumBackup !== '' && (this.alreadyNum - 0) !== (this.alreadySubmintNumBackup.split('/')[0] - 0)) {
          this.binName = this.alreadySubmintNumBackup.split('/')[2]
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text91, this.Gbl.wayMapUserLang)], 'barCodeError')
        } else if (this.alreadySubmintNumBackup === '' || this.binName !== (this.alreadySubmintNumBackup.split('/')[2])) {
          this.alreadyNum = 0
          this.binNameMaxNum = 0
          this.batchNum = ''
          var dataLen = this.binNameData.length
          for (var i = 0; i < dataLen; i++) {
            if ((this.binName + '') === this.binNameData[i].binName) {
              this.binNameMaxNum = this.binNameData[i].quantityAvailable
            }
          }
          this.computeAlreadyNum()
        }
      } else if (this.itemType === 'LB') {
        if (this.alreadySubmintNumBackup !== '' && (this.alreadyNum - 0) !== (this.alreadySubmintNumBackup.split('/')[0] - 0)) {
          this.binName = this.alreadySubmintNumBackup.split('/')[2]
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text91, this.Gbl.wayMapUserLang)], 'barCodeError')
        } else if (this.alreadySubmintNumBackup === '' || this.binName !== this.alreadySubmintNumBackup.split('/')[2]) {
          this.alreadyNum = 0
          this.binNameMaxNum = 0
          this.batchNum = ''
          var binDataLen = this.binNameData.length
          for (var j = 0; j < binDataLen; j++) {
            if ((this.binName + '') === this.binNameData[j].binName) {
              this.batchNumData = this.binNameData[j].batchNumData
            }
          }
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
    this.$refs.inputbarcode.focus()
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
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
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
.pageVM>.content>.item9,
.pageVM>.content>.item5 {
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
.pageVM>.content>.item5 .left,
.pageVM>.content>.item9 .left {
  height: 0.6rem;
  line-height: 0.6rem;
}

.pageVM>.content>.item2 .barCode,
.pageVM>.content>.item5 .binName,
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
.pageVM>.content>.item5 .binName.OK,
.pageVM>.content>.item9 .batchNum.OK {
  border: 2px solid #039844;
}

.pageVM>.content>.item2 .barCode.ERROR,
.pageVM>.content>.item5 .binName.ERROR,
.pageVM>.content>.item9 .batchNum.ERROR {
  border: 2px solid #fe0000;
}

.pageVM>.content>.item2 .right,
.pageVM>.content>.item5 .right,
.pageVM>.content>.item9 .right {
  height: 0.6rem;
  background-repeat: no-repeat;
  background-position: right center;
  background-image: url(../../../static/img/keyboardPic.png);
  background-size: auto 0.5rem;
  position: relative;
  overflow: inherit;
}

.pageVM>.content>.item5 .binNameList,
.pageVM>.content>.item9 .batchNumList {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 86%;
  height: auto;
  max-height: 1.5rem;
  border: 1px solid #bfbfbf;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  overflow: scroll;
  position: absolute;
  top: 0.5rem;
  left: 0;
  z-index: 10;
}

.pageVM>.content>.item5 .binNameItem,
.pageVM>.content>.item9 .batchNumItem {
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
  font-size: 14px;
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
