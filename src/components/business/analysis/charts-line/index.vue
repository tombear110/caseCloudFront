<template>
<div class="charts-card" style="margin-right:0">
    <div class="charts-card__header">
        <div class="header-title">
            {{title}}
        </div>
    </div>
    <div class="charts-card__body">
        <div class="charts-none"  v-show="noData" key="no-data">
            <div class="charts-none__center" >
                <icon-svg name="icon-zanwujilu" class="charts-none__center--icon"/>
                <div class="charts-none__center--text">暂无数据</div>
            </div>
        </div>
        <div class="charts-box" style="width:100%;height:500px" v-show="!noData">
            <IEcharts theme="wonderland" :resizable="true" :notMerge="true" :option="optionsLine" @ready="onReady" class="charts" />
        </div>
    </div>
</div>
</template>

<script>

import '../theme/wonderland'
export default {
    props: {
        chartsData: {
            type: Object,
        }
    },
    components: {},
    data() {
        return {
            noData:false,
            title: '',
            optionsLine: {},
            month: '',
        }
    },
    watch: {
        chartsData(val) {
            this.title = val.title
            this.noData = val.x.length === 0
            this.optionsLine.series[0].data = val.y
            this.optionsLine.xAxis.data = val.x
            this.month = val.month.split('-')[1]
            this.optionsLine.xAxis.data = val.x.map(item => item < 10 ? `0${item}` : item)
        },
    },
    methods: {

        onReady(instance, echarts) {
            const that = this
            that.optionsLine = {
                tooltip: {
                    trigger: 'none',
                    axisPointer: {
                        type: 'cross',
                        // label: {
                        //     backgroundColor: '#6a7985'
                        // }
                    }
                },
                legend: {
                    data: ['日期：', ]
                },
                xAxis: {
                    type: 'category',
                    name: '(日期)',
                    //    splitLine:{
                    //         show:false
                    //     },
                    // boundaryGap: false,
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        // onZero: false,
                        lineStyle: {
                            color: '#6a7985'
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return `日/工时 ${that.month}-${params.value}：${params.seriesData.length ?  params.seriesData[0].data : ''}h`
                            }
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    name: '(h)',
                    axisLine: {
                        // onZero: false,
                        lineStyle: {
                            color: '#6a7985'
                        }
                    },
                    // boundaryGap: [0, '100%']
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        color: '#BCE3F4',
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [{
                                    offset: 0,
                                    color: '#C6E4F4'
                                }, {
                                    offset: 1,
                                    color: '#F6E6F2'
                                },

                            ]
                        )
                    }
                }]
            }
        },

    }
}
</script>
