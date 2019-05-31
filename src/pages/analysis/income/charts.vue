<template>
    <div class="charts-box">
        <div class="box-header">
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
        <ul class="box-charts">
            <li class="item">
                <div class="item-header">
                    {{chartsData.chartTextB}}
                </div>
                <div class="item-none" v-show="noData">
                    <div class="charts-none__center">
                        <icon-svg name="icon-zanwujilu" class="charts-none__center--icon"/>
                        <div class="charts-none__center--text">暂无数据</div>
                    </div>
                </div>
                <div class="item-charts" v-show="!noData">
                    <IEcharts ref="chartsPie" class="charts" v-show="type===1" :resizable="true" theme="wonderland"
                              :notMerge="true" :option="optionsPie" @ready="onReadyPie"/>
                    <IEcharts ref="chartsBar" class="charts" v-show="type===2" :resizable="true" theme="wonderland"
                              :notMerge="true" :option="optionsBar" @ready="onReadyBar"/>
                </div>
            </li>
            <li class="item">
                <div class="item-header">
                    {{chartsData.chartTextB}}
                </div>
                <div class="item-none" v-show="noData">
                    <div class="charts-none__center">
                        <icon-svg name="icon-zanwujilu" class="charts-none__center--icon"/>
                        <div class="charts-none__center--text">暂无数据</div>
                    </div>
                </div>
                <div class="item-charts" v-show="!noData">
                    <IEcharts ref="chartsPie" class="charts" v-show="type===1" :resizable="true" theme="wonderland"
                              :notMerge="true" :option="optionsPie" @ready="onReadyPie"/>
                    <IEcharts ref="chartsBar" class="charts" v-show="type===2" :resizable="true" theme="wonderland"
                              :notMerge="true" :option="optionsBar" @ready="onReadyBar"/>
                </div>
            </li>
            <li class="item">
                <div class="item-header">
                    {{chartsData.chartTextB}}
                </div>
                <div class="item-none" v-show="noData">
                    <div class="charts-none__center">
                        <icon-svg name="icon-zanwujilu" class="charts-none__center--icon"/>
                        <div class="charts-none__center--text">暂无数据</div>
                    </div>
                </div>
                <div class="item-charts" v-show="!noData">
                    <IEcharts ref="chartsPie" class="charts" v-show="type===1" :resizable="true" theme="wonderland"
                              :notMerge="true" :option="optionsPie" @ready="onReadyPie"/>
                    <IEcharts ref="chartsBar" class="charts" v-show="type===2" :resizable="true" theme="wonderland"
                              :notMerge="true" :option="optionsBar" @ready="onReadyBar"/>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: {
            chartsData: {
                type: Object,
            }
        },
        components: {},
        data() {
            return {

                dateType: '月',
                noData: false,
                title: '合同金额',
                type: 1,
                optionsBar: {},
                optionsPie: {},
                insBar: null,
                insRing: null,
                echartsBar: null,
                echartsRing: null,
                items: [{
                    value: 1,
                    icon: 'icon-shijian2',
                    class: 'start',
                    text: '饼状图',
                },
                    {
                        value: 2,
                        icon: 'icon-shujutongji',
                        class: 'end',
                        text: '柱状图',
                    },
                ],
                xData: [],
                yData: [],
                baseChartsData: {},
            }
        },
        watch: {
            chartsData(val) {
                console.log('val-ccc', val)
                const typeKeys = Object.keys(val.type_arr)
                //饼状图
                this.optionsPie.legend.data = typeKeys
                this.optionsPie.series[0].data = typeKeys.map(item => {
                    return {value: val.type_arr[item], name: item}
                }).filter(item => item.value)
                this.noData = this.optionsPie.series[0].data.length === 0
                //柱状图
                this.baseChartsData = val
                const barData = this.dateType === '月' ? val.change_arr : val.change_year_arr
                // this.setBarData(barData, this.dateType)
            },
        },

        methods: {

            //设置柱状图数据 data:xAxis.data；name:xAxis.name
            setBarData(data, name) {
                let xAxisData = []
                const colors = ['#FCA773', '#97B4F6', '#B8CBF8', '#D7E1FB']
                this.optionsBar.series = data.map((item, index) => {
                    xAxisData = Object.keys(item.value)
                    return {
                        name: item.key,
                        type: 'bar',
                        stack: '总量',
                        data: xAxisData.map(ele => item.value[ele]),
                        itemStyle: {
                            normal: {color: colors[index]}
                        },
                        barMaxWidth: '50',
                    }
                })
                this.optionsBar.xAxis.data = xAxisData
                this.optionsBar.xAxis.name = name
            },

            //年-月切换，
            changeDateType(val) {
                const barData = val === '月' ? this.baseChartsData.change_arr : this.baseChartsData.change_year_arr
                this.setBarData(barData, val)
            },

            onResize(width, height) {
                console.log(width, height)
            },

            onChange(item) {
                this.type = item.value
            },
            onReadyPie(instance, echarts) {
                const that = this
                that.echartsPie = echarts
                that.optionsPie = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {d}%"
                    },
                    legend: {
                        left: '3%',
                        bottom: '3%',
                        itemGap: 30,
                        icon: "pin",
                        data: [],
                        // data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '16%',
                        top: '0',
                        containLabel: true
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['20%', '40%'],
                            center: ['50%', '40%'],     //左右位置
                            silent: false, // 图形是否不响应和触发鼠标事件，默认为 false，即响应和触发鼠标事件。
                            minAngle: 20, // 最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互。
                            avoidLabelOverlap: true, // 是否启用防止标签重叠策略
                            label: {
                                show: true, // 是否显示文本标签
                                formatter: '{b} {d}%',
                            },
                            labelLine: {
                                show: true,
                                length: 10, // 视觉引导线第一段的长度
                                length2: 10, // 视觉引导线第二段的长度
                            },
                            data: [],
                            itemStyle: {    //阴影样式
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]

                }
            },
            onReadyBar(instance, echarts) {
                const that = this
                that.echartsBar = echarts
                that.optionsBar = {
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
                    ),
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            axisLabel: {
                                interval:0,
                                rotate:-50
                            },
                            data : ['今天是星期一', '今天是星期二', '今天是星期三', '今天是星期四', '今天是星期五', '今天是星期六', '今天是星期天'],
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name:'(万)',
                        }
                    ],
                    series : [
                        {
                            name:'直接访问',
                            type:'bar',
                            barWidth: '60%',
                            data:[10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
                };
            },

        },
    }
</script>
