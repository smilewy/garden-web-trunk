import 'babel-polyfill'
import Vue from 'vue'
import 'amfe-flexible';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import App from '@/App.vue'
import router from '@/router/router'
import prototype from '@/assets/js/prototype.js'

import '@/assets/css/common.css';

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(prototype)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
