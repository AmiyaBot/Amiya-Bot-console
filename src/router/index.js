import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/app/Login'
import Dashboard from '@/app/Index/Dashboard/Dashboard'
import UserManager from '@/app/Index/User/UserManager'
import GroupManager from '@/app/Index/Group/GroupManager'
import GachaManager from '@/app/Index/Gacha/GachaManager'
import ReplaceManager from '@/app/Index/Replace/ReplaceManager'
import AdminManager from '@/app/Index/Admin/AdminManager'

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
            path: '/group',
            name: 'GroupManager',
            component: GroupManager
        },
        {
            path: '/gacha',
            name: 'GachaManager',
            component: GachaManager
        },
        {
            path: '/replace',
            name: 'ReplaceManager',
            component: ReplaceManager
        },
        {
            path: '/admin',
            name: 'AdminManager',
            component: AdminManager
        }
    ]
})
