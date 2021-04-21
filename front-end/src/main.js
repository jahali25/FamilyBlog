import Vue from 'vue'
import App from './App.vue'
import router from './router'
import icons from './iconList.js'

Vue.config.productionTip = false

let data = {
  user: null,
  isAdmin: false,
  isBanned: true,
  icons: icons
}

new Vue({
  data,
  router,
  render: h => h(App)
}).$mount('#app')
