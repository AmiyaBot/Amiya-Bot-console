<template>
    <div class="user-sign-in">
        <div ref="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    name: 'UserSignIn',
    watch: {
        data: {
            handler: function () {
                this.load()
            },
            deep: true
        }
    },
    methods: {
        load: function () {
            const option = {
                grid: {
                    top: '3%',
                    left: '3%',
                    right: '12%',
                    bottom: '3%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                xAxis: {
                    type: 'value',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'category',
                    axisLabel: {
                        color: '#333',
                        fontWeight: 'bold'
                    },
                    data: ['签到用户']
                },
                color: ['#56d47d', '#d7d7d7'],
                series: [
                    {
                        name: '已签到',
                        type: 'bar',
                        stack: 'count',
                        data: []
                    },
                    {
                        name: '未签到',
                        type: 'bar',
                        stack: 'count',
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '30%'
                        },
                        data: []
                    }
                ]
            }
            const data = this.data

            option.series[0].data = [data[1]]
            option.series[1].data = [data[0] - data[1]]
            option.series[1].label.formatter = (data[1] / data[0] * 100).toFixed(2) + '%'

            this.chart.setOption(option)
        },
        getUserSignData: function () {
            this.lib.requests.post({
                url: '/dashboard/getUserSignRate',
                success: res => {
                    this.$set(this, 'data', res)
                }
            })
        }
    },
    data () {
        return {
            chart: null,
            data: {
                0: 0,
                1: 0
            }
        }
    },
    mounted () {
        this.chart = echarts.init(this.$refs.chart)
        this.getUserSignData()
    }
}
</script>

<style scoped>
.user-sign-in {
    width: 500px;
    height: 100px;
    padding: 20px;
}

.user-sign-in > div {
    width: 100%;
    height: 100%;
}
</style>
