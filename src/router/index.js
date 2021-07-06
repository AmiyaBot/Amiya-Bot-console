import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/app/Login'
import Dashboard from '@/app/Index/Dashboard/Dashboard'
import UserManager from '@/app/Index/User/UserManager'
import GachaManager from '@/app/Index/Gacha/GachaManager'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/index',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/user',
            name: 'UserManager',
            component: UserManager
        },
        {
            path: '/gacha',
            name: 'GachaManager',
            component: GachaManager
        }
    ]
})
