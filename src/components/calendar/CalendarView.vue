<template>
    <div :class="[

'cv-wrapper',

'locale-' + languageCode(displayLocale),

'locale-' + displayLocale,

'y' + periodStart.getFullYear(),

'm' + paddedMonth(periodStart),

'period-' + displayPeriodUom,

'periodCount-' + displayPeriodCount,

{

past: isPastMonth(periodStart),

future: isFutureMonth(periodStart),

noIntl: !supportsIntl,

},

]">
        <slot :header-props="headerProps" name="header" />
        <div class="cv-header-days">
            <template v-for="(label, index) in weekdayNames">
                <slot :index="getColumnDOWClass(index)" :label="label" name="dayHeader">
                    <div :key="getColumnDOWClass(index)" :class="getColumnDOWClass(index)" class="cv-header-day">
                        {{ label }}
                    </div>
                </slot>
            </template>
        </div>
        <div class="cv-weeks">
            <div v-for="(weekStart, weekIndex) in weeksOfPeriod" :key="`${weekIndex}-week`" :class="[

'cv-week',

'week' + (weekIndex + 1),

'ws' + isoYearMonthDay(weekStart),]" :style="`min-height:${getWeekMaxEvent(weekStart)};`">
                <div
                    v-for="(day, dayIndex) in daysOfWeek(weekStart)"
                    :key="getColumnDOWClass(dayIndex)"
                    :class="[

'cv-day',

getColumnDOWClass(dayIndex),

'd' + isoYearMonthDay(day),

'd' + isoMonthDay(day),

'd' + paddedDay(day),

'instance' + instanceOfMonth(day),

{

outsideOfMonth: !isSameMonth(day, defaultedShowDate),

today: isSameDate(day, today()),

past: isInPast(day),

future: isInFuture(day),

last: isLastDayOfMonth(day),

lastInstance: isLastInstanceOfMonth(day),

},

...((dateClasses && dateClasses[isoYearMonthDay(day)]) || null),

]"
                    @click.stop="onClickDay(day)"
                    @drop.prevent="onDrop(day, $event)"
                    @dragover.prevent="onDragOver(day)"
                    @dragenter.prevent="onDragEnter(day, $event)"
                    @dragleave.prevent="onDragLeave(day, $event)">
                    <div v-if="isKt(weekStart,isoYearMonthDay(day))" class="cv-day-title">
                        <span class="cv-day-title__triangle"/>
                        <span class="cv-day-title__num">{{ day.getDate() }}</span>
                        <span class="cv-day-title__title">

<i class="iconfont icon-lingxing mg-right-5"/>

开庭

</span>
                    </div>
                    <div v-else class="cv-day-number">{{ day.getDate() }}</div>
                    <!--<div class="cv-day-number">{{ day.getDate() }}</div>-->
                    <!--<slot :day="day" name="dayContent"/>-->
                </div>
                <template v-for="e in getWeekEvents(weekStart)">
                    <slot :event="e" :weekStartDate="weekStart" :top="getEventTop(e)" name="event">
                        <div
                            :key="e.id"
                            :draggable="enableDragDrop"
                            :class="e.classes"
                            :style="`top:${getEventTop(e)};`"
                            class="cv-event"
                            @dragstart="onDragStart(e, $event)"
                            @click.stop="onClickEvent(e)">
                            <div class="event-item" :class="{'event-item--done':e.originalEvent.hstatus===1}">
                                <i v-if="e.originalEvent.hstatus===1"
                                   class="iconfont icon-tucenggouxuan event-item__icon" @click.stop="onClickStatus(e)"/>
                                <i v-else class="iconfont icon-weigouxuan1 event-item__icon "
                                   @click.stop="onClickStatus(e)"/>
                                <span class="event-item__time">{{ e.originalEvent.start_hi }}</span>
                                <span class="event-item__text">{{ e.originalEvent.rtype_text }}</span>

                            </div>
                        </div>
                    </slot>
                    <!--@mouseenter="onMouseEnter(e)"-->
                    <!--@mouseleave="onMouseLeave"-->
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import CalendarMathMixin from './CalendarMathMixin'
import CalendarViewHeader from './CalendarViewHeader.vue'

export default {
    name: 'CalendarView',

    components: {
        CalendarViewHeader
    },

    mixins: [CalendarMathMixin],

    props: {
        showDate: {
            type: Date,
            default: undefined
        },
        displayPeriodUom: {
            type: String,
            default: 'month'
        },
        displayPeriodCount: {
            type: Number,
            default: 1
        },
        locale: {
            type: String,
            default: undefined
        },
        monthNameFormat: {
            type: String,
            default: 'long'
        },
        // weekdayNameFormat: { type: String, default: "short" },
        showEventTimes: {
            type: Boolean,
            default: false
        },
        timeFormatOptions: {
            type: Object,
            default: () => {}
        },
        disablePast: {
            type: Boolean,
            default: false
        },
        disableFuture: {
            type: Boolean,
            default: false
        },
        enableDragDrop: {
            type: Boolean,
            default: false
        },
        startingDayOfWeek: {
            type: Number,
            default: 0
        },
        events: {
            type: Array,
            default: () => []
        },
        dateClasses: {
            type: Object,
            default: () => {}
        },
        eventTop: {
            type: String,
            default: '2.8em'
        },
        eventContentHeight: {
            type: String,
            default: '1.4em'
        },
        eventBorderHeight: {
            type: String,
            default: '4px'
        },
        periodChangedCallback: {
            type: Function,
            default: undefined
        },
        currentPeriodLabel: {
            type: String,
            default: ''
        },
        currentPeriodLabelIcons: {
            type: String,
            default: '⇤-⇥'
        }
    },

    data: () => ({
        currentDragEvent: null,
        currentHoveredEventId: undefined
    }),

    computed: {

        /*
        Props cannot default to computed/method returns, so create defaulted version of this
        property and use it rather than the bare prop (Vue Issue #6013).
        */
        displayLocale() {
            return this.locale || this.getDefaultBrowserLocale()
        },

        /*
        ShowDate, but defaulted to today. Needed both for periodStart below and for the
        "outside of month" class. Any time component passed as part of showDate is discarded.
        */
        defaultedShowDate() {
            if (this.showDate) return this.dateOnly(this.showDate)
            return this.today()
        },

        /*
        Given the showDate, defaulted to today, computes the beginning and end of the period
        that the date falls within.
        */
        periodStart() {
            let result = {}
            result = this.beginningOfPeriod(
                this.defaultedShowDate,
                this.displayPeriodUom,
                this.startingDayOfWeek
            )
            return result
        },

        periodEnd() {
            return this.addDays(
                this.incrementPeriod(
                    this.periodStart,
                    this.displayPeriodUom,
                    this.displayPeriodCount
                ),
                -1
            )
        },

        /*
        For month and year views, the first and last dates displayed in the grid may not
        be the same as the intended period, since the period may not start and stop evenly
        on the starting day of the week.
        */
        displayFirstDate() {
            return this.beginningOfWeek(this.periodStart, this.startingDayOfWeek)
        },

        displayLastDate() {
            return this.endOfWeek(this.periodEnd, this.startingDayOfWeek)
        },

        /*
        Create an array of dates, where each date represents the beginning of a week that
        should be rendered in the view for the current period.
        */
        weeksOfPeriod() {
            // Returns an array of object representing the date of the beginning of each week
            // included in the view.
            // console.log('this.displayFirstDate',this.displayFirstDate)
            // console.log('this.displayLastDate',this.displayLastDate)
            const numWeeks = Math.floor(
                (this.dayDiff(this.displayFirstDate, this.displayLastDate) + 1) / 7
            )
            let result = Array(numWeeks)
                .fill()
                .map((_, i) => this.addDays(this.displayFirstDate, i * 7))
            return result
        },

        // Cache the names based on current locale and format settings
        monthNames() {
            return this.getFormattedMonthNames(
                this.displayLocale,
                this.monthNameFormat
            )
        },
        weekdayNames() {
            return ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
            // return this.getFormattedWeekdayNames(
            // 	this.displayLocale,
            // 	this.weekdayNameFormat,
            // 	this.startingDayOfWeek
            // )
        },

        // Ensure all event properties have suitable default
        fixedEvents() {
            const self = this
            let result = []
            result = this.events.map(e =>
                self.normalizeEvent(
                    e,
                    self.currentHoveredEventId && e.id === self.currentHoveredEventId
                )
            )
            return result
        },

        // Creates the HTML to render the date range for the calendar header.
        periodLabel() {
            let date = this.formattedPeriod(
                this.periodStart,
                this.periodEnd,
                this.displayPeriodUom,
                this.monthNames
            )
            return date
            // let dateArr = date.split('月')
            // let month = parseInt(dateArr[0]) < 10 ? `0${dateArr[0]}` : dateArr[0],
            //     year = dateArr[1]
            // return `${year}-${month}`
        },
        // Period that today's date sits within
        currentPeriodStart() {
            return this.beginningOfPeriod(
                this.today(),
                this.displayPeriodUom,
                this.startingDayOfWeek
            )
        },
        currentPeriodEnd() {
            return this.addDays(
                this.incrementPeriod(
                    this.currentPeriodStart,
                    this.displayPeriodUom,
                    this.displayPeriodCount
                ),
                -1
            )
        },
        currentPeriodLabelFinal() {
            const c = this.currentPeriodStart
            const s = this.periodStart
            if (!this.currentPeriodLabel)
                return this.formattedPeriod(
                    c,
                    this.currentPeriodEnd,
                    this.displayPeriodUom,
                    this.monthNames
                )
            if (this.currentPeriodLabel === 'icons')
                return this.currentPeriodLabelIcons[Math.sign(c - s) + 1]
            return this.currentPeriodLabel
        },
        headerProps() {
            return {
                // Dates for UI navigation
                previousYear: this.getIncrementedPeriod(-12),
                previousPeriod: this.getIncrementedPeriod(-1),
                nextPeriod: this.getIncrementedPeriod(1),
                previousFullPeriod: this.getIncrementedPeriod(-this.displayPeriodCount),
                nextFullPeriod: this.getIncrementedPeriod(this.displayPeriodCount),
                nextYear: this.getIncrementedPeriod(12),
                currentPeriod: this.currentPeriodStart,
                currentPeriodLabel: this.currentPeriodLabelFinal,
                // Dates for header display
                periodStart: this.periodStart,
                periodEnd: this.periodEnd,
                // Extra information that could be useful to a custom header
                displayLocale: this.displayLocale,
                displayFirstDate: this.displayFirstDate,
                displayLastDate: this.displayLastDate,
                monthNames: this.monthNames,
                fixedEvents: this.fixedEvents,
                periodLabel: this.periodLabel
            }
        },
        periodRange() {
            return {
                periodStart: this.periodStart,
                periodEnd: this.periodEnd,
                displayFirstDate: this.displayFirstDate,
                displayLastDate: this.displayLastDate
            }
        }
    },

    watch: {
        periodRange: {
            immediate: true,
            handler(newVal) {
                if (this.periodChangedCallback) {
                    this.$emit('period-changed')
                    this.periodChangedCallback(newVal, 'watch')
                }
            }
        }
    },

    methods: {
        //获取一周中某一天最多的events
        //设置weekRow高度
        getWeekMaxEvent(weekStart) {
            let weekEvents = this.getWeekEvents(weekStart)
            // console.log('weekEvents', weekEvents)
            //判断一周events中，eventRow最大值
            let result = null
            if (weekEvents.length) {
                let maxRow = weekEvents.map(item => item.eventRow)
                result = Math.max.apply(null, maxRow) + 1
            } else {
                result = 0
            }
            result = result < 5 ? 7 : result + 5
            return `${result * 20}px`
        },

        //判断当天是否开庭
        //跨天的以第一天为准
        isKt(weekStart, date) {
            const that = this
            const eventsArr = this.getWeekEvents(weekStart)
            return eventsArr.some(item => {
                return item.isKt && that.isoYearMonthDay(item.startDate) === date
            })
        },
        // ******************************
        // UI Events
        // ******************************

        onClickDay(day) {
            if (this.disablePast && this.isInPast(day)) return
            if (this.disableFuture && this.isInFuture(day)) return
            this.$emit('click-date', day)
        },

        onClickEvent(e) {
            this.$emit('click-event', e)
        },
        onClickStatus(e) {
            this.$emit('click-status', e)
        },

        /*
        The day name header needs to know the dow for class assignment, and this value should
        not change based on startingDayOfWeek (i.e., Sunday is always 0). This function
        computes the dow for a given day index.
        */
        getColumnDOWClass(dayIndex) {
            return 'dow' + ((dayIndex + this.startingDayOfWeek) % 7)
        },

        // ******************************
        // Date Periods
        // ******************************

        /*
        Returns a date for the current display date moved forward or backward by a given
        number of the current display units. Returns null if said move would result in a
        disallowed display period.
        */
        getIncrementedPeriod(count) {
            const newStartDate = this.incrementPeriod(
                this.periodStart,
                this.displayPeriodUom,
                count
            )
            const newEndDate = this.incrementPeriod(
                newStartDate,
                this.displayPeriodUom,
                this.displayPeriodCount
            )
            if (this.disablePast && newEndDate <= this.today()) return null
            if (this.disableFuture && newStartDate > this.today()) return null
            return newStartDate
        },

        // ******************************
        // Hover events (#95)
        // ******************************
        onMouseEnter(calendarEvent) {
            this.currentHoveredEventId = calendarEvent.id
        },
        onMouseLeave() {
            this.currentHoveredEventId = undefined
        },

        // ******************************
        // Drag and drop events
        // ******************************

        onDragStart(calendarEvent, windowEvent) {
            if (!this.enableDragDrop) return false
            // Not using dataTransfer.setData to store the event ID because it (a) doesn't allow access to the data being
            // dragged during dragover, dragenter, and dragleave events, and because storing an ID requires an unnecessary
            // lookup. This does limit the drop zones to areas within this instance of this component.
            this.currentDragEvent = calendarEvent
            // Firefox and possibly other browsers require dataTransfer to be set, even if the value is not used. IE11
            // requires that the first argument be exactly "text" (not "text/plain", etc.).
            windowEvent.dataTransfer.setData('text', 'foo')
            this.$emit('drag-start', calendarEvent)
            return true
        },

        handleDragEvent(bubbleEventName, bubbleParam) {
            if (!this.enableDragDrop) return false
            if (!this.currentDragEvent) {
                // shouldn't happen
                // If current drag event is not set, check if user has set its own slot for events
                if (!this.$scopedSlots['event']) return false
            }
            this.$emit(bubbleEventName, this.currentDragEvent, bubbleParam)
            return true
        },

        onDragOver(day) {
            this.handleDragEvent('drag-over-date', day)
        },

        onDragEnter(day, windowEvent) {
            if (!this.handleDragEvent('drag-enter-date', day)) return
            windowEvent.target.classList.add('draghover')
        },

        onDragLeave(day, windowEvent) {
            if (!this.handleDragEvent('drag-leave-date', day)) return
            windowEvent.target.classList.remove('draghover')
        },

        onDrop(day, windowEvent) {
            if (!this.handleDragEvent('drop-on-date', day)) return
            windowEvent.target.classList.remove('draghover')
        },

        // ******************************
        // Calendar Events
        // ******************************

        findAndSortEventsInWeek(weekStart) {
            // Return a list of events that INCLUDE any day of a week starting on a
            // particular day. Sorted so the events that start earlier are always
            // shown first.
            return this.fixedEvents
                .filter(event => event.startDate < this.addDays(weekStart, 7) && event.endDate >= weekStart)
                .sort((a, b) => {
                    if (a.startDate < b.startDate) return -1
                    if (b.startDate < a.startDate) return 1
                    if (a.endDate > b.endDate) return -1
                    if (b.endDate > a.endDate) return 1
                    return a.originalEvent.htime < b.startDate.htime ? -1 : 1
                })
        },

        getWeekEvents(weekStart) {
            // Return a list of events that CONTAIN the week starting on a day.
            // Sorted so the events that start earlier are always shown first.
            const events = this.findAndSortEventsInWeek(weekStart)
            const results = []
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
                const ep = Object.assign({}, events[i], {
                    classes: [...events[i].classes],
                    eventRow: 0
                })
                const continued = ep.startDate < weekStart
                const startOffset = continued ?
                    0 :
                    this.dayDiff(weekStart, ep.startDate)
                const span = Math.min(
                    7 - startOffset,
                    this.dayDiff(this.addDays(weekStart, startOffset), ep.endDate) + 1
                )
                if (continued) ep.classes.push('continued')
                if (this.dayDiff(weekStart, ep.endDate) > 6)
                    ep.classes.push('toBeContinued')
                if (this.isInPast(ep.endDate)) ep.classes.push('past')
                if (ep.originalEvent.url) ep.classes.push('hasUrl')
                for (let d = 0; d < 7; d++) {
                    if (d === startOffset) {
                        let s = 0
                        while (eventRows[d][s]) s++
                        ep.eventRow = s
                        eventRows[d][s] = true
                    } else if (d < startOffset + span) {
                        eventRows[d][ep.eventRow] = true
                    }
                }
                ep.classes.push(`offset${startOffset}`)
                ep.classes.push(`span${span}`)
                results.push(ep)
            }
            return results
        },

        /*
        Creates the HTML to prefix the event title showing the event's start and/or
        end time. Midnight is not displayed.
        */
        getFormattedTimeRange(e) {
            const startTime = this.formattedTime(
                e.startDate,
                this.displayLocale,
                this.timeFormatOptions
            )
            let endTime = ''
            if (!this.isSameDateTime(e.startDate, e.endDate)) {
                endTime = this.formattedTime(
                    e.endDate,
                    this.displayLocale,
                    this.timeFormatOptions
                )
            }
            return (
                (startTime !== '' ?
                    `<span class="startTime">${startTime}</span>` :
                    '') +
                (endTime !== '' ? `<span class="endTime">${endTime}</span>` : '')
            )
        },

        getEventTitle(e) {
            if (!this.showEventTimes) return e.title
            return this.getFormattedTimeRange(e) + ' ' + e.title
        },

        getEventTop(e) {
            // Compute the top position of the event based on its assigned row within the given week.
            const r = e.eventRow
            const h = this.eventContentHeight
            const b = this.eventBorderHeight
            //判断当天是否存在KT
            // let startDate = e.startDate
            let result = ''
            result = `calc(${this.eventTop} + ${r}*${h} + ${r}*${b})`

            // console.log('result-sssss',result)
            return result
        }
    }
}
</script>
<!--

The CSS below represents only the CSS required for proper rendering (positioning, etc.) and
minimalist default borders and colors. Special-day colors, holiday emoji, event colors,
and decorations like border-radius should be part of a theme. Styles related to the default
header are in the CalendarViewHeader component.

-->

<style lang="scss" scoped>
/* Position/Flex */

/* Make the calendar flex vertically */
.cv-wrapper {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 0 15px 35px 15px;
    min-height: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: #fff;

}

/*.cv-wrapper,*/
/*.cv-wrapper div {*/
/*box-sizing: border-box;*/
/*line-height: 1em;*/
/*font-size: 1em;*/
/*}*/

.cv-header-days {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
    flex-flow: row nowrap;
    border-width: 0 0 0 1px;
}

.cv-header-day {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
    flex-flow: row nowrap;
    height: 50px;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-width: 1px 1px 0 0;
    color: #666;
    font-weight: bold;
    background-color: #F9FBFF;
}

/* The calendar grid should take up the remaining vertical space */
.cv-weeks {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: auto;
    flex-flow: column nowrap;
    border-width: 0 0 1px 1px;

    /* Allow grid to scroll if there are too may weeks to fit in the view */
    overflow-y: auto;
    -ms-overflow-style: none;
}

/* Use flex basis of 0 on week row so all weeks will be same height regardless of content */
.cv-week {
    display: flex;
    /* Shorthand flex: 1 1 0 not supported by IE11 */
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
    flex-flow: row nowrap;
    min-height: 3em;
    border-width: 0;

    /* Allow week events to scroll if they are too tall */
    position: relative;
    width: 100%;
    overflow-y: auto;
    -ms-overflow-style: none;

}

.cv-day {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
    position: relative;
    /* Fallback for IE11, which doesn't support sticky */
    position: sticky;
    /* When week's events are scrolled, keep the day content fixed */
    top: 0;
    border-width: 1px 1px 0 0;

}

.today {
    background-color: #FAFAFA;
}

.cv-event {
    box-sizing: border-box;
    position: absolute;
    border-radius: 6px;
}

.cv-header-days,
.cv-header-day,
.cv-weeks,
.cv-week,
.cv-day {
    border-style: solid;
    border-color: #E6E9F0;
}

/* Event Times */
/*.continued{*/
/*.event-item::before {*/
/*content: "→";*/
/*}*/
/*}*/

.cv-day-title {
    position: relative;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: #77a5d8;
    font-weight: 600;

    &__triangle {
        position: absolute;
        left: 0;
        width: 0;
        height: 0;
        border-top: 40px solid #77a5d8;
        border-right: 40px solid transparent;
    }

    &__num {
        position: absolute;
        left: 4px;
        top: -5px;
        font-size: 12px;
        color: #fff;
    }

    &__title {
        position: relative;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #77a5d8;
    }
}

.cv-day-number {
    font-size: 12px;
    color: #5E6D82;
    font-weight: 600;
    padding: 6px 0 0 4px;
}

.outsideOfMonth>.cv-day-number {
    color: #C0CCDA;
}

@for $i from 0 through 6 {
    .offset#{$i} {
        left: calc(#{$i*100%} / 7);
    }
}

@for $i from 1 through 7 {
    .span#{$i} {
        width: calc((#{$i*100%} / 7) - 0.05em);
    }
}

/*event状态样式*/
.event-item {
    box-sizing: border-box;
    width: 100%;
    color: #666;
    border-radius: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;

    &__icon {
        font-size: 14px;
        padding: 0 5px;
        cursor: pointer;
    }

    &__time {
        margin-right: 5px;
    }

    &--done {
        color: #999;
    }
}

.orange {
    background-color: #FBEEE0;

    .event-item--done {
        background-color: #ECEEF1;
    }
}
</style>
