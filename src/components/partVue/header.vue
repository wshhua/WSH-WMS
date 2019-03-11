<template>
  <header>
    <div class="myLogo" v-if="this.logoDir"></div>
    <div class="isMy" v-on:click="isMyClick">
      <p class="userName">{{userName}}</p>
      <div class="myList" v-show="myList">
        <a class="myCenter" v-if="homeDir" v-on:click.stop="goHomeFun">{{this.Gbl.LangFun(this.WL.homeText, this.Gbl.wayMapUserLang)}}</a>
        <a class="exit" v-on:click.stop="exitFun">{{this.Gbl.LangFun(this.WL.exitText, this.Gbl.wayMapUserLang)}}</a>
      </div>
    </div>
    <div class="title" v-if="titleDir">
      <a class="goBack" v-on:click="goBackClick">{{this.Gbl.LangFun(this.WL.text13, this.Gbl.wayMapUserLang)}}</a>
      <p class="titleText">{{title}}</p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'headerCpt',
  data () {
    return {
      goBackUrl: this.message.goBackUrl,
      homeDir: this.message.homeDir,
      logoDir: this.message.logoDir,
      myList: false,
      homePopCtr: this.message.homePopCtr,
      backPopCtr: this.message.backPopCtr,
      title: this.message.title,
      titleDir: this.message.titleDir,
      userName: this.Gbl.wayMapUserName
    }
  },
  props: ['message'],
  methods: {
    exitFun () {
      this.$emit('exitFun')
    },
    goBackClick () {
      if (this.backPopCtr) {
        this.$emit('goBackFun')
      } else {
        this.router.push(this.goBackUrl)
      }
    },
    goHomeFun () {
      if (this.homePopCtr) {
        this.$emit('goHomeFun')
      } else {
        this.router.push('/home')
      }
    },
    isMyClick () {
      if (this.myList) {
        this.myList = false
      } else {
        this.myList = true
      }
    }
  },
  watch: {},
  filters: {},
  mounted () {}
}
</script>

<style scoped>
header {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid transparent;
  width: 100%;
  height: auto;
}

header>.myLogo {
  width: 55.3%;
  height: 1rem;
  background-repeat: no-repeat;
  background-position: center bottom;
  -webkit-background-size: 150px auto;
  background-size: 150px auto;
  background-image: url(../../../static/img/logo.png);
  float: left;
}

header>.isMy {
  width: 25%;
  height: 0.5rem;
  background-image: url(../../../static/img/userPic.png);
  background-repeat: no-repeat;
  background-position: left top;
  -webkit-background-size: 26px 26px;
  background-size: 26px 26px;
  border-top: 1px solid transparent;
  position: absolute;
  right: 4%;
  top: 0.25rem;
  z-index: 10;
}

header>.isMy>.userName {
  width: 60%;
  height: 0.458rem;
  line-height: 0.458rem;
  font-size: 12px;
  text-align: left;
  color: #22a65b;
  float: right;
  overflow: hidden;
}

header>.isMy>.myList {
  width: 73%;
  height: auto;
  border: 2px solid #3eb271;
  border-radius: 0.083rem;
  position: absolute;
  top: 0.5rem;
  left: 13.5%;
  background-color: #FFFFFF;
}

header>.isMy>.myList>a {
  display: block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: left;
  font-size: 12px;
  color: #6d6d6d;
  padding-left: 8%;
}

header>.isMy>.myList>a:active {
  color: #FFFFFF;
  background-color: #039844;
}

header>.title {
  width: 100%;
  height: 1rem;
  ;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-top: 1px solid transparent;
  position: relative;
  clear: both;
}

header>.title .goBack {
  display: inline-block;
  width: auto;
  height: 0.625rem;
  position: absolute;
  top: 0.2rem;
  left: 7.5%;
  line-height: 0.625rem;
  font-size: 22px;
  color: #3f3f3f;
}

header>.title .titleText {
  width: 100%;
  height: 0.6rem;
  line-height: 0.6rem;
  margin-top: 0.2rem;
  text-align: center;
  font-size: 22px;
  color: #3f3f3f;
}
</style>
