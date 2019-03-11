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
        <span>{{this.Gbl.LangFun(this.WL.text18, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="barcode_num" class="purchaseNum" v-bind:placeholder="this.Gbl.LangFun(this.WL.text69, this.Gbl.wayMapUserLang)" v-on:focus="purchaseNum=''"
          v-model="barCode" v-on:keyup.enter="searchClick(1)" />
        <div class="searchButton" v-on:click="searchClick(1)"></div>
      </div>
      <div class="item">
        <span>{{this.Gbl.LangFun(this.WL.skuText, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="sku_num" class="purchaseNum" v-bind:placeholder="this.Gbl.LangFun(this.WL.text69, this.Gbl.wayMapUserLang)" v-on:focus="purchaseNum=''"
          v-model="skuNum" v-on:keyup.enter="searchClick(2)" />
        <div class="searchButton" v-on:click="searchClick(2)"></div>
      </div>
      <div class="item">
        <span>{{this.Gbl.LangFun(this.WL.text20, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="pdt_num" class="purchaseNum" v-bind:placeholder="this.Gbl.LangFun(this.WL.text69, this.Gbl.wayMapUserLang)" v-on:focus="purchaseNum=''"
          v-model="pdtName" v-on:keyup.enter="searchClick(3)" />
        <div class="searchButton" v-on:click="searchClick(3)"></div>
      </div>
      <div class="item">
        <span>{{this.Gbl.LangFun(this.WL.text22, this.Gbl.wayMapUserLang)}}</span>
        <input type="text" ref="bin_num" class="purchaseNum" v-bind:placeholder="this.Gbl.LangFun(this.WL.text69, this.Gbl.wayMapUserLang)" v-on:focus="purchaseNum=''"
          v-model="binName" v-on:keyup.enter="searchClick(4)" />
        <div class="searchButton" v-on:click="searchClick(4)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'stockInquiry',
  data () {
    return {
      barCode: '',
      binName: '',
      headerInfo: {
        goBackUrl: '/home',
        homeDir: true,
        logoDir: true,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text6, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      pdtName: '',
      skuNum: ''
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
    searchClick (val) {
      if (val === 1 && this.barCode === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text132, this.Gbl.wayMapUserLang)])
      } else if (val === 1 && this.barCode.length < 3) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text134, this.Gbl.wayMapUserLang)])
      } else if (val === 2 && this.skuNum === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text90, this.Gbl.wayMapUserLang)])
      } else if (val === 2 && this.skuNum.length < 3) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text134, this.Gbl.wayMapUserLang)])
      } else if (val === 3 && this.pdtName === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text133, this.Gbl.wayMapUserLang)])
      } else if (val === 3 && this.pdtName.length < 3) {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text134, this.Gbl.wayMapUserLang)])
      } else if (val === 4 && this.binName === '') {
        this.$emit('fInfoFun', ['errorInfo', this.Gbl.LangFun(this.WL.text109, this.Gbl.wayMapUserLang)])
      } else if (val === 1) {
        this.router.push('/stockInquiryList?upc=' + this.barCode)
      } else if (val === 2) {
        this.router.push('/stockInquiryList?sku=' + this.skuNum)
      } else if (val === 3) {
        this.router.push('/stockInquiryList?itemDescription=' + this.pdtName)
      } else if (val === 4) {
        this.router.push('/stockInquiryList?binName=' + this.binName)
      }
    }
  },
  watch: {},
  mounted () {
    this.$emit('isInToken')
    this.$refs['barcode_num'].focus()
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
  width: 20%;
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

.pageVM>.content>.item>.searchButton {
  display: inline-block;
  width: 9.3%;
  height: 0.7rem;
  background-image: url(../../../static/img/searchPic.png);
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 20px 20px;
}
</style>
