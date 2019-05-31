<template>
    <div class="calendar-team-day">
        <div class="scroll-btn scroll-btn__left" @click="scrollLeft">
            <i class="iconfont icon-triangle-left"></i>
        </div>
        <div class="scroll-btn scroll-btn__right" @click="scrollRight">
            <i class="iconfont icon-triangle-right"></i>
        </div>
        <div class="tab-left">
            <div class=" events-day events-day__empty">
                <el-select v-model="husers" multiple collapse-tags  class="calendar-select" @change="changeHuser">
                    <li class="el-select-dropdown__item " :class="{'selected':selectAllHuser}"
                        style="border-bottom: 1px solid #ECEEF1" v-model="selectAllHuser"
                        @click="selectAll(selectAllHuser)">
                        <i class="iconfont icon-weigouxuan1"
                           style="float: right; color: #ccc; font-size: 14px;font-weight: 100"></i>
                        <span style="float: right;margin-right: 10px">全选</span>
                    </li>
                    <el-option v-for="item in huserOptions" :key="item.id" :label="item.real_name"
                               :value="item.id">
                        <span style="float: left">{{ item.real_name }}</span>
                        <i class="iconfont icon-weigouxuan1"
                           style="float: right; color: #ccc; font-size: 14px;font-weight: 100"></i>
                    </el-option>
                </el-select>
            </div>
            <div class="events-day" v-for="user in teamHusers" :key="user.id"
                 :style="`min-height:${getWeekMaxEvent(user.id,type)};`">
                <img :src="user.img_path" class="events-day__img" alt="头像">
                <span class="events-day__text">{{user.real_name}}</span>
            </div>
        </div>
        <div class="tab-right" @scroll="scroll" id="scrollDiv">
            <div class="events events--header">
                <div class="events-day events-day__header" v-for="(timeItem,timeIndex) in timeItems"
                     :key="timeIndex">
                    {{timeItem}}
                </div>
            </div>
            <div class="events" v-for="huserItem in teamHusers" :key="huserItem.id"
                 :style="`min-height:${getWeekMaxEvent(huserItem.id,type)};`">
                <div class="events-day" v-for="timeItem in timeItems" :key="timeItem"
                     @click.stop="onClickDay(huserItem.id,timeItem)">
                    <span v-if="isKt(huserItem.id,timeItem)" class="events-day__triangle"></span>
                </div>
                <div
                    v-for="(item,index) in getFormatEvents(huserItem.id,type)"
                    :key="index"
                    :class="item.classes"
                    :style="`top:${getEventTop(item)};`"
                    @click.stop="onClickEvent(item)"
                    class="event-item">
                    <div class="item-box" :class="{'item-box--done':item.hstatus===1}">
                        <i
                            v-if="item.hstatus===1"
                            class="iconfont icon-tucenggouxuan item-box__icon"
                            @click.stop="onClickStatus(item)"
                        />
                        <i
                            v-else
                            class="iconfont icon-weigouxuan1 item-box__icon "
                            @click.stop="onClickStatus(item)"
                        />
                        <span class="item-box__time">{{item.start_hi}}</span>
                        <span class="item-box__text">{{ item.rtype_text }}</span>
                    </div>
                </div>
            </div>
        </div>
        <record-detail :record-detail="recordDetail" @refreshDelete="refreshDelete" @onEdit="onEdit"></record-detail>
        <record-edit :recordEdit="recordEdit" :recordAdd="recordAdd" @refreshSave="refreshSave"></record-edit>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import {SET_TEAM_HUSERS} from 'store/actions/type'
    import store from 'store'
    import {compareFormData} from 'common/lib/common'
    import {recordDetail, recordEdit} from 'components'
    import CalendarMathMixin from '../mixin/CalendarMixin'
    import {img_url} from 'common/config'
    import userImg from 'assets/images/user1.jpg'

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
                selectedHuser: [],
                selectAllHuser: 1,
                img_url: img_url,
                userImg: userImg,
                husers: [],
                uid: store.state.user_info.user.id,
                timeItems: this.getTimeItems(0),
                nowIndex: 8,
                rightFlag: false,
                leftFlag: false,
                isRight: false,
                divScroll: null,
                events: [],
                huserOptions: [],
                teamHusers: [],
                today: this.title,
                recordDetail: {},
                recordEdit: {},
                recordAdd: {}
            }
        },
        mixins: [CalendarMathMixin],
        watch: {
            title(val) {
                this.today = val
                this.getEvents(this.today, this.today)
            },
        },
        mounted() {
            //获取团队成员
            this.getTeam()
            //获取默认数据（本日）
            this.getEvents(this.today, this.today)
            let div = document.getElementById('scrollDiv')
            //设置默认滚动位置（08:00)
            div.scrollLeft = 140 * 8
            this.divScroll = document.getElementById('scrollDiv')
        },
        beforeDestroy() {
            //离开当前页，存储
            //需判断是否进行了退出登录操作，如果是，不存储数据
            const user_info = store.state.user_info
            if (user_info.login){
                this.set_team_husers(this.husers)
            }
        },
        methods: {
            ...mapActions({
                set_team_husers: SET_TEAM_HUSERS
            }),

            //设置办理状态
            onClickStatus(e) {
                let id = e.rcode, hstatus = e.hstatus === 1 ? 0 : 1
                this.$fetch.api_record.save(
                    {hstatus: hstatus}, id
                ).then(({
                            msg
                        }) => {
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
                    this.getEvents(this.today, this.today)
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
                    this.getEvents(this.today, this.today)
                }
            },
            onClickDay(huser, time) {
                this.recordAdd = {
                    visible: true,
                    type: 3,
                    huser: huser,
                    htimeDate: this.today,
                    htimeTime: time
                }
            },
            onClickEvent(item) {
                this.recordDetail = {
                    visible: true,
                    code: item.rcode,
                    isCalendar: true
                }
            },
            selectAll(selectAllHuser) {
                this.selectAllHuser = selectAllHuser ? 0 : 1
                if (this.selectAllHuser === 1) {
                    //全选
                    this.husers = [...this.huserOptions.map(item => item.id)]
                    this.teamHusers = [...this.huserOptions]
                } else {
                    //全部选
                    this.husers.splice(0, this.husers.length)
                    this.teamHusers.splice(0, this.teamHusers.length)
                }
            },
            getTeam() {
                this.teamHusers = []
                this.$fetch.api_team.memberList()
                    .then(({
                               data
                           }) => {
                        //对用户头像进行处理,过滤status=0（被停用）成员
                        const formatData = data.map(item => {
                            if (item.img_path) {
                                item.img_path = item.img_path.substr(0, 4) === 'http' ? item.img_path : `${this.img_url}${item.img_path}`
                            } else {
                                item.img_path = this.userImg
                            }
                            return item
                        }).filter(item => item.status === 1)
                        //设置团队成员待选项
                        this.huserOptions = JSON.parse(JSON.stringify(formatData))
                        const pureData = JSON.parse(JSON.stringify(formatData))
                        //判断用户是否为首次进入该页面，若是，默认全选；若不是，调用本地存储的选中数据
                        //由于是在退出登录时直接使用localstorage.remove清除的team_husers，所以此处不可用vuex获取team_husers
                        const team_husers = localStorage.get('team_husers')
                        let husersType = Object.prototype.toString.call(team_husers) ==='[object Array]'
                        this.husers = husersType ?store.state.team_husers: pureData.map(item=>item.id)
                        this.selectAllHuser = this.husers.length === pureData.length ? 1 : 0
                        for (let i = 0; i < pureData.length; i++) {
                            for (let j = 0; j < this.husers.length; j++) {
                                if (pureData[i].id === this.husers[j]) {
                                    this.teamHusers.push(pureData[i])
                                }
                            }
                        }
                    })
            },
            //点击显示对应的同事
            changeHuser(item) {
                //响应式显示数据
                this.teamHusers.splice(0, this.teamHusers.length)
                this.teamHusers = this.huserOptions.filter(ele => item.indexOf(ele.id) !== -1)
                this.selectAllHuser = this.teamHusers.length === this.huserOptions.length ? 1 : 0
            },

            //获取某人一天最多的events
            //设置weekRow高度
            getWeekMaxEvent(huser, type) {
                // if (!huser) {return []}
                let weekEvents = this.getFormatEvents(huser, type)

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

            isKt(huser, time) {
                return this.events.some(item => {
                    return huser === item.huser && item.isKt && time === item.start_hi
                })
            },


            getEvents(firstDay, lastDay, isTeam = true) {
                this.events = []    //切换日期，必须将之间的数据清空
                this.$fetch.api_home.calendarData({
                    start_time: firstDay,
                    end_time: lastDay,
                    is_team: isTeam
                })
                    .then(({
                               msg,
                               data
                           }) => {
                        this.events = data.map(item => {
                            item.isKt = item.rtype_text === '开庭'
                            item.start = item.htime
                            if (item.endtime) {
                                //当跨天，即结束时间 - 当天00:00天 > 24h，
                                //设结束时间为当天24点
                                if ((item.endtime - this.$dayjs(this.today).unix()) / 3600 > 24) {
                                    item.end = this.$dayjs(`${this.today} 24:00`).unix()
                                } else {
                                    item.end = item.endtime
                                }
                            } else {
                                //若不存在结束时间，则将其值设置为开始时间
                                item.end = item.htime
                            }
                            item.classes = item.end && (item.end - item.start) / 3600 > 1 ? ['orange'] : []
                            return item
                        })
                    })
            },

            //获取[[]]，length=24
            getEmptyArr() {
                let end = 1,
                    result = []
                while (end < 25) {
                    result.push([])
                    end++
                }
                return result
            },

            findAndSortEventsInHusers(huser, type) {
                //过滤，根据type,区分全部，已办，待办
                let typeEvents = []
                switch (type) {
                    case 1:
                        //主办
                        typeEvents = this.events.filter(item => item.huser === huser)
                        break
                    case 2:
                        //协办
                        typeEvents = this.events.filter(item => item.assit ? item.assit.split(',').indexOf(`${huser}`) !== -1 : false)
                        break
                    default:
                        //全部
                        typeEvents = this.events.filter(event => huser === event.huser || (event.assit ? event.assit.split(',').indexOf(`${huser}`) !== -1 : false))
                }

                return typeEvents
                    .sort((a, b) => {
                        if (a.start < b.start) return -1
                        if (b.start < a.start) return 1
                        if (a.end > b.end) return -1
                        if (b.end > a.end) return 1
                        return a.htime < b.htime ? -1 : 1
                    })
            },
            //对多用户的events进行定位，left，width
            getFormatEvents(huser, type) {
                let result = []
                //根据huser，筛选出对应人的数据
                const events = this.findAndSortEventsInHusers(huser, type) || []
                // 如果event无数据，直接返回[]，不进行循环判断
                if (events.length === 0) {
                    return []
                }
                // console.log('events',events)
                const eventRows = this.getEmptyArr()
                for (let i = 0; i < events.length; i++) {
                    //copy单个event
                    const ep = Object.assign({}, events[i], {
                        classes: [...events[i].classes],
                        eventRow: 0
                    })
                    //例如 获取2019-03-27 00:00 unix值
                    const todayStart = this.$dayjs(this.today).unix()
                    //计算event在第几列(第一列是00:00)
                    const startOffset = this.timeDiff(todayStart, ep.start)
                    //计算event长度
                    const span = this.timeDiff(ep.start, ep.end) > 1 ? this.timeDiff(ep.start, ep.end) : this.timeDiff(ep.start, ep.end) + 1
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
                // console.log('result',result)
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
                if (e.target.scrollLeft <= this.nowIndex * 140) {
                    this.leftFlag = false
                }
                if (e.target.scrollLeft >= this.nowIndex * 140) {
                    this.rightFlag = false
                }
                if (e.target.offsetWidth + e.target.scrollLeft >= e.target.scrollWidth) {
                    this.divScroll.scrollLeft = 3360
                    this.isRight = true
                    this.rightFlag = false
                    clearInterval(timer)
                }
            },
            scrollRight() {
                if (this.rightFlag || this.isRight) {
                    return
                }
                this.rightFlag = true
                this.nowIndex = Math.floor(this.nowIndex)
                this.nowIndex++
                this.startMove(this.nowIndex * 140)
            },
            scrollLeft() {
                this.isRight = false
                this.nowIndex = Math.ceil(this.nowIndex)
                if (this.nowIndex <= 0 || this.leftFlag) {
                    return
                }
                this.nowIndex--
                this.leftFlag = true
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

