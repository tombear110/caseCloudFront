<template>
    <div >
        <calendar-view :events="events" :show-date="showDate" :enable-drag-drop="true" class="theme-default "
                       @drop-on-date="onDrop" @click-date="onClickDay" @click-event="onClickEvent"
                       @click-status="onClickStatus">
        </calendar-view>
        <record-detail :record-detail="recordDetail" @refreshDelete="refreshDelete" @onEdit="onEdit"></record-detail>
        <record-edit :recordEdit="recordEdit" :recordAdd="recordAdd" @refreshSave="refreshSave"></record-edit>
    </div>
</template>

<script>
    import CalendarView from 'components/calendar/CalendarView.vue'
    import CalendarMathMixin from 'components/calendar/CalendarMathMixin'
    import store from 'store'

    export default {
        name: 'CalendarDemoApp',
        components: {
            CalendarView,
        },
        props: {
            type: {type: Number, default: -1},
            title: {type: String, default: ''},
        },
        mixins: [CalendarMathMixin],
        data: function () {
            return {
                activeView: 1,
                host: 2,
                showDate: this.$dayjs(this.yearMonth).toDate(),
                message: '',
                recordDetail: {},
                recordEdit: {},
                recordAdd: {},
                uid: store.state.user_info.user.id,
                events: [],
                baseEvents: [],
                yearMonth: this.title ,
            }
        },

        watch: {
            type(val) {
                this.events = []
                switch (val) {
                    case 1:
                        //主办
                        this.events = this.baseEvents.filter(item => item.huser === this.uid)
                        break
                    case 2:
                        //协办
                        this.events = this.baseEvents.filter(item => item.assit ? item.assit.split(',').indexOf(`${this.uid}`) !== -1 : false)
                        break
                    default:
                        //全部
                        this.events = [...this.baseEvents]
                }
            },
            title(val) {
                console.log('vcal',val)
                this.yearMonth = val
                this.showDate = this.$dayjs(val).toDate()
                this.getDefaultEvents(this.yearMonth)
            },
        },

        created() {
            this.showDate = this.$dayjs(this.yearMonth).toDate()
            this.getDefaultEvents(this.yearMonth)
        },
        methods: {

            toggleView(value) {
                this.activeView = value
                const routes = [
                    {value: 0, name: 'calendarMyWeek'},
                    {value: 1, name: 'calendarMyMonth'},
                    {value: 2, name: 'calendarMyYear'},
                ]
                this.$router.push({name: routes[value].name})
            },
            //主办协办
            changeHost(val) {
                this.events = []
                if (val === 1) {
                    //主办
                    this.events = this.baseEvents.filter(item => item.huser === this.uid)
                } else if (val === 0) {
                    //协办
                    this.events = this.baseEvents.filter(item => item.assit ? item.assit.indexOf(`${this.uid}`) !== -1 : false)
                } else {
                    //全部
                    this.events = [...this.baseEvents]
                }

            },
            onClickDay(d) {
                this.recordAdd = {
                    visible: true,
                    htimeDate: this.$dayjs(d).format('YYYY-MM-DD'),
                    type: 3
                }
            },

            onClickEvent(e) {
                this.recordDetail = {
                    visible: true,
                    code: e.originalEvent.rcode,
                    isCalendar: true
                }
            },

            //拖动后，设置数据新位置
            //发出请求，更改starttime,endtime
            onDrop(event, date) {
                const eLength = this.dayDiff(event.startDate, date)
                //格式化
                let start = this.$dayjs(this.addDays(event.startDate, eLength)).format('YYYY-MM-DD'),
                    end = this.$dayjs(this.addDays(event.endDate, eLength)).format('YYYY-MM-DD')
                //设置数据的位置
                event.originalEvent.start_ymd = start
                event.originalEvent.end_ymd = end
                //发送请求（params）
                let startH = event.originalEvent.htime_text.split(' ')[1]
                let endH = ''
                //如果结束时间存在，传值
                //若不存在，日期和时间均传''
                if (event.originalEvent.endtime_text) {
                    endH = event.originalEvent.endtime_text.split(' ')[1]
                } else {
                    end = ''
                }
                let params = {}
                params.htime = `${start} ${startH}`
                params.endtime = `${end} ${endH}`
                this.editRecord(params, event.id)
            },

            //修改记录
            editRecord(params, id) {
                this.$fetch.api_record.save(params, id)
                    .then(({
                               msg
                           }) => {
                    })
            },

            //默认展示当前用户本月数据
            //例如:传入 2018-07-01,2018-07-31，uid=70
            getDefaultEvents(date) {
                let monthStartDay = this.$dayjs(date).startOf('month').format('YYYY-MM-DD'),
                    monthEndDay = this.$dayjs(date).endOf('month').format('YYYY-MM-DD')
                this.getMonthData(monthStartDay, monthEndDay)
            },

            //获取本月数据
            getMonthData(firstDay, lastDay, uid = this.uid) {
                this.events = []
                const that = this
                this.$fetch.api_home.calendarData({
                    start_time: firstDay,
                    end_time: lastDay,
                    uid: uid
                })
                    .then(({
                               data
                           }) => {
                        this.events = data.map(item => {
                            item.isKt = item.rtype_text === '开庭'
                            if (item.endtime) {
                                const [start, end] = [
                                    that.$dayjs(item.htime * 1000).format('YYYY-MM-DD'),
                                    that.$dayjs(item.endtime * 1000).format('YYYY-MM-DD')
                                ]
                                item.classes = start !== end ? ['orange'] : []
                            } else {
                                item.classes = []
                            }
                            return item
                        })
                        this.baseEvents = JSON.parse(JSON.stringify(this.events))
                    })
            },

            //设置办理状态
            onClickStatus(e) {
                let id = e.id, hstatus = e.originalEvent.hstatus === 1 ? 0 : 1
                this.$fetch.api_record.save({
                        hstatus: hstatus
                    },
                    id
                ).then(({
                            msg
                        }) => {
                    this.events = this.events.map(item => {
                        if (item.rcode === e.originalEvent.rcode) {
                            item.hstatus = e.originalEvent.hstatus === 1 ? 0 : 1
                        }
                        return item
                    })

                })
            },

            refreshDelete(val) {
                if (val) {
                    this.getDefaultEvents(this.yearMonth)
                }
            },

            //接受从详情传过来的code，打开编辑dialog
            onEdit(data) {
                this.recordEdit = {
                    visible: true,
                    code: data.rcode,
                    type: data.type
                }
                if (data.type === 2) {
                    this.recordEdit.cl_code = data.linkid_id_info.cl_code
                }
            },
            refreshSave(val) {
                if (val) {
                    this.getDefaultEvents(this.yearMonth)
                }
            }

        }
    }
</script>

<style lang="scss" scoped>


    .theme-default .cv-day.today {
        background-color: #f7f7f7;
    }

    .theme-default .cv-day.past {
        /*background-color: #fafafa;*/
    }

    .theme-default .cv-day.outsideOfMonth {
        /*background-color: #f7f7f7;*/
    }

    /* Events */

    .theme-default .cv-event {
        /*border-color: #e0e0f0;*/
        border-radius: 0.5em;
        /*background-color: #e7e7ff;*/
        text-overflow: ellipsis;
    }

    .theme-default .cv-event.purple {
        background-color: #f0e0ff;
        border-color: #e7d7f7;
    }

    .theme-default .cv-event.orange {
        background-color: #FBEEE0;
        border-color: #FBEEE0;
    }

    /*.theme-default .cv-event.continued::before,*/
    /*.theme-default .cv-event.toBeContinued::after {*/
    /*content: " \21e2 ";*/
    /*color: #999;*/
    /*}*/

    .theme-default .cv-event.toBeContinued {
        border-right-style: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .theme-default .cv-event.isHovered.hasUrl {
        text-decoration: underline;
    }

    .theme-default .cv-event.continued {
        border-left-style: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    /* Event Times */

    .theme-default .cv-event .startTime,
    .theme-default .cv-event .endTime {
        font-weight: bold;
        color: #666;
    }

    /* Drag and drop */

    .theme-default .cv-day.draghover {
        box-shadow: inset 0 0 0.2em 0.2em yellow;
    }

</style>
