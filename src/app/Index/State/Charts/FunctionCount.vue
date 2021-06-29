<template>
    <div class="function-count">
        <div ref="chart"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
    name: 'FunctionCount',
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
                    text: 'Functions used'
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    top: 40,
                    left: 0,
                    bottom: 20
                },
                tooltip: {
                    trigger: 'item'
                },
                series: {
                    type: 'pie',
                    radius: ['50%', '80%'],
                    center: ['65%', '50%'],
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        fontSize: '20',
                        fontWeight: 'bold',
                        position: 'center',
                        formatter: '{b}\n\n{c}'
                    },
                    minAngle: 10,
                    data: []
                }
            }
            const data = this.data

            for (let item of data) {
                option.series.data.push({
                    name: item['function_id'],
                    value: item['function_use_num']
                })
            }

            option.series.data.sort((a, b) => b.value - a.value)
            option.series.data[0].selected = true
            option.series.data[0].label = {show: true}

            this.chart.setOption(option)
        },
        getFunctionUsed: function () {
            this.lib.requests.post({
                url: '/function/getFunctionUsed',
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
        this.getFunctionUsed()
    }
}
</script>

<style scoped>
.function-count {
    width: 500px;
    height: 300px;
    padding: 20px;
}

.function-count > div {
    width: 100%;
    height: 100%;
}
</style>
