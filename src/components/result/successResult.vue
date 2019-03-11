<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="resultImg"></div>
      <p class="resultInfo">{{resultInfo}}</p>
      <router-link class="goHome" v-bind:to="goUrl">{{goName}}</router-link>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'stockInHome',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/' + this.Gbl.GainUrlValueFun('downUrl'),
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text63, this.Gbl.wayMapUserLang),
        titleDir: false
      },
      goUrl: '/' + this.Gbl.GainUrlValueFun('downUrl'),
      goName: decodeURIComponent(this.Gbl.GainUrlValueFun('downName')),
      resultInfo: this.Gbl.LangFun(this.WL.text139, this.Gbl.wayMapUserLang)
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
.pageVM>.content {
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
.pageVM>.content>.resultImg {
  width: 100%;
  height: 1.625rem;
  background-position: center bottom;
  background-size: 1.5rem 1.5rem;
  background-repeat: no-repeat;
  background-image: url(../../../static/img/OK.png);
}

.pageVM>.content>.resultInfo {
  width: 100%;
  height: 1.187rem;
  text-align: center;
  line-height: 1.187rem;
  font-size: 17px;
  color: #575757;
}

.pageVM>.content>.goHome {
  display: block;
  width: 50%;
  height: 0.895rem;
  text-align: center;
  line-height: 0.895rem;
  font-size: 17px;
  color: #575757;
  margin: 0 auto;
  background-color: #FFFFFF;
  margin-top: 2.708rem;
  border: 1px solid #c0c0c0;
  border-radius: 0.083rem;
}

.pageVM>.content>.goHome:active {
  background-image: -webkit-linear-gradient(top, rgb(81, 244, 189) 0%, rgb(18, 219, 130) 100%);
}
</style>
