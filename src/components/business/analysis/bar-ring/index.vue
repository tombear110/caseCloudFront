<template>
    <div class="charts-card">
        <div class="charts-card__header">
            <div class="header-title">
                {{title}}
            </div>
            <div class="header-control">
                <ul class="tab-group">
                    <li class="item" :class="[{'active':item.value === type},item.class]" v-for="(item, index) in items"
                        :key="index" @click="onChange(item)">
                        <i class="iconfont" :class="item.icon"></i>
                        <span>{{item.text}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="charts-card__body">
            <div class="charts-none" v-show="noData" >
                <div class="charts-none__center" >
                    <icon-svg name="icon-zanwujilu" class="charts-none__center--icon"/>
                    <div class="charts-none__center--text">暂无数据</div>
                </div>
            </div>
            <div class="charts-box" style="width:100%;height:400px" v-show="!noData">
                <IEcharts ref="chartsRing" class="charts" v-show="type===1" theme="wonderland" :resizable="true"
                          :notMerge="true" :option="optionsRing" @ready="onReadyRing"/>
                <IEcharts ref="chartsBar" class="charts" v-show="type===2" theme="wonderland" :resizable="true"
                          :notMerge="true" :option="optionsBar" @ready="onReadyBar"/>
            </div>
        </div>
    </div>
</template>

<script>
    // import '../theme/wonderland'

    export default {
        props: {
            chartsData: {
                type: Object
            }
        },
        components: {},
        data () {
            return {
                title: '',
                type: 2,
                noData: false,
                optionsBar: {},
                optionsRing: {},
                insBar: null,
                insRing: null,
                echartsBar: null,
                echartsRing: null,
                items: [{
                    value: 1,
                    icon: 'icon-shijian2',
                    class: 'start',
                    text: '饼状图'
                },
                    {
                        value: 2,
                        icon: 'icon-shujutongji',
                        class: 'end',
                        text: '柱状图'
                    }
                ],
                xData: [],
                yData: [],
                allData: []
            }
        },
        computed: {},
        watch: {
            chartsData (val) {
                this.allData = []
                this.type = val.type
                this.title = val.title
                this.noData = val.x.length === 0
                this.xData = val.x.map(item => {
                    return item.length > 8 ? `${item.substr(0, 8)}等` : item
                })
                this.yData = val.y
                //选中
                let selectedData = {}
                for (let i = 0; i < this.xData.length; i++) {
                    const name = this.xData[i]
                    //排序前5项展示
                    selectedData[name] = i<5
                    //x,y数据一一对应
                    for (let j = 0; j < this.yData.length; j++) {
                        const value = this.yData[j]
                        if (i === j) {
                            this.allData.push({
                                value: value,
                                name: name
                            })
                        }

                    }
                }
                //饼图数据
                this.optionsRing.legend.data = this.xData
                this.optionsRing.legend.selected = selectedData
                this.optionsRing.series[0].data = this.allData
                //柱状图数据
                this.optionsBar.yAxis[0].data = this.xData
                this.optionsBar.series[0].data = this.yData
            }
        },

        methods: {

            formatData (data) {

            },

            onResize (width, height) {
                console.log(width, height)
            },

            onChange (item) {
                this.type = item.value
            },

            onReadyBar (instance, echarts) {
                const that = this

                that.ins = instance
                that.echarts = echarts
                that.optionsBar = {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: '{b} ( {c} h)'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'value',
                        name: '(h)',
                    }],
                    yAxis: [{
                        type: 'category',
                        data: [],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    dataZoom: [{
                        type: 'inside',
                        show: true,
                        yAxisIndex: [0],

                    }],
                    series: [{
                        barWidth: '60%',
                        data: [],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    1, 0, 0, 0,
                                    [{
                                        offset: 0,
                                        color: '#C6E4F4'
                                    }, {
                                        offset: 1,
                                        color: '#F6E6F2'
                                    }

                                    ]
                                )
                            }
                        },
                        label: {
                            normal: {
                                fontWeight: 'bolder',
                                fontSize: 23
                            }
                        }
                    }]
                }
            },

            onReadyRing (instance, echarts) {
                const that = this
                that.echartsBar = echarts
                that.optionsRing = {
                    // tooltip: {
                    //     trigger: 'item',
                    //     formatter: "{b} ( {c} h)"
                    // },
                    legend: {
                        orient: 'vertical',
                        type: 'scroll',
                        x: 'right',
                        top: 20,
                        data: [],
                        tooltip: {
                            show: true
                        }
                    },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '60%'],
                        center: ['40%', '50%'],
                        silent: false, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                        minAngle: 20, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
                        avoidLabelOverlap: true, // 是否启用防止标签重叠策略
                        label: {
                            show: true, // 是否显示文本标签
                            formatter: '{b} : {c}h'
                            // formatter: function (params) {
                            //     // 类目名长度大于5
                            //     if (params.name.length >= 5) {
                            //         return params.name + '\n' + params.value + '%';
                            //     } else {
                            //         return params.name + params.value + '%';
                            //     }
                            // },
                        },
                        labelLine: {
                            show: true,
                            length: 10, // 视觉引导线第一段的长度
                            length2: 10, // 视觉引导线第二段的长度
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        data: []
                    }]

                }
            }

        }
    }
</script>
