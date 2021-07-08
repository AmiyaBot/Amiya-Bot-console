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
                    <span>实时</span>
                    <span>消息接收速度</span>
                </template>
            </number-card>
        </div>
        <div class="charts">
            <div class="left-side">
                <message-count></message-count>
                <div class="seat seat-left-row2"></div>
            </div>
            <div class="right-side">
                <function-count></function-count>
                <div class="seat seat-right-row1-right"></div>
                <user-sign-in></user-sign-in>
                <div class="seat seat-right-row2-right"></div>
                <div class="seat seat-right-row3-bottom"></div>
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
        getTotalMessage: function () {
            this.lib.requests.post({
                url: '/message/getTotalMessage',
                success: res => {
                    for (let item of res.data) {
                        if (item['msg_type'] === 'reply') {
                            this.cards.reply = item['total']
                        }
                    }
                }
            })
        },
        getMessageSpeed: function () {
            this.lib.requests.post({
                url: '/message/getMessageSpeed',
                success: res => {
                    this.cards.speed = res.data
                }
            })
        },
        getActiveUsers: function () {
            this.lib.requests.post({
                url: '/user/getActiveUsers',
                success: res => {
                    this.cards.activeUsers = res.data
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
        this.getTotalMessage()
        this.getMessageSpeed()
        this.getActiveUsers()
    }
}
</script>

<style scoped src="./Dashboard.css"></style>
