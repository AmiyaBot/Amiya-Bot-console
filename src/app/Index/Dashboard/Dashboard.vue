<template>
    <div class="dashboard">
        <div class="information">
            <NumberCard :value="cards.reply" color="5f75ed">
                <template>
                    <span>Reply</span>
                    <span>Within 24 hours</span>
                </template>
            </NumberCard>
            <NumberCard :value="cards.activeUsers" color="ff7ea8">
                <template>
                    <span>Active users</span>
                    <span>Within 24 hours</span>
                </template>
            </NumberCard>
            <NumberCard :value="cards.speed + '/min'" color="56d47d">
                <template>
                    <span>Reel time</span>
                    <span>Receiving speed</span>
                </template>
            </NumberCard>
        </div>
        <div class="charts">
            <div class="left-side">
                <MessageCount></MessageCount>
                <div class="seat seat-left-row2"></div>
            </div>
            <div class="right-side">
                <FunctionCount></FunctionCount>
                <div class="seat seat-right-row1-right"></div>
                <UserSignIn></UserSignIn>
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
