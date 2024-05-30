import Vue from 'vue'
import App from './App'
import checkLogin from './utils/checkLogin'
import enums from '@/utils/enums'
import _ from '@/utils/lodash'
import './components/index'
import api from '@/api'
import './api/request'
import filters from './utils/filters'
import CONF from './config'
import store from './store'
import dayjs from 'dayjs'
import iconFont from './utils/icon-font'

Vue.config.productionTip = false
Vue.prototype.$checkLogin = checkLogin
Vue.prototype.$enums = enums
Vue.prototype.$_ = _
Vue.prototype.$api = api
Vue.prototype.$CONF_DATE = CONF
Vue.prototype.$store = store
Vue.prototype.$filters = filters
Vue.prototype.$dayjs = dayjs
Vue.prototype.$iconFont = iconFont
Vue.prototype.__HOLDER__ = () => {};

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()