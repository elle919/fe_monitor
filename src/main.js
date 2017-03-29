import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import Global from './store/store.js'
import ViewError from './views/error.vue'
//引入element.ui和它的css
import 'element-ui/lib/theme-default/index.css'
import {Pagination} from 'element-ui'

Vue.use(Pagination)
Vue.config.debug = true;

//注册全局组件
import * as Commponent  from "./components/index"
for(const name in Commponent){
    Vue.component(name, Commponent[name])
}

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
	{
		path: '/',
		redirect: '/error/dianjing'
	},
    {   path: '/error/:platform',
        component: ViewError
    }
]

const router = new VueRouter({routes:routes})

const app = new Vue({
    router:router,
    render:h => h(App)
}).$mount('#app')

