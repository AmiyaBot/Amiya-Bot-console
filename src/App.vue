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
                    <div @click="logout">
                        <span>Logout</span>
                    </div>
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
        </template>
        <router-view v-else></router-view>
    </div>
</template>

<script>
import SubPage from '@/app/Index/Dashboard/Elem/SubPage'

export default {
    name: 'App',
    components: {
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
                    {path: '/index', name: 'Dashboard', title: '概况看板'},
                    {path: '/group', name: 'Group', title: '群组管理'},
                    {path: '/user', name: 'Users', title: '用户管理'},
                    {path: '/gacha', name: 'Gacha', title: '抽卡管理'},
                    {path: '/config', name: 'Config', title: 'Bot 设置'}
                ]
            },
            icp: window.icp
        }
    }
}
</script>

<style src="./App.css"></style>
<style scoped>
.main-header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #fff;
    background: #5F75ED;
    display: flex;
}

.main-header > .title {
    font-size: 20px;
    padding: 0 20px;
    position: relative;
}

.main-header > .title:after {
    content: '';
    height: 20px;
    border-right: 1px solid #fff;
    position: absolute;
    top: calc(50% - 10px);
    right: 0;
    opacity: 0.5;
}

.main-header > .nav {
    padding: 0 10px;
    display: flex;
}

.main-header > .nav span {
    user-select: none;
}

.main-header > .nav > div {
    padding: 0 10px;
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    transition: all 300ms linear;
    cursor: pointer;
}

.main-header > .nav > div.curr {
    color: rgb(255, 186, 49);
}

.main-header > .nav > div:hover {
    background: rgba(255, 255, 255, 0.1);
}

.main-body {
    width: 100%;
    height: calc(100% - 50px);
    padding: 20px 30px 30px;
    background: #f3f4fa;
}

.icp {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
}

.icp a {
    color: #555;
}
</style>
