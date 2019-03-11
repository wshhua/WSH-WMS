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
        <input type="text" class="inputOrder" ref="inputorder" v-model="inputOrder" v-on:keydown.enter="inputEnterFun" />
      </div>
      <ul class="orderList">
        <li class="item" v-for="(site,index) in orderList" v-bind:key="'index'+index">
          <p><span class="firstSpan">{{index+1}}</span><span>{{listTest.text1}}:{{site.order}}</span></p>
          <div class="lwh">
            <div class="length">
              <span>{{listTest.text2}}</span>
              <input type="number" class="lengthV" v-model="site.Length" />
            </div>
            <div class="width">
              <span>{{listTest.text3}}</span>
              <input type="number" class="widthV" v-model="site.Width" />
            </div>
            <div class="heighth">
              <span>{{listTest.text4}}</span>
              <input type="number" class="heighthV" v-model="site.Heighth" />
            </div>
            <span>cm</span>
          </div>
          <div class="deleteItem" v-on:click="deleteItem(index)" v-show="editDir"></div>
        </li>
        <li v-if="orderList.length===0" class="noData">{{this.Gbl.LangFun(this.WL.text44, this.Gbl.wayMapUserLang)}}</li>
      </ul>
      <div class="scanAndSubmint">
        <div class="continueSan" v-on:click="editFun">{{this.Gbl.LangFun(this.WL.text73, this.Gbl.wayMapUserLang)}}</div>
        <div class="submintAudit" v-on:click="submintClickFun">{{this.Gbl.LangFun(this.WL.text27, this.Gbl.wayMapUserLang)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'smallBagDeliveryDetail',
  data () {
    return {
      editDir: false,
      headerInfo: {
        goBackUrl: '/deliveryTaskSearch',
        homeDir: true,
        logoDir: true,
        homePopCtr: true,
        backPopCtr: true,
        title: this.Gbl.LangFun(this.WL.text48, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      inputOrder: '',
      isCanSubmit: false,
      listTest: {
        text1: this.Gbl.LangFun(this.WL.text15, this.Gbl.wayMapUserLang),
        text2: this.Gbl.LangFun(this.WL.text75, this.Gbl.wayMapUserLang),
        text3: this.Gbl.LangFun(this.WL.text76, this.Gbl.wayMapUserLang),
        text4: this.Gbl.LangFun(this.WL.text77, this.Gbl.wayMapUserLang)
      },
      nowLogistics: '',
      orderList: []
    }
  },
  props: ['message'],
  components: {
    'my-header': headerCpt
  },
  methods: {
    deleteItem (val) {
      this.orderList.splice(val, 1)
    },
    editFun () {
      if (this.editDir) {
        this.editDir = false
      } else {
        this.editDir = true
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
    goBackFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text94, this.Gbl.wayMapUserLang), 'goBack'])
    },
    goHomeFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text95, this.Gbl.wayMapUserLang), 'goHome'])
    },
    inputEnterFun () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getShippingCarrier' + this.Gbl.commonVariaList + '&trackingNumber=' + this.inputOrder
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
            if (response.data.msg !== '查询成功') {
              this.$emit('fInfoFun', ['errorInfo', response.data.msg])
            } else if (response.data.transactions.lockedByUser !== '0' && response.data.transactions.lockedByUser !== this.Gbl.wayMapUserName) {
              var lockedInfo = this.Gbl.LangFun(this.WL.text116, this.Gbl.wayMapUserLang) + response.data.transactions.lockedByUser + this.Gbl.LangFun(this.WL.text117, this.Gbl.wayMapUserLang)
              this.$emit('fInfoFun', ['errorInfo', lockedInfo])
            } else if (this.orderList.length === 0) {
              // 当时第一条数据时直接录入
              this.orderList.push({
                order: this.inputOrder + '',
                Length: '',
                Width: '',
                Heighth: ''
              })
              this.inputOrder = ''
              this.editDir = false
              this.isCanSubmit = true
              this.nowLogistics = response.data.transactions.createdFrom
            } else {
              // 当时第二条及以上数据时判断是否是同一物流商
              if (this.nowLogistics === response.data.transactions.createdFrom) {
                // 判断是否重复录入同一单号
                var orderListLen = this.orderList.length
                for (var i = 0; i < orderListLen; i++) {
                  if (this.orderList[i].order === this.inputOrder) {
                    this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text122, this.Gbl.wayMapUserLang)])
                    break
                  } else if (i === (orderListLen - 1)) {
                    this.orderList.push({
                      order: this.inputOrder + '',
                      Length: '',
                      Width: '',
                      Heighth: ''
                    })
                    this.inputOrder = ''
                    this.editDir = false
                  }
                }
              } else {
                this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text123, this.Gbl.wayMapUserLang)])
              }
            }
            this.$refs.inputorder.focus()
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
    submintFun () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/submitTrackingNumber'
      var veriableList = JSON.stringify({
        'token': this.Gbl.wayMapToken,
        'userId': this.Gbl.wayMapUserId,
        'createdFrom': this.nowLogistics,
        'transType': 'SHIPPING_CARRIER_PICKUP',
        'list': this.orderList
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
            this.orderList = []
            this.inputOrder = ''
            this.nowLogistics = ''
            this.isCanSubmit = false
            this.$emit('fInfoFun', ['errorInfo', 'Succesfully!'])
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
    submintClickFun () {
      if (this.isCanSubmit) {
        this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.submitTipText1, this.Gbl.wayMapUserLang), 'submint'])
      } else {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text121, this.Gbl.wayMapUserLang)])
      }
    }
  },
  watch: {},
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
  height: 7rem;
  margin-top: 0.2rem;
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
  padding-bottom: 0.1rem;
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

.pageVM>.content .item .lwh {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  display: -webkit-flex;
  display: flex;
  justify-content: flex-start;
  margin-top: 0.1rem;
}

.pageVM>.content .item .lwh .length,
.pageVM>.content .item .lwh .width,
.pageVM>.content .item .lwh .heighth {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 30%;
  height: 0.458rem;
  display: -webkit-flex;
  display: flex;
  justify-content: flex-start;
}

.pageVM>.content .item .lwh span {
  width: auto;
  height: 0.458rem;
  line-height: 0.458rem;
  padding-right: 0.1rem;
}

.pageVM>.content .item .lwh input {
  outline: none;
  width: 60%;
  height: 0.458rem;
  line-height: 0.458rem;
  border: 1px solid #363636;
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

.pageVM>.content .item .deleteItem {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 0.4rem;
  height: 0.458rem;
  position: absolute;
  top: 0;
  right: 0;
  background-image: url(../../../static/img/ERROR.png);
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
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
  margin-top: 0.1rem;
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
