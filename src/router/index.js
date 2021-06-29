import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/app/Login'
import IndexPage from '@/app/Index/IndexPage'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/',
            name: 'IndexPage',
            component: IndexPage
        },
        {
            path: '/index',
            name: 'IndexPage',
            component: IndexPage
        }
    ]
})
