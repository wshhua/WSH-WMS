import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
const Login = () => import('@/components/login') // 登录
const Home = () => import('@/components/home/home') // 首页
const StockInHome = () => import('@/components/home/stockInHome') // 入库首页
const AllotSearchIn = () => import('@/components/allot/allotSearchIn') // 调拨入库
const AllotDetailIn = () => import('@/components/allot/allotDetailIn')
const AllotListIn = () => import('@/components/allot/allotListIn')
const AllotSearchOut = () => import('@/components/allot/allotSearchOut') // 调拨出库
const AllotDetailOut = () => import('@/components/allot/allotDetailOut')
const AllotListOut = () => import('@/components/allot/allotListOut')
const BindBasket = () => import('@/components/bindBasket/bindBasket') // 绑定拣选框
const CheckSearch = () => import('@/components/check/checkSearch') // 盘点
const CheckDetail = () => import('@/components/check/checkDetail')
const CheckList = () => import('@/components/check/checkList')
const DeliveryTaskSearch = () => import('@/components/deliveryTask/deliveryTaskSearch') // 发货任务
const BigBagDeliveryDetail = () => import('@/components/deliveryTask/bigBagDeliveryDetail')
const SmallBagDeliveryDetail = () => import('@/components/deliveryTask/smallBagDeliveryDetail')
const BigBagDeliveryList = () => import('@/components/deliveryTask/bigBagDeliveryList')
const PurchaseSearch = () => import('@/components/purchase/purchaseSearch') // 采购入库
const PurchaseDetail = () => import('@/components/purchase/purchaseDetail')
const PurchaseList = () => import('@/components/purchase/purchaseList')
const PurchaseReturnSearch = () => import('@/components/purchase/purchaseReturnSearch') // 采购退货
const PurchaseReturnDetail = () => import('@/components/purchase/purchaseReturnDetail')
const PurchaseReturnList = () => import('@/components/purchase/purchaseReturnList')
const SalesSearch = () => import('@/components/sales/salesSearch') // 销售发货
const SalesDetail = () => import('@/components/sales/salesDetail')
const SalesList = () => import('@/components/sales/salesList')
const SalesReturnSearch = () => import('@/components/sales/salesReturnSearch') // 销售退货
const SalesReturnDetail = () => import('@/components/sales/salesReturnDetail')
const SalesReturnList = () => import('@/components/sales/salesReturnList')
const UserSet = () => import('@/components/set/userSet') // 设置
const ChangePwd = () => import('@/components/set/changePwd')
const StockInquiry = () => import('@/components/stockInquiry/stockInquiry') // 库存查询
const StockInquiryList = () => import('@/components/stockInquiry/stockInquiryList')
const StockMoveSearch = () => import('@/components/stockMove/stockMoveSearch') // 移库
const StockMoveDetail = () => import('@/components/stockMove/stockMoveDetail')
const StockMoveList = () => import('@/components/stockMove/stockMoveList')
const NoOrderDetail = () => import('@/components/stockMove/noOrderDetail')
const SuccessResult = () => import('@/components/result/successResult') // 提交结果页面
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', // 登录页
      name: 'Login',
      component: Login
    },
    {
      path: '/home', // 首页
      name: 'Home',
      component: Home
    },
    {
      path: '/stockInHome', // 首页
      name: 'StockInHome',
      component: StockInHome
    },
    {
      path: '/allotSearchIn', // 调拨入库
      name: 'AllotSearchIn',
      component: AllotSearchIn
    },
    {
      path: '/allotDetailIn',
      name: 'AllotDetailIn',
      component: AllotDetailIn
    },
    {
      path: '/allotListIn',
      name: 'AllotListIn',
      component: AllotListIn
    },
    {
      path: '/allotSearchOut', // 调拨出库
      name: 'AllotSearchOut',
      component: AllotSearchOut
    },
    {
      path: '/allotDetailOut',
      name: 'AllotDetailOut',
      component: AllotDetailOut
    },
    {
      path: '/allotListOut',
      name: 'AllotListOut',
      component: AllotListOut
    },
    {
      path: '/bindBasket', // 绑定拣选框
      name: 'BindBasket',
      component: BindBasket
    },
    {
      path: '/checkSearch', // 盘点
      name: 'CheckSearch',
      component: CheckSearch
    },
    {
      path: '/checkDetail',
      name: 'CheckDetail',
      component: CheckDetail
    },
    {
      path: '/checkList',
      name: 'CheckList',
      component: CheckList
    },
    {
      path: '/deliveryTaskSearch', // 发货任务
      name: 'DeliveryTaskSearch',
      component: DeliveryTaskSearch
    },
    {
      path: '/smallBagDeliveryDetail',
      name: 'SmallBagDeliveryDetail',
      component: SmallBagDeliveryDetail
    },
    {
      path: '/bigBagDeliveryDetail',
      name: 'BigBagDeliveryDetail',
      component: BigBagDeliveryDetail
    },
    {
      path: '/bigBagDeliveryList',
      name: 'BigBagDeliveryList',
      component: BigBagDeliveryList
    },
    {
      path: '/purchaseSearch', // 采购入库
      name: 'PurchaseSearch',
      component: PurchaseSearch
    },
    {
      path: '/purchaseDetail',
      name: 'PurchaseDetail',
      component: PurchaseDetail
    },
    {
      path: '/purchaseList',
      name: 'PurchaseList',
      component: PurchaseList
    },
    {
      path: '/purchaseReturnSearch', // 采购退货
      name: 'PurchaseReturnSearch',
      component: PurchaseReturnSearch
    },
    {
      path: '/purchaseReturnDetail',
      name: 'PurchaseReturnDetail',
      component: PurchaseReturnDetail
    },
    {
      path: '/purchaseReturnList',
      name: 'PurchaseReturnList',
      component: PurchaseReturnList
    },
    {
      path: '/salesSearch', // 销售发货
      name: 'SalesSearch',
      component: SalesSearch
    },
    {
      path: '/salesDetail',
      name: 'SalesDetail',
      component: SalesDetail
    },
    {
      path: '/salesList',
      name: 'SalesList',
      component: SalesList
    },
    {
      path: '/salesReturnSearch', // 销售退货
      name: 'SalesReturnSearch',
      component: SalesReturnSearch
    },
    {
      path: '/salesReturnDetail',
      name: 'SalesReturnDetail',
      component: SalesReturnDetail
    },
    {
      path: '/salesReturnList',
      name: 'SalesReturnList',
      component: SalesReturnList
    },
    {
      path: '/userSet', // 设置
      name: 'UserSet',
      component: UserSet
    },
    {
      path: '/changePwd',
      name: 'ChangePwd',
      component: ChangePwd
    },
    {
      path: '/stockInquiry', // 库存查询
      name: 'StockInquiry',
      component: StockInquiry
    },
    {
      path: '/stockInquiryList',
      name: 'StockInquiryList',
      component: StockInquiryList
    },
    {
      path: '/stockMoveSearch', // 移库
      name: 'StockMoveSearch',
      component: StockMoveSearch
    },
    {
      path: '/stockMoveDetail',
      name: 'StockMoveDetail',
      component: StockMoveDetail
    },
    {
      path: '/stockMoveList',
      name: 'StockMoveList',
      component: StockMoveList
    },
    {
      path: '/noOrderDetail',
      name: 'NoOrderDetail',
      component: NoOrderDetail
    },
    {
      path: '/successResult', // 提交结果页面
      name: 'SuccessResult',
      component: SuccessResult
    }
  ]
})
