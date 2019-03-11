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
        <span>{{this.Gbl.LangFun(this.WL.text89, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="old_pwd" class="purchaseNum"
          v-model="oldPwd" v-on:keyup.enter="sureFun" />
      </div>
      <div class="item">
        <span>{{this.Gbl.LangFun(this.WL.text87, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="new_pwd" class="purchaseNum"
          v-model="newPwd" v-on:keyup.enter="sureFun" />
      </div>
      <div class="item">
        <span>{{this.Gbl.LangFun(this.WL.text88, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="confirm_pwd" class="purchaseNum"
          v-model="confirmPwd" v-on:keyup.enter="sureFun" />
      </div>
      <div class="noOrder" v-on:click="sureFun">{{this.Gbl.LangFun(this.WL.text11, this.Gbl.wayMapUserLang)}}</div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
import md5 from 'js-md5'
export default {
  name: 'changePwd',
  data () {
    return {
      confirmPwd: '',
      headerInfo: {
        goBackUrl: '/userSet',
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text51, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      newPwd: '',
      oldPwd: ''
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
    submintData (val1, val2, val3) {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取调拨单清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/user/updateUserPassword' + this.Gbl.commonVariaList
      var variebleList = JSON.stringify({'userName': val1, 'password': md5(val2), 'oldPassword': md5(val3)})
      this.axios({
        method: 'post',
        url: loginUrl1,
        data: variebleList,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then((response) => {
        console.log(response)
        // 停止超时计时
        this.$emit('stopMoreTime', '')
        // 结束加载图
        this.$emit('loadingFun', false)
        if ((response.status + '') === '200') {
          if ((response.data.status + '') === '200') {
            var downName = this.Gbl.LangFun(this.WL.homeText, this.Gbl.wayMapUserLang)
            this.router.push('/successResult?downUrl=home&downName=' + encodeURIComponent(downName))
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
    sureFun () {
      if (this.oldPwd === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text135, this.Gbl.wayMapUserLang)])
      } else if (this.newPwd === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text129, this.Gbl.wayMapUserLang)])
      } else if (this.confirmPwd === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text130, this.Gbl.wayMapUserLang)])
      } else if (this.confirmPwd !== this.newPwd) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text131, this.Gbl.wayMapUserLang)])
      } else {
        this.submintData(this.Gbl.wayMapUserName, this.oldPwd, this.newPwd)
      }
    }
  },
  watch: {},
  mounted () {
    this.$emit('isInToken')
    this.$refs['old_pwd'].focus()
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
  margin-top: 0.5rem;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.pageVM>.content>.item>span {
  display: inline-block;
  width: 30%;
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
  width: 50%;
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
.pageVM>.content>.noOrder {
  width: 30%;
  height: 0.8rem;
  float: left;
  clear: both;
  border-radius: 0.083rem;
  border: 1px solid #4f5051;
  background-color: rgba(0, 0, 0, 0);
  line-height: 0.8rem;
  text-align: center;
  font-size: 12px;
  margin-top: 0.5rem;
  color: #3f3f3f;
}
</style>
