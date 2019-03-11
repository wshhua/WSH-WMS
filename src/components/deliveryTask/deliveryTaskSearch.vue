<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="noOrder" v-on:click="modelSelectFun(1)">{{this.Gbl.LangFun(this.WL.text48, this.Gbl.wayMapUserLang)}}</div>
      <div class="noOrder" v-on:click="modelSelectFun(2)">{{this.Gbl.LangFun(this.WL.text49, this.Gbl.wayMapUserLang)}}</div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'deliveryTaskSearch',
  data () {
    return {
      headerInfo: {
        goBackUrl: '/home',
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text74, this.Gbl.wayMapUserLang),
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
    modelSelectFun (val) {
      if (val === 1) {
        this.router.push('/smallBagDeliveryDetail')
      } else if (val === 2) {
        this.router.push('/bigBagDeliveryDetail?orderId=')
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
.pageVM>.content>.noOrder {
  width: 30%;
  height: 0.5rem;
  float: left;
  clear: both;
  border-radius: 0.083rem;
  border: 1px solid #4f5051;
  background-color: rgba(0, 0, 0, 0);
  line-height: 0.5rem;
  text-align: center;
  font-size: 12px;
  margin-top: 0.5rem;
  color: #3f3f3f;
}
</style>
