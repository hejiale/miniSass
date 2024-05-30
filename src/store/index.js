import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import createLoadingPlugin from '@/utils/vuex-loading'

// 文件自动导入
const files = require.context('./modules', false, /\.js$/)
const modules = {}
files.keys().forEach(key => {
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

// 创建主 Vuex Store
export default new Vuex.Store({
  plugins: [createLoadingPlugin()],
  modules
})
