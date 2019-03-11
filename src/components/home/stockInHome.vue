<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <router-link class="item purchase" to="purchaseSearch">{{this.Gbl.LangFun(this.WL.text3, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item clientBack" to="salesReturnSearch">{{this.Gbl.LangFun(this.WL.text2, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item goodsAllot" to="allotSearchIn">{{this.Gbl.LangFun(this.WL.text37, this.Gbl.wayMapUserLang)}}</router-link>
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
        goBackUrl: '/home',
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text63, this.Gbl.wayMapUserLang),
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
.pageVM .content>.item {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  border-top: 1px solid transparent;
  width: 33.3%;
  height: 1.77rem;
  line-height: 0.354rem;
  margin-top: 0.3rem;
  text-align: center;
  font-size: 17px;
  padding-top: 65px;
  -webkit-background-size: 57px 57px;
  background-size: 57px 57px;
  background-repeat: no-repeat;
  background-position: center top;
}
.pageVM>.content .purchase {
  background-image: url(../../../static/img/purchaseStoragePic.png);
  color: #eb8ebb;
}

.pageVM>.content .clientBack {
  background-image: url(../../../static/img/clientGoodsBackPic.png);
  color: #6277e0;
}

.pageVM>.content .goodsAllot {
  background-image: url(../../../static/img/allotfPic.png);
  color: #14da83;
}
</style>
