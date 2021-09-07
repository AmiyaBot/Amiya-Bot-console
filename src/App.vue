<template>
    <div id="app">
        <template v-if="$route.path !== '/'">
            <div class="main-header">
                <div class="title">Amiya-bot Console</div>
                <div class="nav">
                    <div v-for="item in nav.list" :key="item.path" :class="{ curr: item.path === $route.path }"
                         @click="$router.push(item.path)">
                        <span>{{ item.name }}</span>
                    </div>
                </div>
                <div class="user-menu">
                    <el-dropdown @command="handleCommand">
                        <span class="user">登录菜单<i class="el-icon-arrow-down el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <e-window title="修改密码" type="form" ref="editPassword" :submit="editPassword">
                <el-form-item label="原密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input type="password" v-model="form.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码">
                    <el-input type="password" v-model="form.newPasswordConfirm"></el-input>
                </el-form-item>
            </e-window>
            <div class="main-body">
                <SubPage :title="getTitle()">
                    <router-view></router-view>
                </SubPage>
            </div>
            <div class="icp">
                <a href="https://beian.miit.gov.cn" target="_blank">{{ icp }}</a>
            </div>
        </template>
        <router-view v-else></router-view>
    </div>
</template>

<script>
import SubPage from '@/app/Index/Dashboard/Elem/SubPage'
import EWindow from '@/components/eWindow/comp/eWindow'

export default {
    name: 'App',
    components: {
        EWindow,
        SubPage
    },
    methods: {
        getTitle: function () {
            const path = this.$route.path
            for (let item of this.nav.list) {
                if (item.path === path) {
                    return item.title.toUpperCase()
                }
            }
            return 'None'
        },
        handleCommand: function (command) {
            switch (command) {
                case 'editPassword':
                    this.$refs.editPassword.show()
                    break
                case 'logout':
                    this.logout()
                    break
            }
        },
        editPassword: function () {
            if (this.form.newPassword !== this.form.newPasswordConfirm) {
                this.lib.message.notify('新密码不一致')
                return false
            }
            this.lib.requests.post({
                url: '/editPassword',
                data: this.form,
                successMessage: true,
                success: res => {
                    this.$refs.editPassword.hide()
                }
            })
        },
        logout: function () {
            this.lib.message.confirm('确定退出登录吗？', '退出登录', () => {
                this.lib.requests.post({
                    url: '/logout',
                    success: res => {
                        location.href = '/'
                    }
                })
            })
        }
    },
    data () {
        return {
            nav: {
                list: [
                    {path: '/index', name: '概况看板', title: '概况看板'},
                    {path: '/group', name: '群组', title: '群组管理'},
                    {path: '/user', name: '用户', title: '用户管理'},
                    {path: '/gacha', name: '抽卡', title: '抽卡管理'},
                    {path: '/trace', name: '管理员', title: '管理员管理'},
                    {path: '/config', name: '设置', title: 'Bot 设置'}
                ]
            },
            form: {
                password: '',
                newPassword: '',
                newPasswordConfirm: ''
            },
            icp: window.icp
        }
    }
}
</script>

<style src="./App.css"></style>
<style src="./App-scoped.css" scoped></style>
