import dateFormat from 'plugins/date'
import {dealObjectValue,filterFormData,compareFormData} from 'common/lib/common'

const install = function (Vue) {
    if (install.installed) return
    install.installed = true
    // console.log('dealObjectValue',dealObjectValue)
    // console.log('filterFormData',filterFormData)
    // console.log('compareFormData',compareFormData)
    //定义属性到Vue原型中
    Object.defineProperties(Vue.prototype, {
        $dateFormat: {get () {return dateFormat}},
        $dealObjectValue:{get () {return dealObjectValue}},

    })
}

export default {
    install
}
