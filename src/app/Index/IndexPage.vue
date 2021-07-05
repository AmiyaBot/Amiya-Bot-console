<template>
    <div class="index-page">
        <div class="main-header">
            <div class="title">Amiya-bot Console</div>
            <div class="nav">
                <div v-for="(item, index) in nav.list"
                     :key="index"
                     :class="{ curr: index === nav.currIndex }"
                     @click="nav.currIndex = index">
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>
        <div class="main-body">
            <SubPage :title="nav.list[nav.currIndex].title">
                <State v-if="nav.currIndex === 0"></State>
                <UserManager v-if="nav.currIndex === 2"></UserManager>
                <GachaManager v-if="nav.currIndex === 3"></GachaManager>
            </SubPage>
        </div>
    </div>
</template>

<script>
import SubPage from '@/app/Index/State/Elem/SubPage'
import State from '@/app/Index/State/State'
import UserManager from '@/app/Index/User/UserManager'
import GachaManager from '@/app/Index/Gacha/GachaManager'

export default {
    name: 'IndexPage',
    components: {
        SubPage,
        State,
        UserManager,
        GachaManager
    },
    data () {
        return {
            nav: {
                list: [
                    {name: 'State', title: 'Amiya\'s state'},
                    {name: 'Group', title: ''},
                    {name: 'Users', title: 'Users Manager'},
                    {name: 'Gacha', title: 'Gacha Manager'},
                    {name: 'Config', title: 'Bot Configure'}
                ],
                currIndex: 3
            }
        }
    }
}
</script>

<style scoped>
.index-page {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

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
    padding: 20px 50px;
    background: #f3f4fa;
}
</style>
