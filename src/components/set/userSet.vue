<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <ul class="itemList">
        <li>
          <div class="changePwd" v-on:click="itemClickFun(1)">{{this.Gbl.LangFun(this.WL.text51, this.Gbl.wayMapUserLang)}}</div>
        </li>
        <li>
          <div class="dataSynchronism" v-on:click="itemClickFun(2)">{{this.Gbl.LangFun(this.WL.text52, this.Gbl.wayMapUserLang)}}</div>
        </li>
        <li>
          <div class="portSelfIns" v-on:click="itemClickFun(3)">{{this.Gbl.LangFun(this.WL.text53, this.Gbl.wayMapUserLang)}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'userSet',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/home',
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text9, this.Gbl.wayMapUserLang),
        titleDir: true
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
    itemClickFun (val) {
      if (val === 1) {
        this.router.push('/changePwd')
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
.pageVM>.content ul {
  width: 100%;
  height: 2.291rem;
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
}

.pageVM>.content li {
  width: 30%;
  height: 2.291rem;
}

.pageVM>.content li div {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  width: 100%;
  height: 100%;
  background-position: center 0.458rem;
  background-repeat: no-repeat;
  -webkit-background-size: 56px 56px;
  background-size: 56px 56px;
  line-height: 0.416rem;
  font-size: 17px;
  padding-top: 1.833rem;
  text-align: center;
}

.pageVM>.content li .changePwd {
  background-image: url(../../../static/img/changePwdPic-set.png);
  color: #7687d7;
}

.pageVM>.content li .dataSynchronism {
  background-image: url(../../../static/img/dataSynchronismPic-set.png);
  color: #e4ae58;
}

.pageVM>.content li .portSelfIns {
  background-image: url(../../../static/img/portSeltInspectionPic-set.png);
  color: #fa99a0;
}
</style>
