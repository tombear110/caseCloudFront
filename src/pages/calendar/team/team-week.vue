<template>
    <div class="calendar-team-week">
        <div class="header-row">
            <div class="item item--select">
                <el-select v-model="husers" multiple collapse-tags class="calendar-select" @change="changeHuser"
                           placeholder="">
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
            <div v-for="weekItem in weekday" :key="weekItem.value" class="item"
                 :class="{'item--today':weekItem.value===todayValue}">{{ weekItem.label }}
            </div>
        </div>
        <div class="events-row">
            <div class="events" v-for="huserItem in teamHusers" :key="huserItem.id"
                 :style="`min-height:${getWeekMaxEvent(huserItem,type)};`">
                <div class="events-day events-day--select">
                    <img :src="huserItem.img_path" class="events-day__img" alt="头像">
                    <span class="events-day__text">{{huserItem.real_name}}</span>
                </div>
                <div v-for="dayItem in weekday" :key="dayItem.label" class="events-day"
                     @click.stop="onClickDay(huserItem.id,dayItem.date)">
                        <span
                            v-if="isKt(dayItem.value,huserItem.id)"
                            class="events-day__triangle"
                        ></span>
                </div>
                <div
                    v-for="(item,index) in getFormatEvents(huserItem.id,type)"
                    :key="index"
                    :class="item.classes"
                    :style="`top:${getEventTop(item)};`"
                    @click.stop="onClickEvent(item)"
                    class="events-item">
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
                        <!--<span class="item-box__time">{{item.start_hi}}</span>-->
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
    import userImg from 'assets/images/user.png'
    import {  localStorage, } from 'common/storage'
    export default {
        components: {
            recordDetail,
            recordEdit
        },
        props: {
            type: {type: Number, default: -1},
            title: {type: String, default: ''},
        },
        mixins: [CalendarMathMixin],
        data: function () {
            return {
                selectAllHuser: 0,
                img_url: img_url,
                userImg: userImg,
                activeView: 1,
                visible: false,
                showDate: new Date(),
                weekday: this.getWeekday(new Date()),
                events: [],
                selectedHuser: [],
                husers: [],
                teamHusers: [],
                huserOptions: [],
                recordDetail: {},
                recordEdit: {},
                recordAdd: {},
            }
        },
        computed: {
            todayValue() {
                const today = parseInt(this.$dayjs(new Date()).format('d'))
                return today ? today : 7
            },
            monday() {
                return this.title.split(',')[0]
            },
            sunday() {
                return this.title.split(',')[1]
            },
        },
        watch: {
            title(val) {
                this.getDefaultEvents()
            },
        },

        created() {
            this.getTeam()
            this.getDefaultEvents()

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
            onClickDay(huser, date) {
                this.recordAdd = {
                    visible: true,
                    htimeDate: date,
                    type: 3,
                    huser: huser
                }
            },
            onClickEvent(item) {
                this.recordDetail = {
                    visible: true,
                    code: item.rcode,
                    isCalendar: true
                }
            },

            getTeam() {
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

            toggleView(value) {
                this.activeView = value
                if (value === 0) {
                    this.$router.push({
                        name: 'calendarTeamDay'
                    })
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
            //点击显示对应的同事
            changeHuser(item) {
                //清空数据，响应式显示数据。
                this.teamHusers.splice(0, this.teamHusers.length)
                this.teamHusers = this.huserOptions.filter(ele => item.indexOf(ele.id) !== -1)
                this.selectAllHuser = this.teamHusers.length === this.huserOptions.length ? 1 : 0
            },

            //判断当天是否开庭
            isKt(num, huser) {
                return this.events.some(item => {
                    return num === item.start && item.isKt && huser === item.huser
                })
            },
            //获取当前用户团队本周数据
            getDefaultEvents() {
                const params = {
                    start_time: this.monday,
                    end_time: this.sunday,
                    is_team: true
                }
                this.getEvents(params)
            },

            getEvents(params) {
                this.events = []    //切换日期，必须将之间的数据清空
                this.$fetch.api_home.calendarData(params)
                    .then(({
                               msg,
                               data
                           }) => {
                        const formatData = data.map(item => {
                            item.isKt = item.rtype_text === '开庭'
                            if (item.endtime) {
                                const [start, end] = [
                                    this.$dayjs(item.htime * 1000).format('YYYY-MM-DD'),
                                    this.$dayjs(item.endtime * 1000).format('YYYY-MM-DD')
                                ]
                                item.classes = start !== end ? ['orange'] : []
                            } else {
                                item.classes = []
                            }
                            return item
                        })
                        this.events = JSON.parse(JSON.stringify(formatData))
                    })
            },

            //获取某一周，周一和下一周周日的日期
            getWeekStartEnd(date) {
                let currentDate = this.$dayjs(date)
                let monday = '', sunday = ''
                if (currentDate.day() === 0) {
                    monday = (currentDate.subtract(1, 'day')).startOf('week').add(1, 'day').format('YYYY/MM/DD')
                    sunday = currentDate.format('YYYY/MM/DD')
                } else {
                    monday = currentDate.startOf('week').add(1, 'day').format('YYYY/MM/DD')
                    sunday = currentDate.endOf('week').add(1, 'day').format('YYYY/MM/DD')
                }
                return [monday, sunday]
            },

            //获取用户一周中某一天最多的events
            //设置weekRow高度
            getWeekMaxEvent(item, type) {
                if (!this.events.length) {
                    return false
                }
                let weekEvents = this.getFormatEvents(item.id, type)
                //判断一周events中，eventRow最大值
                let result = null
                if (weekEvents.length) {
                    let maxRow = weekEvents.map(item => item.eventRow)
                    result = Math.max.apply(null, maxRow) + 1
                } else {
                    result = 0
                }
                result = result < 4 ? 5 : result + 2
                return `${(result - 1) * 24}px`
            },

            //传入start,end,判断是否在本周，获取monday-sunday与start_ymd-end_ymd的交集
            //start<Monday=>Monday；end>Sunday=>Sunday
            getStartDate(start) {
                let monday = this.getWeekStartEnd(this.monday)[0]
                return this.$dayjs(start).isBefore(this.$dayjs(monday)) ? monday : start
            },

            getEndDate(end) {
                let sunday = this.getWeekStartEnd(this.sunday)[1]
                return this.$dayjs(end).isAfter(this.$dayjs(sunday)) ? sunday : end
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
                let weekday = []
                weekday = typeEvents.map(item => {
                    let startDate = this.getStartDate(item.start_ymd)
                    //若不存在结束时间，将end_ymd设为start_ymd
                    //如存在结束时间，必须保证end_ymd>start_ymd
                    let endDate = this.getEndDate(item.end_ymd ? item.end_ymd : item.start_ymd)
                    //周日-周一=>0-6
                    let startWeekday = parseInt(this.$dayjs(startDate).format('d'))
                    let endWeekday = parseInt(this.$dayjs(endDate).format('d'))
                    //将上述周一-周日=>1-7
                    item.start = startWeekday === 0 ? 7 : startWeekday
                    item.end = endWeekday === 0 ? 7 : endWeekday
                    return item
                })
                //排序，判断同一天中event位置
                //排序时需要copy一份才能使用sort，避免触发无限循环
                return weekday.slice().sort((a, b) => {
                    if (a.start < b.start) return -1
                    if (b.start < a.start) return 1
                    if (a.end > b.end) return -1
                    if (b.end > a.end) return 1
                    return a.htime < b.htime ? -1 : 1
                })
            },

            //对多用户的events进行定位，left，width
            getFormatEvents(huser, type) {
                if (!this.events.length) {
                    return []
                }
                let result = []
                //根据huser，type,获取huser对应的event
                const events = this.findAndSortEventsInHusers(huser, type) || []
                const eventRows = [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ]
                for (let i = 0; i < events.length; i++) {
                    //copy单个event
                    const ep = Object.assign({}, events[i], {
                        classes: [...events[i].classes],
                        eventRow: 0
                    })
                    //计算event在第几列
                    let offset = ep.start - 1
                    //计算event长度
                    let span = ep.end - ep.start + 1
                    // //做标记，给event高度定位
                    for (let d = 0; d < 7; d++) {
                        if (d === offset) {
                            let s = 0
                            while (eventRows[d][s]) s++
                            ep.eventRow = s
                            eventRows[d][s] = true
                        }
                        if (d < ep.end) {
                            eventRows[d][ep.eventRow] = true
                        }
                    }
                    ep.classes.push(`span${span}`)
                    ep.classes.push(`offset${offset}`)
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
            }
        }
    }
</script>
