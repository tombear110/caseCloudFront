<template>
    <div class="analysis-wrap">
        <div class="analysis-wrap__header">
            <div class="header-title">
                <ul class="radio-group">
                    <li class="item" :class="{'active':isTeam === item.value}" v-for="item in typeGroup"
                        :key="item.value" @click="teamChange(item.value)">{{item.label}}
                    </li>
                </ul>
            </div>

            <div class="header-control" v-if="routeName==='analysisData'" key="header-control">
                <el-date-picker
                    v-model="dateRange"
                    type="monthrange"
                    class="charts-date-range"
                    @change="changeDateRange"
                    range-separator="至"
                    format="yyyy年 - MM月"
                    value-format="yyyy-MM"
                    :picker-options="pickerOptions"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份">
                </el-date-picker>
            </div>
            <div class="header-control" v-else key="header-control">
                <el-date-picker v-model="month" @change="monthChange" type="month" size="medium" format="yyyy年 - MM月"
                                class="date-picker--round"
                                value-format="yyyy-MM" placeholder="选择月">
                </el-date-picker>
            </div>
        </div>
        <router-view :propsData="propsData"></router-view>
    </div>
</template>

<script>
    import store from 'store'

    export default {
        components: {},
        data() {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', [new Date(), new Date()]);
                        }
                    }, {
                        text: '今年至今',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(new Date().getFullYear(), 0);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近六个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setMonth(start.getMonth() - 6);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateRange: this.getDateRange(),
                typeGroup: [
                    {
                        value: 0,
                        label: '个人',
                    },
                    {
                        value: 1,
                        label: '团队',
                    },
                ],
                isTeam: 0,
                month: this.$dayjs(new Date).format('YYYY-MM'),
                propsData: {},

            }
        },
        computed: {
            notTeam() {
                const userData = store.state.user_info.user || {}
                return !userData.team_id
            },
            routeName() {
                return this.$route.name
            },

        },
        created() {
            this.getData()
        },
        watch: {
            $route(to, from) {
                this.getData()
            }
        },
        methods: {
            changeDateRange(val) {
                this.getDataData()
            },

            getDateRange(date = new Date()) {
                return [
                    `${this.$dayjs(date).format('YYYY')}-01`, this.$dayjs(date).format('YYYY-MM')
                ]
            },

            teamChange(val) {
                if (this.notTeam) {
                    this.$message.warning('请先创建或加入团队。');

                } else {
                    this.isTeam = val
                    this.getData()
                }


            },
            monthChange(val) {
                this.month = val
                this.getTimeData()
            },

            getData() {
                if (this.routeName === 'analysisTime') {
                    this.getTimeData()
                } else if (this.routeName === 'analysisFee') {
                    this.getFeeData()
                } else {
                    this.getDataData()
                }
            },

            //获取工时数据
            getTimeData() {
                this.$fetch.api_analysis.time({
                    month: this.month,
                    is_team: this.isTeam,
                })
                    .then(({
                               data
                           }) => {
                        data.month = this.month
                        this.propsData = data


                    })
                    .catch(() => {

                    })
            },
            getFeeData() {
                this.$fetch.api_analysis.fee({
                    month: this.month,
                    is_team: this.isTeam,
                })
                    .then(({
                               data
                           }) => {
                        data.month = this.month
                        this.propsData = data

                    })
                    .catch(() => {

                    })
            },

            //基础数据统计
            getDataData() {
                this.$fetch.api_analysis.data({
                    is_team: this.isTeam,
                    start_time: this.dateRange[0],
                    end_time: this.dateRange[1],
                })
                    .then(({
                               data
                           }) => {
                        this.propsData = data

                    })
            },
        }
    }
</script>
