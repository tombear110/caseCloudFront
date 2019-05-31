/*
 * @Author: tombear
 * @LastEditors: tombear
 * @Descriptption: 日程页面公用的方法
 * @Descriptption: This mix - in includes a computed properties and methods that
 are useful in displaying a calendar.It has no state.
 * @Date: 2019-03-15 17:25:25
 * @LastEditTime: 2019-03-21 14:48:56
 */

export default {
    methods: {

        //获取某一周，周一和下一周周日的日期
        getWeekStartEnd(date) {
            let currentDate = this.$dayjs(date)
            let currentMonday = currentDate.startOf('week').add(1, 'day').format('YYYY/MM/DD')
            let nextSunday = currentDate.endOf('week').add(1, 'day').format('YYYY/MM/DD')
            return [currentMonday, nextSunday]
        },

        //获取当前一周的数据[{value:1,label:‘周一’,date:'2019-03-25'}]
        getWeekday(date) {
            //需将周一设置为一周的第一天
            let currentDate = this.$dayjs(date).day() === 0 ? this.$dayjs(date).subtract(1, 'day') : this.$dayjs(date)
            let count = 0, nextDay = '', result = []
            const weekZN = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
            while (count < 7) {
                count++
                nextDay = currentDate.startOf('week').add(count, 'day').format('YYYY-MM-DD')
                result.push({
                    value: count,
                    label: weekZN[count],
                    date: nextDay,
                    second: this.$dayjs(nextDay).unix()
                })
            }
            return result
        },

        //获取一天的时间=>[{00:00},{01:00}]
        getTimeItems(start) {
            let result = []
            while (start < 24) {
                let value = start < 10 ? `0${start}:00` : `${start}:00`
                result.push(value)
                start++
            }
            return result
        },

        //传入start,end,判断是否在本周，获取monday-sunday与start_ymd-end_ymd的交集
        //start<Monday=>Monday；end>Sunday=>Sunday
        getStartDate(start) {
            let monday = this.getWeekStartEnd(new Date())[0]
            return this.$dayjs(start).isBefore(this.$dayjs(monday)) ? monday : start
        },

        getEndDate(end) {
            let sunday = this.getWeekStartEnd(new Date())[1]
            return this.$dayjs(end).isAfter(this.$dayjs(sunday)) ? sunday : end
        },

        getStartTime(start) {
            return this.$dayjs(start).format('YYYY-MM-DD HH:MM')
        },

        //给定 htime_text: "02/28 09:00"，输出 9
        getHour(timeText) {
            const timeString = timeText.split(' ')[1]
            let hour = parseInt(timeString.split(':')[0])
            let min = parseInt(timeString.split(':')[1])
            return min ? hour + 1 : hour
        },

        timeDiff(timeSmaller, time) {
            return Math.floor((time - timeSmaller) / 3600)
        }

    }
}
