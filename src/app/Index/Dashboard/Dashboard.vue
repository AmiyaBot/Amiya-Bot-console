<template>
    <div class="dashboard">
        <div class="information">
            <number-card :value="cards.reply" color="5f75ed">
                <template>
                    <span>24小时内</span>
                    <span>总回复次数</span>
                </template>
            </number-card>
            <number-card :value="cards.activeUsers" color="ff7ea8">
                <template>
                    <span>24小时内</span>
                    <span>活跃用户总数</span>
                </template>
            </number-card>
            <number-card :value="cards.speed + '/min'" color="56d47d">
                <template>
                    <span>瞬时</span>
                    <span>消息吞吐量</span>
                </template>
            </number-card>
            <div style="font-size: 12px">
                本页数据为缓存数据，缓存数据在有效期内将不会刷新。有效期约5分钟。
            </div>
        </div>
        <div class="charts">
            <div class="left-side">
                <message-count></message-count>
                <div class="seat seat-left-row2"></div>
            </div>
            <div class="right-side">
                <function-count></function-count>
                <user-sign-in></user-sign-in>
            </div>
        </div>
    </div>
</template>

<script>
import NumberCard from '@/app/Index/Dashboard/Elem/NumberCard'
import UserSignIn from '@/app/Index/Dashboard/Charts/UserSignIn'
import MessageCount from '@/app/Index/Dashboard/Charts/MessageCount'
import FunctionCount from '@/app/Index/Dashboard/Charts/FunctionCount'

export default {
    name: 'Dashboard',
    components: {
        NumberCard,
        UserSignIn,
        MessageCount,
        FunctionCount
    },
    methods: {
        getRealTimeData: function () {
            this.lib.requests.post({
                url: '/dashboard/getRealTimeData',
                success: res => {
                    this.$set(this, 'cards', res)
                }
            })
        }
    },
    data () {
        return {
            cards: {
                reply: 0,
                activeUsers: 0,
                speed: 0
            }
        }
    },
    mounted () {
        this.getRealTimeData()
    }
}
</script>

<style scoped src="./Dashboard.css"></style>
