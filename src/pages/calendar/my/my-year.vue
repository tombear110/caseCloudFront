<template>
    <div class="calendar-my-year">
        <div class="mini-month" v-for="item in months" :key="item.value" @click="jumpMonth(item)">
            <div class="month">{{item.label}}</div>
            <ul class="weeks">
                <li class="item" v-for="item in weeks" :key="item.value">
                    <span class="item-week">{{item.label}}</span>
                </li>
            </ul>
            <ul class="days">
                <li class="item" v-for="ele in getMonthDays(item.value,item.data)" :key="ele.date">
                        <span class="item-day" :class="[{'item-kt':ele.hasKt},{'item-today':ele.date === today},]"
                              v-if="ele.isCur">{{ele.date_num}}</span>
                    <icon-svg class="item-icon" :class="{'item-icon--done':ele.hstatusDone}" name="icon-dot"
                              v-if="ele.hasData"></icon-svg>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import store from 'store'

    export default {
        components: {
        },
        props: {
            type: {type: Number, default: -1},
            title: {type: String, default: ''},
        },
        data: function () {
            return {
                weeks: [
                    {value: 0, label: '日'},
                    {value: 1, label: '一'},
                    {value: 2, label: '二'},
                    {value: 3, label: '三'},
                    {value: 4, label: '四'},
                    {value: 5, label: '五'},
                    {value: 6, label: '六'},
                ],
                uid: store.state.user_info.user.id,
                events: [],
                baseEvents: [],
                today: this.getToday(),
                year: this.title,
            }
        },

        watch: {
            type(val) {
                switch (val) {
                    case 1:
                        //主办
                        this.events = this.baseEvents.filter(item => !!item.host)
                        break
                    case 2:
                        //协办
                        this.events = this.baseEvents.filter(item => !!item.assit)
                        break
                    default:
                        //全部
                        this.events = [...this.baseEvents]
                }
            },
            title(val) {
                this.year = val
                let start = this.$dayjs(this.year).startOf('year').format('YYYY-MM-DD')
                let end = this.$dayjs(this.year).endOf('year').format('YYYY-MM-DD')
                this.getYearData(start, end)
            },
        },
        computed: {


            months() {
                let temp = [], result = []
                for (let i = 1; i < 13; i++) {
                    let value = i < 10 ? `0${i}` : i
                    temp.push({
                        value: `${this.year}-${value}`, label: `${i}月`
                    })
                }
                if (this.events.length > 0) {
                    result = temp.map(ele => {
                        ele.data = []
                        this.events.forEach(item => {
                            const yearMonth = this.$dayjs(item.date).format('YYYY-MM')
                            if (ele.value === yearMonth) {
                                ele.data.push(item)
                            }

                        })
                        return ele
                    })
                }
                return result.length ? result : temp
            },

        },
        created() {
            let start = this.$dayjs(this.year).startOf('year').format('YYYY-MM-DD')
            let end = this.$dayjs(this.year).endOf('year').format('YYYY-MM-DD')
            this.getYearData(start, end)
        },
        methods: {


            jumpMonth(val) {
                this.$router.push({name: 'calendarMyMonth', query: {date: val.value}})
            },
            getToday(date = new Date()) {
                return this.$dayjs(date).format('YYYY-MM-DD')
            },

            //获取本年数据
            getYearData(firstDay, lastDay, uid = this.uid) {
                this.events = []
                this.$fetch.api_home.calendarData({
                    start_time: firstDay,
                    end_time: lastDay,
                    uid: uid
                })
                    .then(({
                               data
                           }) => {
                        const formatData = Object.keys(data).map(item => Object.assign({}, {date: item}, data[item]))
                        this.events = formatData
                        this.baseEvents = formatData
                    })
            },

            getMonthDays(de_month = '2019-01', monthData = []) {

                let cur_year = parseInt(this.$dayjs(de_month).year())
                let cur_month = parseInt(this.$dayjs(de_month).format('M'))
                // 判断当前是平年还是闰年
                let febrary_countDays = cur_year % 4 === 0 && cur_year % 100 !== 0 || cur_year % 400 === 0 ? 29 : 28
                let month_normal = [31, febrary_countDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                // 当前月多少天
                let cur_month_countDays = month_normal[cur_month - 1]
                // 当前月第一天是星期几
                let cur_month_firstDay_day = this.$dayjs(cur_year + '-' + cur_month + '-' + 1).day()
                // 需要上个月几天
                let need_last_month_days = cur_month_firstDay_day === 7 ? 0 : cur_month_firstDay_day || []

                // 创建一个42天的数组
                let dates_arr = []
                // 上个月的数据
                for (let i = 0; i < need_last_month_days; i++) {
                    dates_arr.push({isCur: false,})
                }

                // 加上本月数组
                for (let i = 1; i < cur_month_countDays + 1; i++) {
                    const day = i < 10 ? `0${i}` : i
                    const currentDay = `${de_month}-${day}`
                    let obj = {
                        date: currentDay,
                        date_num: i,
                        data: [],
                        isCur: true,
                        hasKt: false,
                        hasData: false,
                        hstatusDone: false,
                    }
                    //判断是否开庭
                    //将当天的数据放入data中
                    monthData.forEach(item => {
                        if (item.date === currentDay) {
                            obj.hstatusDone = item.hstatus === 1
                            obj.hasKt = item.kaiting
                            obj.data.push(item)
                        }
                    })
                    //标记是否有数据
                    obj.hasData = obj.data.length > 0
                    dates_arr.push(obj)
                }
                // 需要下个月几天
                let need_next_month_days = 42 - dates_arr.length
                for (let i = 0; i < need_next_month_days; i++) {
                    dates_arr.push({isCur: false,})
                }
                return dates_arr
            },

        }
    }
</script>

