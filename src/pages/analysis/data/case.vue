<template>
    <div class="charts-box">
        <div class="box-header">
            {{chartsData.title}}
        </div>
        <div class="box-body">
            <div class="item item--1">
                <div class="item-panel">
                    <icon-svg :name="chartsData.iconA"/>
                    <span>{{chartsData.textA}}</span>
                </div>
                <div class="item-content">
                    <span>{{chartsData.total}}</span>
                </div>
            </div>
            <div class="item item--2">
                <div class="item-panel">
                    <icon-svg :name="chartsData.iconB"/>
                    <span>{{chartsData.textB}}</span>
                </div>
                <div class="item-content">
                    <span>{{chartsData.zb_total}}</span>
                </div>
            </div>
            <div class="item item--3">
                <div class="card-header">
                    <span class="card-header__panel">
                        {{chartsData.chartTextA}}
                    </span>
                    <div class="card-header__control">
                        <el-radio-group v-model="dateType" @change="changeDateType" size="thinner">
                            <el-radio-button label="月"></el-radio-button>
                            <el-radio-button label="年"></el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="card-charts">
                    <IEcharts ref="chartsBar" class="charts"
                              theme="wonderland" :resizable="true" :notMerge="true" :option="optionsBar"
                              @ready="onReadyBar"/>
                </div>
            </div>
            <div class="item item--4">
                <div class="card-header">
                    <span class="card-header__panel">
                         {{chartsData.chartTextB}}
                    </span>
                </div>
                <div class="charts-none" v-show="noData">
                    <div class="charts-none__center">
                        <icon-svg name="icon-zanwujilu" class="charts-none__center--icon"/>
                        <div class="charts-none__center--text">暂无数据</div>
                    </div>
                </div>
                <div class="card-charts" v-show="!noData">
                    <IEcharts ref="chartsPie" class="charts" theme="wonderland" :resizable="true"
                              :notMerge="true" :option="optionsPie" @ready="onReadyPie"/>
                </div>
            </div>
        </div>
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
                title: '',
                type: 2,
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
                // console.log('val-ccc', val)
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
                this.setBarData(barData, this.dateType)
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
                            radius: '65%',     //大小
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
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params, ticket, callback) {
                            return params.reduce(function(prev, cur) {
                                return  prev +  ` <div><span style="display: inline-block;width: 10px;height: 10px;background-color:${cur.color};
                                        border-radius: 50%"></span> <span>${cur.seriesName}：${Math.abs(cur.data)}</span> </div>`
                            },'');
                        }
                    },
                    legend: {
                        left: '3%',
                        bottom: '3%',
                        itemGap: 50,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '16%',
                        top: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        name: '年',
                        // data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020']

                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: function (value) {
                                return value < 0 ? -value : value
                            }
                        }
                    },
                    dataZoom: [{
                        type: 'inside',
                        show: true,
                        // yAxisIndex: [0],
                        xAxisIndex: [0],

                    }],
                    series: [
                        {
                            name: '新增案件',
                            type: 'bar',
                            stack: '总量',    //将数据设为堆叠
                            // data: [320, 302, 301, 334, 390, 300, 320]
                        },
                        {
                            name: '在办案件',
                            type: 'bar',
                            stack: '总量',
                            // data: [-120, -132, -101, -134, -90, -230, -210]

                        },
                        {
                            name: '结案案件',
                            type: 'bar',
                            stack: '总量',

                            // data: [-220, -182, -191, -234, -290, -330, -310]
                        },
                        {
                            name: '归档案件',
                            type: 'bar',
                            stack: '总量',
                            // data: [-150, -212, -201, -154, -190, -330, -410]
                        },
                    ]

                }
            },

        },
    }
</script>
