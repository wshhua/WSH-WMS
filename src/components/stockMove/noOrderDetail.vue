<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="item2">
        <div class="left">{{this.Gbl.LangFun(this.WL.text102, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">
          <input type="text" class="barCode" v-model="barCode" v-on:keyup.enter="barCodeEnter"/>
        </div>
      </div>
      <div class="item3">
        <div class="left">{{this.Gbl.LangFun(this.WL.text20, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right"><p>{{productName}}</p></div>
      </div>
      <div class="item4">
        <div class="left">{{this.Gbl.LangFun(this.WL.text18, this.Gbl.wayMapUserLang)}}:</div>
        <div class="right">{{pdtUpc}}</div>
      </div>
      <div class="item7">
        <div class="left">{{this.Gbl.LangFun(this.WL.text81, this.Gbl.wayMapUserLang)}}</div>
        <div class="right">
          <input type="text" class="goodsShelfOut" v-model="goodsShelfOCode"/>
          <div class="goodsShelfClickPic" v-on:click.stop="goodsShelfODisplay"></div>
          <div class="goodsShelfList" v-show="goodsShelfOList">
            <div class="goodsShelfItem"
            v-for="(item,index) in goodsShelfOData"
            v-bind:key="'item'+index"
            v-on:click="goodsShelfOItemClick(index)">{{item.binName}}</div>
          </div>
          <div class="goodsShelfListBg" v-show="goodsShelfOList"></div>
        </div>
      </div>
      <div class="item7">
        <div class="left">{{this.Gbl.LangFun(this.WL.text82, this.Gbl.wayMapUserLang)}}</div>
        <div class="right">
          <input type="text" class="goodsShelfInto" v-model="goodsShelfInCode"/>
          <div class="goodsShelfClickPic" v-on:click.stop="goodsShelfInDisplay"></div>
          <div class="goodsShelfList" v-show="goodsShelfInList">
            <div class="goodsShelfItem"
            v-for="(item,index) in goodsShelfInData"
            v-bind:key="'index'+index"
            v-on:click="goodsShelfInItemClick(index)">{{item.binName}}</div>
          </div>
          <div class="goodsShelfListBg" v-show="goodsShelfInList"></div>
        </div>
      </div>
      <div class="item6">
        <div class="itemName">{{this.Gbl.LangFun(this.WL.text23, this.Gbl.wayMapUserLang)}}:</div>
        <div class="substract" v-on:click="subClick"></div>
        <input type="number" v-model="productNum" class="productNum" />
        <div class="add" v-on:click="addClick"></div>
      </div>
      <div class="item8">
        <div class="submint" v-on:click="submintClick">{{this.Gbl.LangFun(this.WL.text27, this.Gbl.wayMapUserLang)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'noOrderDetail',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/stockMoveSearch',
        homeDir: true,
        logoDir: false,
        homePopCtr: true,
        backPopCtr: true,
        title: this.Gbl.LangFun(this.WL.text80, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      barCode: '',
      goodsShelfInCode: '',
      goodsShelfInCodeId: '',
      goodsShelfInData: [],
      goodsShelfInList: false,
      goodsShelfOCode: '',
      goodsShelfOCodeId: '',
      goodsShelfOData: [],
      goodsShelfONum: 0,
      goodsShelfOList: false,
      isRightOutLotname: false,
      orderListData: [],
      orderListDataLen: 0,
      pdtId: '',
      pdtUpc: '',
      productName: '',
      productNum: 0
    }
  },
  props: ['message'],
  components: {
    'my-header': headerCpt
  },
  methods: {
    addClick () {
      this.productNum++
    },
    barCodeEnter () {
      if (this.barCode === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text90, this.Gbl.wayMapUserLang)])
        this.productNum = 0
      } else {
        if (this.orderListDataLen === 0) {
          this.gainProductData()
        } else {}
      }
    },
    exitFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.exitTipText, this.Gbl.wayMapUserLang), 'exitLoading'])
    },
    gainErrorRetrun (val1) {
      if (val1 === 'errorCode') {
        this.router.push('/')
      }
    },
    gainProductData () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/bintransfer/getItemInfoList' + this.Gbl.commonVariaList + '&upc=' + this.barCode + '&locationId=' + this.Gbl.wayMapLocationId
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
            this.productName = retData[0].itemDescription
            this.pdtUpc = retData[0].upc
            this.pdtId = retData[0].itemId
            this.productNum = 0
            this.goodsShelfOData = retData
            this.goodsShelfInData = retData
            this.goodsShelfOCodeId = ''
            this.goodsShelfInCodeId = ''
            this.goodsShelfOCode = ''
            this.goodsShelfInCode = ''
            this.goodsShelfONum = 0
          } else if ((response.data.errorCode + '') === '4000' || (response.data.errorCode + '') === '4001' || (response.data.errorCode + '') === '4002') {
            this.$emit('fInfoFun', ['errorInfo', response.data.msg, 'errorCode'])
          } else {
            console.log(response.data)
            this.productName = ''
            this.pdtUpc = ''
            this.pdtId = ''
            this.productNum = 0
            this.goodsShelfOData = []
            this.goodsShelfInData = []
            this.goodsShelfOCodeId = ''
            this.goodsShelfInCodeId = ''
            this.goodsShelfOCode = ''
            this.goodsShelfInCode = ''
            this.goodsShelfONum = 0
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
    goodsShelfInDisplay () {
      this.goodsShelfOList = false
      this.goodsShelfInList = true
    },
    goodsShelfInItemClick (val1) {
      this.goodsShelfInCode = this.goodsShelfInData[val1].binName
      this.goodsShelfInCodeId = this.goodsShelfInData[val1].binId
      this.goodsShelfInList = false
    },
    goodsShelfODisplay () {
      this.goodsShelfInList = false
      this.goodsShelfOList = true
    },
    goodsShelfOItemClick (val1) {
      this.goodsShelfOCode = this.goodsShelfOData[val1].binName
      this.goodsShelfOCodeId = this.goodsShelfOData[val1].binId
      this.goodsShelfONum = this.goodsShelfOData[val1].quantity
      this.goodsShelfOList = false
    },
    pageOtherClick () {
      this.goodsShelfOList = false
      this.goodsShelfInList = false
    },
    subClick () {
      if (this.productNum > 0) {
        this.productNum--
      } else {
        this.productNum = 0
      }
    },
    submintClick () {
      if (this.isRightOutLotname) {
        this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.submitTipText1, this.Gbl.wayMapUserLang), 'submint'])
      } else {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text111, this.Gbl.wayMapUserLang)])
      }
    },
    submintFun () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/bintransfer/submitTransaction'
      var veriableList = JSON.stringify({
        'token': this.Gbl.wayMapToken,
        'userId': this.Gbl.wayMapUserId,
        'transType': 'BIN_TRANSFER',
        'itemId': this.pdtId,
        'binNumber': this.goodsShelfOCode,
        'toBinNumber': this.goodsShelfInCode,
        'quantity': this.productNum
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
            this.barCode = ''
            this.productName = ''
            this.pdtUpc = ''
            this.pdtId = ''
            this.productNum = 0
            this.goodsShelfOData = []
            this.goodsShelfInData = []
            this.goodsShelfOCodeId = ''
            this.goodsShelfInCodeId = ''
            this.goodsShelfONum = 0
            this.goodsShelfOCode = ''
            this.goodsShelfInCode = ''
            this.$refs.barcode.focus()
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
  watch: {
    goodsShelfOCode () {
      var lotNameListLen = this.goodsShelfOData.length
      for (var i = 0; i < lotNameListLen; i++) {
        if ((this.goodsShelfOData[i].binName + '') === (this.goodsShelfOCode + '')) {
          this.isRightOutLotname = true
          break
        } else if (i === lotNameListLen - 1) {
          this.isRightOutLotname = false
        }
      }
    },
    orderListData () {
      this.orderListDataLen = this.orderListData.length
    },
    productNum () {
      this.goodsShelfONum -= 0
      this.productNum -= 0
      if (this.goodsShelfONum <= 0 && this.productNum !== 0) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text126, this.Gbl.wayMapUserLang)])
        this.productNum = 0
      } else {
        if ((this.productNum - 0) > this.goodsShelfONum) {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text107, this.Gbl.wayMapUserLang)])
          this.productNum = this.goodsShelfONum
        } else if ((this.productNum - 0) < 0) {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text97, this.Gbl.wayMapUserLang)])
          this.productNum = 0
        }
      }
    }
  },
  mounted () {
    this.$emit('isInToken')
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
.pageVM>.content>.item2,
.pageVM>.content>.item4,
.pageVM>.content>.item6,
.pageVM>.content>.item7 {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.5rem;
  clear: both;
}

.pageVM>.content>.item2 {
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

.pageVM>.content .left {
  width: 25%;
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
  float: right;
  color: #595959;
  overflow: hidden;
}

.pageVM>.content>.item2 .left,
.pageVM>.content>.item2 .right {
  height: 0.6rem;
  height: 0.6rem;
}

.pageVM>.content>.item2 .barCode {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 75.8%;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 14px;
  text-align: left;
  color: #595959;
  outline: none;
  border: 2px solid #bfbfbf;
  border-radius: 0.083rem;
}

.pageVM>.content>.item3 .right {
  width: 65.9%;
  height: 1rem;
  text-align: left;
  float: right;
}

.pageVM>.content>.item3 .right p {
  width: 80.5%;
  height: auto;
  color: #fe1f20;
  line-height: 0.5rem;
  font-size: 17px;
  text-align: left;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.pageVM>.content>.item3 {
  margin-top: 0.354rem;
}

.pageVM>.content>.item4 {
  margin-top: 0.062rem;
  margin-bottom: 2.5rem;
}

.pageVM>.content>.item6 {
  margin-top: 0.2rem;
}

.pageVM>.content>.item7 {
  margin-top: 0.2rem;
}

.pageVM>.content>.item6>.itemName {
  width: 25.9%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 17px;
  text-align: left;
  float: left;
  margin-left: 8.4%;
  color: #595959;
}

.pageVM>.content>.item6>.substract {
  width: 13.1%;
  height: 0.5rem;
  float: left;
  background-image: url(../../../static/img/subPic.png);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: auto 24px;
}

.pageVM>.content>.item6>.productNum {
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

.pageVM>.content>.item6>.add {
  width: 13.1%;
  height: 0.5rem;
  float: left;
  background-image: url(../../../static/img/addPic.png);
  background-repeat: no-repeat;
  background-position: right center;
  background-size: auto 24px;
}

.pageVM>.content>.item7 .goodsShelfOut,
.pageVM>.content>.item7 .goodsShelfInto {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 75.8%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 14px;
  text-align: left;
  color: #595959;
  outline: none;
  border: 2px solid #bfbfbf;
  border-radius: 0.083rem;
}

.pageVM>.content>.item7 .right {
  position: relative;
  overflow: inherit;
}

.pageVM>.content>.item7 .right .goodsShelfClickPic {
  width: 0.541rem;
  height: 0.5rem;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: auto 50%;
  background-image: url(../../../static/img/listUpPic.png);
  position: absolute;
  top: 0;
  right: 24.2%;
}

.pageVM>.content>.item7 .goodsShelfList {
  width: 75.8%;
  height: auto;
  min-height: 0.625rem;
  max-height: 3.645rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 0.145rem;
  background-color: #ffffff;
  position: absolute;
  bottom: 0.833rem;
  left: 0;
  overflow: scroll;
  box-shadow: 0 0 0.2rem #333333;
}

.pageVM>.content>.item7 .goodsShelfList .goodsShelfItem {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.625rem;
  line-height: 0.625rem;
  font-size: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  color: #333;
  padding: 0 0.145rem;
}

.pageVM>.content>.item7 .goodsShelfList .goodsShelfItem:last-child {
  border-bottom: none;
}

.pageVM>.content>.item7 .goodsShelfList .goodsShelfItem.active {
  background-color: #74be83;
  color: #FFFFFF;
}

.pageVM>.content>.item7 .goodsShelfListBg {
  width: 0.333rem;
  height: 0.29rem;
  background-position: left top;
  background-repeat: no-repeat;
  background-size: auto 80%;
  background-image: url(../../../static/img/listDownBgPic.png);
  position: absolute;
  top: -18px;
  right: 27%;
}

.pageVM>.content>.item8 {
  width: 100%;
  height: 0.895rem;
  text-align: center;
  margin-top: 0.1rem;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
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
}

.pageVM>.content>.item8>.submint:active {
  background-image: -webkit-linear-gradient(top, rgb(81, 244, 189) 0%, rgb(18, 219, 130) 100%);
}
</style>
