<template>
    <div id="app">
        <template v-if="show">
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
                            <span class="user">BOT选项<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="restart">重启BOT</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown @command="handleCommand">
                            <span class="user">个人选项<i class="el-icon-arrow-down el-icon--right"></i></span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="editPassword">修改密码</el-dropdown-item>
                                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="main-body">
                    <SubPage :title="getTitle()">
                        <router-view></router-view>
                    </SubPage>
                </div>
                <div class="icp">
                    <a href="https://beian.miit.gov.cn" target="_blank">{{ icp }}</a>
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
            </template>
            <div class="content" v-else>
                <router-view></router-view>
            </div>
        </template>
        <template v-else>
            <div class="tips">
                <div>分辨率太低啦…</div>
                <div>请至少使用 <span style="color: #7350ff;font-weight: bold">1024 X 500</span> 的窗口使用哦</div>
            </div>
        </template>
    </div>
</template>

<script>
import SubPage from '@/app/Index/Dashboard/Elem/SubPage'
import eWindow from '@/components/eWindow/comp/eWindow'

export default {
    name: 'App',
    components: {
        SubPage,
        eWindow
    },
    methods: {
        getTitle: function () {
            const path = this.$route.path
            for (let item of this.nav.list) {
                if (item.path === path) {
                    return item.name.toUpperCase()
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
                case 'restart':
                    this.lib.message.confirm('确定重启', '注意', () => {
                        this.lib.requests.post({url: '/restart'})
                    })
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
        },
        checkClientSize: function () {
            if (document.body.clientWidth < 360 || document.body.clientHeight < 500) {
                this.show = false
                return
            }
            this.show = true
        }
    },
    data () {
        return {
            nav: {
                list: [
                    {path: '/index', name: '消息统计'},
                    {path: '/group', name: '群组管理'},
                    {path: '/user', name: '用户管理'},
                    {path: '/gacha', name: '卡池管理'},
                    {path: '/admin', name: '权限管理'},
                    {path: '/function', name: '功能设置'},
                    {path: '/source', name: '资源管理'}
                ]
            },
            form: {
                password: '',
                newPassword: '',
                newPasswordConfirm: ''
            },
            icp: window.icp,
            show: false
        }
    },
    mounted () {
        window.onresize = this.checkClientSize
        this.checkClientSize()
    }
}
</script>

<style src="./App-global.css"></style>
<style src="./App-scoped.css" scoped></style>
