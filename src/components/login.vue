<template>
  <div class='pageLogin' id='pageLogin' v-on:click="pageClick">
    <div class="logoDiv"></div>
    <div class="content">
      <div class="userNameBox">
        <input
          type='text' class='uerName'
          v-model='userName' ref="user-name"
          v-on:keydown.enter="submintClick"/>
      </div>
      <div class="userPwdBox">
        <input
          type='password' class='userPwd'
          v-model='userPwd' v-on:keydown.enter="submintClick"/>
      </div>
      <div class="langBox">
        <input
          type="text"
          class="langInput"
          v-on:click.stop="langInputClick"
          v-on:keyup.enter="submintClick"
          v-model="langText"
          v-on:focus="langInputClick"
          v-if="true"
        />
        <ul class="langList" v-show="langListDir">
          <li v-on:click="langItemClick($event)" v-for="(item,index) in langData"
            v-bind:class="[{'active':item.active}]" v-bind:key="'item'+index">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <div class='submit' v-bind:class='{active:loginCan}' v-on:click='submintClick'>{{this.Gbl.LangFun(this.WL.loginText, this.Gbl.wayMapUserLang)}}</div>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'login',
  data () {
    return {
      isHavePwd: false,
      isHaveUser: false,
      langData: [
        {
          active: false,
          name: '简体中文',
          id: 0
        },
        {
          active: false,
          name: 'English',
          id: 1
        }
      ],
      langListDir: false,
      langText: '',
      locationId: '',
      loginCan: false,
      reminderInfo: '',
      reminderPopBox: false,
      userName: '',
      userPwd: ''
    }
  },
  props: ['message'],
  methods: {
    gainErrorRetrun (val1) {
      if (val1 === 'userName') {
        this.$refs['user-name'].focus()
      }
    },
    isLoginCanFun () {
      if (this.isHavePwd === true && this.isHaveUser === true) {
        this.loginCan = true
      } else {
        this.loginCan = false
      }
    },
    langFun (val) {
      return this.Gbl.LangFun(val, this.Gbl.wayMapUserLang)
    },
    langInputClick () {
      this.langListDir = true
    },
    langItemClick (event) {
      this.langListDir = false
      this.langText = event.target.innerHTML
    },
    pageClick () {
      this.langListDir = false
    },
    startFun () {
      // 默认聚焦
      this.$refs['user-name'].focus()
      // 默认语言
      this.langText = this.Gbl.wayMapUserLang !== 'null' ? this.Gbl.wayMapUserLang : '简体中文'
      // 默认用户名
      this.userName = this.Gbl.wayMapUserName !== 'null' ? this.Gbl.wayMapUserName : ''
    },
    submintClick () {
      if (this.loginCan === true) {
        this.submintFun(this.userName, md5(this.userPwd))
      } else if (this.isHaveUser === false || this.isHavePwd === false) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text127, this.Gbl.wayMapUserLang), 'userName'])
      }
    },
    submintFun (val1, val2) {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 登录请求和交互
      var loginUrl = this.Gbl.commonUrl + '/user/checkUserInfo'
      var variebleList = JSON.stringify({'userName': val1, 'password': val2})
      this.axios({
        method: 'post',
        url: loginUrl,
        data: variebleList,
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }).then((response) => {
        console.log(response)
        // 停止超时计时
        this.$emit('stopMoreTime', '')
        // 结束加载图
        this.$emit('loadingFun', false)
        var data = response.data
        if (response.status === 200) {
          if (data.status === '200') {
            window.localStorage.setItem('wayMapUserName', data.result.user_name)
            window.localStorage.setItem('wayMapToken', data.token)
            window.localStorage.setItem('wayMapAccountId', data.result.account_id)
            window.localStorage.setItem('wayMapLocationId', data.result.location_id)
            window.localStorage.setItem('wayMapLocationName', data.result.location_name)
            window.localStorage.setItem('wayMapTokenTime', data.limitedTime)
            window.localStorage.setItem('wayMapUserId', data.userId)
            window.localStorage.setItem('wayMapUserLang', this.langText)
            this.Gbl.wayMapUserName = data.result.user_name
            this.Gbl.wayMapToken = data.token
            this.Gbl.wayMapAccountId = data.result.account_id
            this.Gbl.wayMapLocationId = data.result.location_id
            this.Gbl.wayMapLocationName = data.result.location_name
            this.Gbl.wayMapTokenTime = data.limitedTime
            this.Gbl.wayMapUserId = data.userId
            this.Gbl.wayMapUserLang = this.langText
            this.Gbl.commonVariaList = '?token=' + data.token + '&userId=' + data.userId
            this.router.push('/home')
          } else {
            this.$emit('fInfoFun', ['errorInfo', data.msg])
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
    langText (val) {
      for (var i = 0; i < this.langData.length; i++) {
        if ((val + '').toLowerCase() === (this.langData[i].name + '').toLowerCase()) {
          this.langText = this.langData[i].name
          this.langData[i].active = true
        } else {
          this.langData[i].active = false
        }
      }
    },
    userName (val) {
      if (val !== '') {
        this.isHaveUser = true
      } else {
        this.isHaveUser = false
      }
      this.isLoginCanFun()
    },
    userPwd (val) {
      if (val !== '') {
        this.isHavePwd = true
      } else {
        this.isHavePwd = false
      }
      this.isLoginCanFun()
    }
  },
  mounted () {
    this.startFun()
  }
}

</script>

<style scoped>
.pageLogin {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url(../../static/img/pageBg.png);
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
.pageLogin .logoDiv {
  width: 100%;
  height: 2.3rem;
  background-image: url(../../static/img/logo.png);
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: 50% auto;
}
.pageLogin .content {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: auto;
  border-top: 1px solid transparent;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.pageLogin .content .userNameBox {
  width: 85%;
  height: auto;
  margin-top: 0.45rem;
}
.pageLogin .content .userPwdBox {
  width: 85%;
  height: auto;
  margin-top: 0.45rem;
}
.pageLogin .content .langBox {
  width: 85%;
  height: auto;
  margin-top: 0.45rem;
  position: relative;
}
.pageLogin .userNameBox .uerName {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.9rem;
  line-height: 0.9rem;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  background-image: url(../../static/img/userNamePic.png);
  background-repeat: no-repeat;
  background-position: 0.1rem center;
  padding-left: 0.8rem;
  outline: none;
  font-size: 24px;
  color: rgb(109,109,109);
}
.pageLogin .userPwdBox .userPwd {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.9rem;
  line-height: 0.9rem;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  background-image: url(../../static/img/userPwdPic.png);
  background-repeat: no-repeat;
  background-position: 0.15rem center;
  padding-left: 0.8rem;
  outline: none;
  font-size: 24px;
  color: rgb(109,109,109);
}
.pageLogin .langBox .langInput {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.9rem;
  line-height: 0.9rem;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  background-image: url(../../static/img/storeAddressPic.png);
  background-repeat: no-repeat;
  background-position: 0.15rem center;
  padding-left: 0.8rem;
  outline: none;
  font-size: 24px;
  color: rgb(109,109,109);
}
.pageLogin .langBox .langList {
  width: 87.5%;
  height: auto;
  min-height: 0.9rem;
  max-height: 2.83rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 0.145rem;
  background-color: #ffffff;
  position: absolute;
  top: 0.9rem;
  left: 0;
  overflow: scroll;
  list-style-type: none;
}
.pageLogin .langBox .langList li {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.9rem;
  line-height: 0.9rem;
  background-color: #ffffff;
  padding-left: 0.27rem;
  font-size: 20px;
  color: rgb(109, 109, 109);
}

.pageLogin .langBox .langList li.active {
  background-color: #74bb88;
  color: #ffffff;
}
.pageLogin .submit {
  width: 87.5%;
  height: 1.1rem;
  line-height: 1.125rem;
  margin-top: 1rem;
  border: 1px solid rgb(191, 191, 191);
  border-radius: 0.2rem;
  text-align: center;
  font-size: 27px;
  color: rgb(191, 191, 191);
}
.pageLogin .submit.active {
  border: 1px solid #00ae29;
  color: #00ae29;
}
</style>
