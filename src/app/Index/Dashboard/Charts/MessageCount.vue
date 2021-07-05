<template>
    <div class="message-count">
        <div ref="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    name: 'MessageCount',
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
                title: {
                    text: 'Messages analysis'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                legend: {
                    data: ['Chat', 'Call', 'Reply']
                },
                axisPointer: {
                    link: {xAxisIndex: 'all'}
                },
                grid: [
                    {
                        left: '10%',
                        right: '4%',
                        height: '35%'
                    },
                    {
                        top: '60%',
                        left: '10%',
                        right: '4%',
                        height: '35%'
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {onZero: true},
                        axisLabel: {show: false},
                        data: []
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {onZero: true},
                        data: [],
                        position: 'top'
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        offset: 15
                    },
                    {
                        type: 'value',
                        inverse: true,
                        gridIndex: 1,
                        offset: 15
                    }
                ],
                color: ['#5f75ed', '#ffba31', '#56d47d'],
                series: [
                    {
                        name: 'Chat',
                        type: 'line',
                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgba(0, 221, 255)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(77, 119, 255)'
                                }
                            ])
                        },
                        label: {
                            show: true
                        },
                        data: [],
                        smooth: true
                    },
                    {
                        name: 'Call',
                        type: 'bar',
                        barMaxWidth: 10,
                        stack: 'count',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        data: [],
                        smooth: true
                    },
                    {
                        name: 'Reply',
                        type: 'bar',
                        barMaxWidth: 10,
                        stack: 'count',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        label: {
                            show: true,
                            position: 'bottom'
                        },
                        data: [],
                        smooth: true
                    }
                ]
            }
            const data = this.data

            for (let time in data) {
                option.xAxis[0].data.unshift(time)
                option.xAxis[1].data.unshift(time)
                option.series[0].data.unshift(data[time]['talk'])
                option.series[1].data.unshift(data[time]['call'])
                option.series[2].data.unshift(data[time]['reply'])
            }

            this.chart.setOption(option)
        },
        getMessageAnalysis: function () {
            this.lib.requests.post({
                url: '/message/getMessageAnalysis',
                success: res => {
                    this.$set(this, 'data', res.data)
                }
            })
        }
    },
    data () {
        return {
            chart: null,
            data: null
        }
    },
    mounted () {
        this.chart = echarts.init(this.$refs.chart)
        this.getMessageAnalysis()
    }
}
</script>

<style scoped>
.message-count {
    width: 100%;
    height: 400px;
    padding: 20px;
}

.message-count > div {
    width: 100%;
    height: 100%;
}
</style>
