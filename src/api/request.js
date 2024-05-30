import Axios from 'axios'
import CONF from '@/config'
import $checkLogin from '@/utils/checkLogin'
// import { doDecrypt } from '../utils/sm2'

Axios.defaults.timeout = 300000
Axios.defaults.withCredentials = true
Axios.defaults.baseURL = CONF.baseURL + '/api'

function getSID() {
  if(wx.getStorageSync('SID')){
    return JSON.parse(wx.getStorageSync('SID'))
  }
}

Axios.defaults.adapter = function (config) {
  return new Promise((resolve, reject) => {
    var settle = require('axios/lib/core/settle') // settle操作，会额外判断是否是合理的status状态
    var buildURL = require('axios/lib/helpers/buildURL') // url拼接方法
    console.log(`传参数据----${JSON.stringify(config.data)}`)
    console.log(`传参接口----${JSON.stringify(config.url)}`)

    wx.request({
      method: config.method.toUpperCase(),
      url: config.baseURL +
        buildURL(config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      timeout: 5000,
      complete: function complete(response) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config
        }
        console.log(`返回数据----${JSON.stringify(response)}`)
        settle(resolve, reject, response)
      },
      fail(e) {
        console.log(`请求报错---${e}`)
        reject(e);
      }
    })
  })
}

Axios.interceptors.request.use(async config => {
  config.headers['Content-Type'] = 'application/json; charset=utf-8'
  const SID = getSID()
  if (SID) {
    config.headers[SID.tokenName] = `Bearer ${SID.tokenValue}`
    console.log(`token----${SID.tokenValue}`)
  }
  return config
})

Axios.interceptors.response.use(
  async res => {
    console.log(`请求返回状态---${res.status}`)
    if (res.status === 200) {
      //登录失效
      if(res.data.code === 9999){
        console.log('token失效，重新登录')
        //登录
        await $checkLogin.getGrant()

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              resolve(Axios(res.config))
            } catch (err) {
              reject(err)
            }
          }, 1500)
        })
      }else{
        return res.data.data
      }
    }
  },
  err => {
    uni.removeStorageSync('isLogin')
    uni.showToast({title: err.response.data.msg, icon: 'none', duration: 2000})
    return Promise.reject(err.response.data.msg)
  }
)