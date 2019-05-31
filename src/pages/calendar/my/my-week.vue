<template>
    <div class="calendar-my-week">
        <div class="scroll-btn scroll-btn__left" @click="scrollLeft">
            <i class="iconfont icon-triangle-left"></i>
        </div>
        <div class="scroll-btn scroll-btn__right" @click="scrollRight">
            <i class="iconfont icon-triangle-right"></i>
        </div>
        <div class="tab-left">
            <div class=" left-item left-item__empty">
            </div>
            <div class="left-item" :class="{'left-item--today':item.value===todayValue}"
                 v-for="(item,index) in weekItems" :key="index"
                 :style="`min-height:${getWeekMaxEvent(item.second)};`">
                {{item.label}}
            </div>
        </div>
        <div class="tab-right" @scroll="scroll" id="scrollDiv">
            <div class="tab-right-line tab-right-line__header">
                <div class="top-item top-item__header" v-for="(timeItem,timeIndex) in timeItems" :key="timeIndex">
                    {{timeItem}}
                </div>
            </div>
            <div class="tab-right-line" v-for="dayStart in weekItems" :key="dayStart.value">
                <div class="top-item-box" :style="`min-height:${getWeekMaxEvent(dayStart.second)};`">
                    <div class="top-item" v-for="timeItem in timeItems" :key="timeItem"
                         @click.stop="onClickDay(dayStart.date,timeItem)">
                        <span v-if="isKt(dayStart.date,timeItem)" class="top-item__triangle"></span>
                    </div>
                    <div v-for="(item,edex) in getFormatEvents(dayStart.second)" :key="edex" :class="item.classes"
                         :style="`top:${getEventTop(item)};`" class="week-event" @click.stop="onClickEvent(item)">
                        <div class="event-item" :class="{'event-item--done':item.hstatus===1}">
                            <i
                                v-if="item.hstatus===1"
                                class="iconfont icon-tucenggouxuan event-item__icon"
                                @click.stop="onClickStatus(item)"
                            />
                            <i
                                v-else
                                class="iconfont icon-weigouxuan1 event-item__icon "
                                @click.stop="onClickStatus(item)"
                            />
                            <span class="event-item__time">{{item.start_hi}}</span>
                            <span class="event-item__text">{{ item.rtype_text }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <record-detail :record-detail="recordDetail" @refreshDelete="refreshDelete" @onEdit="onEdit"></record-detail>
        <record-edit :recordEdit="recordEdit" :recordAdd="recordAdd" @refreshSave="refreshSave"></record-edit>
    </div>
</template>

<script>
    import CalendarMathMixin from '../mixin/CalendarMixin'
    import {recordDetail, recordEdit} from 'components'
    import store from 'store'

    let timer = null
    export default {
        components: {
            recordDetail,
            recordEdit
        },
        props: {
            type: {type: Number, default: -1},
            title: {type: String, default: ''},
        },
        data() {
            return {
                uid: store.state.user_info.user.id,
                timeItems: this.getTimeItems(0),
                nowIndex: 8,
                rightFlag: false,
                divScroll: null,
                events: [],
                baseEvents: [],
                recordDetail: {},
                recordEdit: {},
                recordAdd: {}
            }
        },
        mixins: [CalendarMathMixin],
        computed: {
            todayValue () {
                const today = parseInt(this.$dayjs(new Date()).format('d'))
                return today ? today : 7
            },
            //根据monday，动态获取周数据
            weekItems() {
                return this.getWeekday(this.monday)
            },

            monday() {
                return this.title.split(',')[0]
            },
            sunday() {
                return this.title.split(',')[1]
            },
        },

        watch: {
            type(val) {
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
                this.getDefaultEvents(this.monday, this.sunday)
            },
        },
        mounted() {
            //获取默认数据（本周）
            this.getDefaultEvents(this.monday, this.sunday)
            let div = document.getElementById('scrollDiv')
            //设置默认滚动位置（08:00)
            div.scrollLeft = 140 * 8
            this.divScroll = document.getElementById('scrollDiv')
        },
        methods: {
            //获取周数据
            getDefaultEvents(firstDay, lastDay, uid = this.uid) {
                this.$fetch.api_home.calendarData({
                    start_time: firstDay,
                    end_time: lastDay,
                    uid: uid
                })
                    .then(({
                               data
                           }) => {
                        this.baseEvents = data.map(item => {
                            item.isKt = item.rtype_text === '开庭'
                            item.start = item.htime
                            item.end = item.endtime || item.htime
                            item.classes = item.end && item.start !== item.end ? ['orange'] : []
                            return item
                        })
                        this.events = JSON.parse(JSON.stringify(this.baseEvents))
                    })
            },
            //设置办理状态
            onClickStatus(e) {
                let id = e.rcode, hstatus = e.hstatus === 1 ? 0 : 1
                this.$fetch.api_record.save(
                    {hstatus: hstatus}, id
                ).then(({
                            msg
                        }) => {
                    this.$message.success(msg)
                    this.events = this.events.map(item => {
                        if (item.rcode === e.rcode) {
                            item.hstatus = hstatus
                        }
                        return item
                    })

                })
            },

            refreshDelete(val) {
                if (val) {
                    this.getDefaultEvents()
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
                    this.getDefaultEvents()
                }
            },
            onClickDay(day, time) {
                this.recordAdd = {
                    visible: true,
                    type: 3,
                    htimeDate: day,
                    htimeTime: time,
                }
            },
            onClickEvent(item) {
                this.recordDetail = {
                    visible: true,
                    code: item.rcode,
                    isCalendar: true
                }
            },

            //获取一周中某一天最多的events
            //设置weekRow高度
            getWeekMaxEvent(weekStart) {
                let weekEvents = this.getFormatEvents(weekStart)
                //判断一周events中，eventRow最大值
                let result = null
                if (weekEvents.length) {
                    let maxRow = weekEvents.map(item => item.eventRow)
                    result = Math.max.apply(null, maxRow) + 1
                } else {
                    result = 0
                }
                result = result < 4 ? 5 : result + 2
                const height = (result - 1) * 24 >= 120 ? (result - 1) * 24 : 120
                return `${height}px`
            },

            isKt(day, time) {
                return this.events.some(item => {
                    return day === item.start_ymd && item.isKt && time === item.start_hi
                })
            },

            //获取[[]]，length=24
            getEmptyArr() {
                let end = 1, result = []
                while (end < 25) {
                    result.push([])
                    end++
                }
                return result
            },

            findAndSortEventsInDay(dayStart) {
                return this.events
                    .filter(event => event.start < dayStart + 24 * 3600 && event.end >= dayStart)
                    .sort((a, b) => {
                        if (a.start < b.start) return -1
                        if (b.start < a.start) return 1
                        if (a.end > b.end) return -1
                        if (b.end > a.end) return 1
                        return a.htime < b.htime ? -1 : 1
                    })
            },
            //对多用户的events进行定位，left，width
            getFormatEvents(dayStart) {
                let result = []
                //根据星期几，筛选出当天的数据
                const events = this.findAndSortEventsInDay(dayStart)
                // console.log('events',events)
                const eventRows = this.getEmptyArr()
                for (let i = 0; i < events.length; i++) {
                    //copy单个event
                    const ep = Object.assign({}, events[i], {
                        classes: [...events[i].classes],
                        eventRow: 0
                    })
                    //判断是否换行
                    const continued = ep.start < dayStart
                    //计算event在第几列(第一列是00:00)
                    const startOffset = continued ? 0 : this.timeDiff(dayStart, ep.start)
                    //计算event长度
                    const span = Math.min(
                        24 - startOffset,
                        this.timeDiff(dayStart + startOffset * 3600, ep.end) + 1
                    )
                    //做标记，给event高度定位
                    for (let d = 0; d < 24; d++) {
                        if (d === startOffset) {
                            let s = 0
                            while (eventRows[d][s]) s++
                            ep.eventRow = s
                            eventRows[d][s] = true
                        }
                        if (d < startOffset + span) {
                            eventRows[d][ep.eventRow] = true
                        }
                    }
                    ep.classes.push(`span${span}`)
                    ep.classes.push(`offset${startOffset}`)
                    result.push(ep)
                }
                return result
            },
            //对user的events高度进行定位
            getEventTop(e) {
                const r = e.eventRow
                //event高度=顶部固定高度+相对父级高度
                let result = ''
                result = `calc(20px + ${r * 20}px + ${r * 4}px)`
                return result
            },
            scroll(e) {
                if (e.target.offsetWidth + e.target.scrollLeft >= e.target.scrollWidth - 5) {
                    this.rightFlag = true
                    clearInterval(timer)
                    this.divScroll.scrollLeft = 3360
                } else {
                    this.rightFlag = false
                }
            },
            scrollRight() {
                if (this.rightFlag) {
                    return
                }
                this.nowIndex = Math.floor(this.nowIndex)
                this.nowIndex++
                this.startMove(this.nowIndex * 140)
            },
            scrollLeft() {
                this.nowIndex = Math.ceil(this.nowIndex)

                if (this.nowIndex <= 0) {
                    return
                }
                this.nowIndex--
                this.startMove(this.nowIndex * 140)
            },

            startMove(distance) {
                let div = document.getElementById('scrollDiv')
                timer = setInterval(function () {
                    let between = (distance - div.scrollLeft) / 5
                    let iSpeed = between
                    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed)
                    if (Math.abs(between) <= 1) {
                        div.scrollLeft = distance
                    }
                    if (div.scrollLeft == distance) {
                        clearInterval(timer)
                    } else {
                        div.scrollLeft = div.scrollLeft + iSpeed
                    }
                }, 10)
            }

        }
    }
</script>

