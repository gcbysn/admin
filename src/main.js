import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as API from '@/api'
import './plugins/vcharts'

import '@/icons' // icon
import '@/permission' // permission control

Vue.prototype.$API=API;

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.directive('has-permission',{
    inserted(el,{value}){
      // console.log('inserted')
      // 1.判断当前用户是否具有使用该按钮的权限
    //   console.log(store.state.user.buttons[value])
      if(!store.state.user.buttons[value]){
        // 如果用户没有权限,就会进入该判断
        // 既然没有使用该按钮的权限,那么就删除把
        el.parentNode.removeChild(el);
      }
    }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
