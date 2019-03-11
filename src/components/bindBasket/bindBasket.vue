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
        <input type="text" ref="order_num" class="purchaseNum" v-bind:placeholder="this.Gbl.LangFun(this.WL.text142, this.Gbl.wayMapUserLang)" v-on:focus="orderNum=''"
          v-model="orderNum" v-on:keyup.enter="searchClick" />
      </div>
      <div class="item">
        <span>{{this.Gbl.LangFun(this.WL.text86, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="basket_num" class="purchaseNum" v-bind:placeholder="this.Gbl.LangFun(this.WL.text142, this.Gbl.wayMapUserLang)" v-on:focus="basketNum=''"
          v-model="basketNum" v-on:keyup.enter="searchClick" />
      </div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'bindBasket',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/home',
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text50, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      orderNum: '',
      basketNum: ''
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
    goBackFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text94, this.Gbl.wayMapUserLang), 'goBack'])
    },
    goHomeFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text95, this.Gbl.wayMapUserLang), 'goHome'])
    },
    searchClick () {
      if (this.orderNum === '') {
        this.$refs['order_num'].focus()
      } else if (this.basketNum === '') {
        this.$refs['basket_num'].focus()
      } else {
        this.submintData()
      }
    },
    submintData () {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取调拨单清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/transasctions/getWavePickUp' + this.Gbl.commonVariaList + '&tranid=' + this.orderNum + '&pickup=' + this.basketNum
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
            this.$emit('fInfoFun', ['errorInfo', response.data.msg])
            this.orderNum = ''
            this.basketNum = ''
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
    this.$refs['order_num'].focus()
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
  width: 25%;
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
</style>
