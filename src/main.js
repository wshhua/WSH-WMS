import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Gbl from '@/components/global'
import WL from '@/components/wmsLang'
import('babel-polyfill')

Vue.config.productionTip = false
// vue 中注册js
Vue.prototype.router = router
Vue.prototype.Gbl = Gbl
Vue.prototype.WL = WL
Vue.use(VueAxios, axios)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
