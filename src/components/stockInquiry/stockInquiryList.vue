<template>
  <div class='pageVM' id='pageVM' >
    <my-header
      v-bind:message="headerInfo"
      v-on:exitFun="exitFun"
      v-on:goBackFun="goBackFun"
      v-on:goHomeFun="goHomeFun"
      ref='myheader'></my-header>
    <div class="content">
      <div class="pageControl" v-if="orderList.length>0">
        <div class="upPage"  v-on:click="goDataPage(pageIndex>1?pageIndex-1:pageIndex)">{{this.Gbl.LangFun(this.WL.text29, this.Gbl.wayMapUserLang)}}</div>
        <div class="goText">{{this.Gbl.LangFun(this.WL.text31, this.Gbl.wayMapUserLang)}}</div>
        <input type="number" class="goPageIndex" v-model="goPageIndex" />
        <div class="goButton" v-on:click="goDataPage(goPageIndex)"></div>
        <div class="pageNum">({{pageIndex}}/{{totalPageNum}}{{this.Gbl.LangFun(this.WL.pageText, this.Gbl.wayMapUserLang)}})</div>
        <div class="downPage" v-on:click="goDataPage(pageIndex<totalPageNum?pageIndex+1:pageIndex)">{{this.Gbl.LangFun(this.WL.text30, this.Gbl.wayMapUserLang)}}</div>
      </div>
      <p class="skuAndTotalnum">{{this.Gbl.LangFun(this.WL.text42, this.Gbl.wayMapUserLang)}}={{totalSku}}/{{totalIPdtNum}}</p>
      <ul class="orderList">
        <li class="item" v-for="(site,index) in orderList" v-bind:key="'index'+index">
          <div class="itemInfo">
            <div class="itemSUK">{{listText.text1}}:{{site.itemName}}</div>
            <div class="itemName">{{site.itemDescription}}</div>
            <div class="itemBatch" v-show="site.batchNum!==''">{{listText.text2}}:{{site.lotNumber}}</div>
            <div class="itemNumInfo">
              <div class="itemGoodsShelf">{{site.binName}}</div>
              <div class="itemOthers">{{listText.text3}}:{{site.quantityAvailable}}</div>
            </div>
          </div>
          <div class="itemIndex">{{index+1}}</div>
          <div class="leftLine"></div>
          <div class="rightLine"></div>
        </li>
        <li v-if="orderList.length===0" class="noData">{{this.Gbl.LangFun(this.WL.text44, this.Gbl.wayMapUserLang)}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import headerCpt from '../partVue/header.vue'
export default {
  name: 'stockInquiryList',
  data () {
    return {
      gainVarName: '',
      gainVarValue: '',
      goPageIndex: 1,
      headerInfo: {
        goBackUrl: '/stockInquiry',
        homeDir: true,
        logoDir: false,
        homePopCtr: false,
        backPopCtr: false,
        title: this.Gbl.LangFun(this.WL.text6, this.Gbl.wayMapUserLang),
        titleDir: true
      },
      listText: {
        text1: this.Gbl.LangFun(this.WL.skuText, this.Gbl.wayMapUserLang),
        text2: this.Gbl.LangFun(this.WL.text19, this.Gbl.wayMapUserLang),
        text3: this.Gbl.LangFun(this.WL.text68, this.Gbl.wayMapUserLang)
      },
      orderList: [],
      pageIndex: 1,
      totalPageNum: 1,
      totalIPdtNum: 0,
      totalSku: 0
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
    goDataPage (val) {
      this.searchResultFun(val)
    },
    goBackFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text94, this.Gbl.wayMapUserLang), 'goBack'])
    },
    goHomeFun () {
      this.$emit('exitEvent', [this.Gbl.LangFun(this.WL.text95, this.Gbl.wayMapUserLang), 'goHome'])
    },
    searchResultFun (val) {
      // 设置请求超时计时
      this.$emit('moreTimeSetTime', '')
      // 设置加载图
      this.$emit('loadingFun', true)
      // 获取清单数据
      var loginUrl1 = this.Gbl.commonUrl + '/item/getItemPage' + this.Gbl.commonVariaList + '&pageSize=10&pageNum=' + val + '&accountId=' + this.Gbl.wayMapAccountId + '&' + this.gainVarName + '=' + this.gainVarValue
      this.axios({
        method: 'post',
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
            var retData = response.data.result
            console.log(retData)
            this.orderList = retData.rows
            this.pageIndex = retData.pageNum
            this.totalPageNum = Math.ceil((retData.total - 0) / 10)
            this.totalSku = response.data.skuCount
            this.totalIPdtNum = response.data.itemTotal
            console.log(this.orderList)
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
    var pageUrl = window.location.href
    this.gainVarName = pageUrl.split('?')[1].split('=')[0]
    this.gainVarValue = pageUrl.split('?')[1].split('=')[1]
    this.searchResultFun(1)
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
.pageVM>.content>.pageControl {
  width: 100%;
  height: 0.5rem;
  margin: 0.145rem 0 0.062rem 0;
}

.pageVM>.content>.pageControl>.upPage {
  width: 17%;
  height: 0.479rem;
  line-height: 0.479rem;
  font-size: 14px;
  text-align: center;
  color: #333333;
  border: 1px solid #9f9f9d;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  float: left;
  margin-left: 5%;
}

.pageVM>.content>.pageControl>.goText {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 13.4%;
  height: 0.479rem;
  line-height: 0.479rem;
  text-align: right;
  padding-right: 2px;
  font-size: 14px;
  color: #333333;
  float: left;
}

.pageVM>.content>.pageControl>.goPageIndex {
  width: 11.5%;
  height: 0.479rem;
  line-height: 0.479rem;
  border: 1px solid #9e9e9e;
  text-align: center;
  font-size: 14px;
  color: #333333;
  float: left;
  border-radius: 0.083rem;
  background-color: #FFFFFF;
  text-align: center;
}

.pageVM>.content>.pageControl>.goButton {
  width: 8.75%;
  height: 0.479rem;
  float: left;
  background-repeat: no-repeat;
  background-position: center center;
  background-image: url(../../../static/img/searchPic.png);
  background-size: 71% auto;
}

.pageVM>.content>.pageControl>.pageNum {
  width: 19%;
  height: 0.479rem;
  line-height: 0.479rem;
  font-size: 14px;
  text-align: left;
  color: #333333;
  float: left;
}

.pageVM>.content>.pageControl>.downPage {
  width: 17%;
  height: 0.479rem;
  line-height: 0.479rem;
  font-size: 14px;
  text-align: center;
  color: #333333;
  border-radius: 0.083rem;
  border: 1px solid #9f9f9d;
  background-color: #FFFFFF;
  float: right;
  margin-right: 5%;
}

.pageVM>.content>.skuAndTotalnum {
  width: 100%;
  height: 0.416rem;
  font-size: 17px;
  line-height: 0.416rem;
  text-align: center;
  margin-top: 0.29rem;
  color: #3e403f;
}

.pageVM>.content>.orderList {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 6.5rem;
  border-top: 1px solid transparent;
  text-align: center;
  overflow: scroll;
}
.pageVM>.content .item {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 87.5%;
  height: auto;
  border: 1px solid #3f3f3f;
  border-top: none;
  border-radius: 0.083rem;
  margin: 0 auto;
  position: relative;
  margin-top: 0.25rem;
}

.pageVM>.content .noData {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 87.5%;
  height: 1.687rem;
  border: 1px solid #3f3f3f;
  border-radius: 0.083rem;
  margin: 0 auto;
  position: relative;
  margin-bottom: 0.083rem;
  text-align: center;
  line-height: 1.395rem;
  font-size: 14px;
  color: #747675;
}

.pageVM>.content .itemInfo {
  width: 95%;
  height: auto;
  min-height: 1.645rem;
  margin-left: 2%;
  border: 1px solid transparent;
}

.pageVM>.content .itemSUK {
  width: 100%;
  height: 0.458rem;
  line-height: 0.458rem;
  font-size: 14px;
  text-align: left;
  color: #3f3f41;
  overflow: hidden;
  margin-top: 0.1rem;
}

.pageVM>.content .itemName {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 14px;
  text-align: left;
  color: #3f3f41;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pageVM>.content .itemBatch {
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 14px;
  text-align: left;
  color: #3f3f41;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pageVM>.content .itemNumInfo {
  width: 100%;
  height: 0.25rem;
  margin-top: 0.104rem;
  margin-bottom: 0.1rem;
  display: -webkit-flex;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.pageVM>.content .itemGoodsShelf {
  width: auto;
  height: 0.25rem;
  line-height: 0.25rem;
  color: #3f3f41;
  font-size: 12px;
}

.pageVM>.content .itemOthers {
  width: auto;
  height: 0.25rem;
  line-height: 0.25rem;
  color: #3f3f41;
  font-size: 12px;
}

.pageVM>.content .itemIndex {
  width: 0.229rem;
  height: 0.25rem;
  text-align: center;
  line-height: 0.25rem;
  font-size: 12px;
  position: absolute;
  top: -0.125rem;
  left: 48.2%;
}

.pageVM>.content .leftLine {
  width: 46%;
  height: 0.062rem;
  border-bottom: 1px solid #3f3f3f;
  position: absolute;
  top: -0.083rem;
  left: 0.041rem;
}

.pageVM>.content .rightLine {
  width: 46%;
  height: 0.062rem;
  border-bottom: 1px solid #3f3f3f;
  position: absolute;
  top: -0.083rem;
  right: 0.041rem;
}
</style>
