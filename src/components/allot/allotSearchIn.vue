<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="item">
        <span>{{this.Gbl.LangFun(this.WL.text15, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="purchase_num" class="purchaseNum" v-bind:placeholder="this.Gbl.LangFun(this.WL.text69, this.Gbl.wayMapUserLang)" v-on:focus="purchaseNum=''"
          v-model="purchaseNum" v-on:keyup.enter="searchClick" />
        <div class="searchButton" v-on:click="searchClick"></div>
      </div>
      <p class="tipInfo">{{this.Gbl.LangFun(this.WL.text69, this.Gbl.wayMapUserLang)}}</p>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'allotSearchIn',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/stockInHome',
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text37, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      isCanSubmit: false,
      orderList: [],
      orderListLen: 0,
      orderType: '',
      purchaseNum: '',
      selectedIndex: -1
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
    gainAllotList () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取调拨单清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getTranidList' + this.Gbl.commonVariaList + '&transactionType=TO&entry=IN'
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
            this.orderList = this.orderList.concat(retData)
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
      // 获取调拨单入库清单数据
      var loginUrl2 = this.Gbl.commonUrl + '/transasctions/getTranidList' + this.Gbl.commonVariaList + '&transactionType=TRACKING_NUMBER&entry=TO'
      this.axios({
        method: 'get',
        url: loginUrl2,
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
            this.orderList = this.orderList.concat(retData)
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
    gainErrorRetrun (val1) {
      if (val1 === 'errorCode') {
        this.router.push('/')
      }
    },
    goBackFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text94, this.Gbl.wayMapUserLang), 'goBack'])
    },
    goHomeFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text95, this.Gbl.wayMapUserLang), 'goHome'])
    },
    isCanSubmitFun () {
      for (var i = 0; i < this.orderListLen; i++) {
        if (this.purchaseNum.toLowerCase() === this.orderList[i].tranid.toLowerCase()) {
          this.purchaseNum = this.orderList[i].tranid
          this.isCanSubmit = true
          this.orderType = this.orderList[i].transactionType
          this.selectedIndex = i
          break
        } else if (i === (this.orderListLen - 1)) {
          for (var j = 0; j < this.orderListLen; j++) {
            if (this.purchaseNum.toLowerCase() === (this.orderList[j].trackingNumber + '').toLowerCase()) {
              this.purchaseNum = this.orderList[j].trackingNumber
              this.isCanSubmit = true
              this.orderType = 'TRACKING_NUMBER'
              this.selectedIndex = j
              break
            } else if (j === (this.orderListLen - 1)) {
              this.orderType = ''
              this.isCanSubmit = false
              this.selectedIndex = -1
            }
          }
        }
      }
    },
    searchClick () {
      this.isCanSubmitFun()
      if (this.purchaseNum === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text101, this.Gbl.wayMapUserLang)])
      } else if (this.orderListLen === 0) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text121, this.Gbl.wayMapUserLang)])
      } else if (this.isCanSubmit) {
        var locationAddr = this.Gbl.wayMapLocationId + ''
        var lockerInfo = this.Gbl.LangFun(this.WL.text116, this.Gbl.wayMapUserLang) + this.orderList[this.selectedIndex].lockedByUser + this.Gbl.LangFun(this.WL.text117, this.Gbl.wayMapUserLang)
        if ((this.orderList[this.selectedIndex].toLocationId + '') === locationAddr) {
          if (this.orderList[this.selectedIndex].lockedByUser === '0' || this.orderList[this.selectedIndex].lockedByUser === this.Gbl.wayMapUserName) {
            this.router.push('/allotDetailIn?orderId=' + this.purchaseNum + '&orderType=' + this.orderType)
          } else {
            this.$emit('fInfoFun', ['errorInfo', lockerInfo])
          }
        } else {
          this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text119, this.Gbl.wayMapUserLang)])
        }
      } else if (!this.isCanSubmit) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text118, this.Gbl.wayMapUserLang)])
      }
    }
  },
  watch: {
    purchaseNum () {
      this.isCanSubmitFun()
    },
    orderList () {
      this.orderListLen = this.orderList.length
    }
  },
  mounted () {
    this.$emit('isInToken')
    this.gainAllotList()
    this.$refs['purchase_num'].focus()
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
}
.pageVM .content {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid transparent;
  width: 100%;
  height: 7rem;
  margin-top: 0.2rem;
  overflow-y: scroll;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.pageVM .content .item {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  margin-top: 1rem;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.pageVM>.content>.item>span {
  display: inline-block;
  width: 20%;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: left;
  font-size: 17px;
  color: #3f3f3f;
  margin-left: 7.5%;
}

.pageVM>.content>.item>.purchaseNum {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  width: 55%;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: left;
  font-size: 14px;
  color: #3f3f3f;
  outline: none;
  border-radius: 0.083rem;
  border: 2px solid #4f5051;
  padding-left: 0.104rem;
}

.pageVM>.content>.item>.searchButton {
  display: inline-block;
  width: 9.3%;
  height: 0.7rem;
  background-image: url(../../../static/img/keyboardPic.png);
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 20px 20px;
}
.pageVM>.content>.tipInfo {
  width: 100%;
  height: 0.416rem;
  line-height: 0.416rem;
  text-align: center;
  font-size: 17px;
  color: #999999;
  clear: both;
  margin-top: 1.875rem;
}
</style>
