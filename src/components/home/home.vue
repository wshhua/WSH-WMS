<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <router-link class="item stockInHome" to="stockInHome">{{this.Gbl.LangFun(this.WL.text63, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item purchaseReturn" to="purchaseReturnSearch">{{this.Gbl.LangFun(this.WL.text4, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item allot" to="allotSearchOut">{{this.Gbl.LangFun(this.WL.text38, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item check" to="checkSearch">{{this.Gbl.LangFun(this.WL.text7, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item stockInquiry" to="stockInquiry">{{this.Gbl.LangFun(this.WL.text43, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item inStockMove" to="stockMoveSearch">{{this.Gbl.LangFun(this.WL.text80, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item pickAndBasket" to="bindBasket">{{this.Gbl.LangFun(this.WL.text50, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item outStock" to="salesSearch">{{this.Gbl.LangFun(this.WL.text1, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item clientGB" to="deliveryTaskSearch">{{this.Gbl.LangFun(this.WL.text74, this.Gbl.wayMapUserLang)}}</router-link>
      <router-link class="item mySet" to="userSet">{{this.Gbl.LangFun(this.WL.text9, this.Gbl.wayMapUserLang)}}</router-link>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'home',
  data () {
    return {
      headerInfo: {
        goBackUrl: '',
        homeDir: false,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.homeText, this.Gbl.wayMapUserLang),
        titleDir: false
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
  height: 8rem;
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
.pageVM>.content>.stockInHome {
  background-image: url(../../../static/img/purchaseStoragePic.png);
  color: #eb8ebb;
}

.pageVM>.content>.purchaseReturn {
  background-image: url(../../../static/img/purchaseReturnPic.png);
  color: #fc9b88;
}

.pageVM>.content>.allot {
  background-image: url(../../../static/img/allotfPic.png);
  color: #14da83;
}

.pageVM>.content>.check {
  background-image: url(../../../static/img/checkPic.png);
  color: #e6831e;
}

.pageVM>.content>.inStockMove {
  background-image: url(../../../static/img/inStockMovePic.png);
  color: #49beb5;
}

.pageVM>.content>.pickAndBasket {
  background-image: url(../../../static/img/pickAndBlacket.png);
  color: #be87f4;
}

.pageVM>.content>.outStock {
  background-image: url(../../../static/img/orderOutStockPic.png);
  color: #ce86da;
}

.pageVM>.content>.clientGB {
  background-image: url(../../../static/img/orderOutStockPic.png);
  color: #ce86da;
}

.pageVM>.content>.stockInquiry {
  background-image: url(../../../static/img/stockInquiryPic.png);
  color: #fd6b90;
}

.pageVM>.content>.mySet {
  background-image: url(../../../static/img/mySetPic.png);
  color: #49b1e4;
}
</style>
