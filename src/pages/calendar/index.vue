<template>
    <div class="calendar">
        <div class="calendar-header">
            <div class="header-host">
                <ul class="self-radio--round">
                    <li class="item" :class="{'item--active':hostActive===item.value}" v-for="item in hostList"
                        @click="changeHost(item)" :key="item.value">{{item.label}}
                    </li>
                </ul>
            </div>
            <div class="header-date" v-if="routeName==='calendarMyYear'">
                <i class="iconfont icon-triangle-left" @click="getIncrementedYear(year,-1)"></i>
                <span>{{year}}年</span>
                <i class="iconfont icon-triangle-right" @click="getIncrementedYear(year,1)"></i>
            </div>
            <div class="header-date" v-if="routeName==='calendarMyWeek'">
                <i class="iconfont icon-triangle-left" @click="getIncrementedWeek(monday,sunday,-1)"></i>
                <span>{{monday}} - {{sunday}}</span>
                <i class="iconfont icon-triangle-right" @click="getIncrementedWeek(monday,sunday,1)"></i>
            </div>
            <div class="header-date" v-if="routeName==='calendarMyMonth'">
                <i class="iconfont icon-triangle-left" @click="getIncrementedMonth(yearMonth,-1)"></i>
                <span>{{yearMonth}}</span>
                <i class="iconfont icon-triangle-right" @click="getIncrementedMonth(yearMonth,1)"></i>
            </div>
            <div class="header-date" v-if="routeName==='calendarTeamWeek'">
                <i class="iconfont icon-triangle-left" @click="getIncrementedWeek(monday,sunday,-1)"></i>
                <span>{{monday}} - {{sunday}}</span>
                <i class="iconfont icon-triangle-right" @click="getIncrementedWeek(monday,sunday,1)"></i>
            </div>
            <div class="header-date" v-if="routeName==='calendarTeamDay'">
                <i class="iconfont icon-triangle-left" @click="getIncrementedDay(day,-1)"></i>
                <span>{{day}}</span>
                <i class="iconfont icon-triangle-right" @click="getIncrementedDay(day,1)"></i>
            </div>
            <ul class="header-view">
                <li class="item" :class="{'item--active':routeName===item.route}" v-for="item in dateList"
                    @click="changeView(item)" :key="item.value">
                    <i class="iconfont" :class="item.icon"></i>
                    <span>{{item.label}}</span>
                </li>
            </ul>
        </div>
        <router-view :key="key" :type="type"  :title="title"></router-view>
    </div>
</template>
<script type="text/javascript">
    import store from 'store'

    export default {

        data() {
            return {
                day: this.$dayjs(new Date()).format('YYYY-MM-DD'),
                year: this.getDefaultYear(),
                monday: this.getWeekStartEnd(new Date())[0],
                sunday: this.getWeekStartEnd(new Date())[1],
                hostActive: 0,
                tabActive: 0,
                events: [],
                baseEvents: [],
                viewActive: 2,
                host: 2,
                data: [],
                uid: store.state.user_info.user.id,
                title: '',
                type: -1,
                yearMonth: '',
            }
        },
        computed: {

            key() {
                return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
            },
            routeName() {
                return this.$route.name
            },
            dateList() {
                let result = []
                if (this.routeName === 'calendarTeamWeek' || this.routeName === 'calendarTeamDay') {
                    result = [
                        {value: 0, label: '日', icon: 'icon-ri1', route: 'calendarTeamDay'},
                        {value: 1, label: '周', icon: 'icon-zhou1', route: 'calendarTeamWeek'},
                    ]

                } else {
                    result = [
                        {value: 0, label: '周', icon: 'icon-zhou1', route: 'calendarMyWeek'},
                        {value: 1, label: '月', icon: 'icon-yue1', route: 'calendarMyMonth'},
                        {value: 2, label: '年', icon: 'icon-nian', route: 'calendarMyYear'},
                    ]
                }
                return result
            },
            hostList() {
                return [
                    {value: 0, label: '全部'},
                    {value: 1, label: '主办'},
                    {value: 2, label: '协办'},
                ]
            },

        },
        created() {
            this.getRouteData()
        },
        watch: {
            '$route'(to, from) {
                this.getRouteData()
            }
        },
        methods: {

            getIncrementedMonth(date, count) {
                if (count < 0) {
                    this.yearMonth = this.$dayjs(date).subtract(1, 'month').format('YYYY-MM')
                    this.title = this.yearMonth
                } else {
                    this.yearMonth = this.$dayjs(date).add(1, 'month').format('YYYY-MM')
                    this.title = this.yearMonth
                }
            },

            getIncrementedDay(date, count) {
                if (count < 0) {
                    this.day = this.$dayjs(date).subtract(1, 'day').format('YYYY-MM-DD')
                    this.title = this.day
                } else {
                    this.day = this.$dayjs(date).add(1, 'day').format('YYYY-MM-DD')
                    this.title = this.day
                }
            },
            getIncrementedYear(year, count) {
                if (count < 0) {
                    this.hostActive = 0
                    this.year = this.$dayjs(year).subtract(1, 'year').format('YYYY')
                    this.title = this.year
                } else {
                    this.hostActive = 0
                    this.year = this.$dayjs(year).add(1, 'year').format('YYYY')
                    this.title = this.year
                }
            },

            //获取某一周，周一和下一周周日的日期
            getWeekStartEnd(date) {
                let currentDate = this.$dayjs(date)
                let monday = '',sunday = ''
                if (currentDate.day()===0){
                    monday = (currentDate.subtract(1, 'day')).startOf('week').add(1, 'day').format('YYYY/MM/DD')
                    sunday = currentDate.format('YYYY/MM/DD')
                }else {
                    monday = currentDate.startOf('week').add(1, 'day').format('YYYY/MM/DD')
                    sunday = currentDate.endOf('week').add(1, 'day').format('YYYY/MM/DD')
                }
                return [monday, sunday]
            },

            getRouteData(routeName = this.routeName) {
                this.type = 0
                this.hostActive = 0
                switch (routeName) {
                    case 'calendarMyYear':
                        this.title = this.year;
                        break
                    case 'calendarMyWeek':
                        this.title = `${this.monday},${this.sunday}`
                        break
                    case 'calendarMyMonth':
                        this.title = this.$route.query.date || this.$dayjs(new Date()).format('YYYY-MM')
                        this.yearMonth = this.$route.query.date || this.$dayjs(new Date()).format('YYYY-MM')
                        break
                    case 'calendarTeamDay':
                        this.title = this.day
                        break
                    default:
                        this.title = `${this.monday},${this.sunday}`
                        break
                }
            },


            getDefaultYear(date = new Date()) {
                return this.$dayjs(date).format('YYYY')
            },

            changeView(e) {
                this.viewActive = e.value
                this.$router.push({name: e.route})
            },


            //主办协办
            changeHost(val) {
                this.hostActive = val.value
                this.type = val.value
            },


            getIncrementedWeek(monday, sunday, count) {
                this.host = 0
                const num = Math.abs(count)
                if (count < 0) {
                    this.monday = this.$dayjs(monday).subtract(num, 'week').format('YYYY/MM/DD')
                    this.sunday = this.$dayjs(sunday).subtract(num, 'week').format('YYYY/MM/DD')
                } else {
                    this.monday = this.$dayjs(monday).add(num, 'week').format('YYYY/MM/DD')
                    this.sunday = this.$dayjs(sunday).add(num, 'week').format('YYYY/MM/DD')
                }
                this.title = `${this.monday},${this.sunday}`
            },
        }

    }
</script>
