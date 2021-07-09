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
            </div>
            <div class="main-body">
                <SubPage :title="getTitle()">
                    <router-view></router-view>
                </SubPage>
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
        }
    },
    data () {
        return {
            nav: {
                list: [
                    {path: '/index', name: 'Dashboard', title: 'Dashboard'},
                    {path: '/group', name: 'Group', title: '群组管理'},
                    {path: '/user', name: 'Users', title: '用户管理'},
                    {path: '/gacha', name: 'Gacha', title: '抽卡相关管理'},
                    {path: '/config', name: 'Config', title: 'Bot 设置'}
                ]
            }
        }
    },
    mounted () {
        window.login = () => {
            this.lib.requests.post({
                url: '/login',
                data: {
                    userId: '826197021',
                    password: '123456'
                }
            })
        }
        window.logout = () => {
            this.lib.requests.post({
                url: '/logout'
            })
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
    padding: 20px 30px;
    background: #f3f4fa;
}
</style>
