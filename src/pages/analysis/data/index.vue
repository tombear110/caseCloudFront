<template>
    <div class="analysis-data">
        <charts :charts-data="settings[0]"></charts>
        <charts :charts-data="settings[1]"></charts>
        <charts :charts-data="settings[2]"></charts>
    </div>
</template>
<script>
    import charts from './case'

    export default {
        components: {
            charts
        },
        props: {
            propsData: {
                type: Object
            }
        },
        data() {
            return {
                baseData: {},
                settings: [
                    {
                        type: 'lawcase_arr',
                        iconA: 'icon-line--green',
                        iconB: 'icon-bar--purple',
                        textA: '案件总数',
                        textB: '在办案件数',
                        chartTextA: '案件数量变化表',
                        chartTextB: '案件类型分布',
                        title:'案件统计',
                    },
                    {
                        type: 'project_arr',
                        iconA: 'icon-bar--green',
                        iconB: 'icon-bar--yellow',
                        textA: '项目总数',
                        textB: '在办项目数',
                        chartTextA: '项目数量变化表',
                        chartTextB: '项目类型分布',
                        title:'项目统计',
                    },
                    {
                        type: 'client_arr',
                        iconA: 'icon-pie--green',
                        iconB: 'icon-pie--blue',
                        textA: '客户总数',
                        textB: '签约客户数',
                        chartTextA: '客户数量变化表',
                        chartTextB: '客户类型分布',
                        title:'客户统计',
                    },
                ],
                caseText: [
                    {value: 'xz', label: '新增案件',},
                    {value: 'zb', label: '在办案件',},
                    {value: 'ja', label: '结案案件',},
                    {value: 'gd', label: '归档案件',},
                ],
                clientText: [
                    {value: 'xz', label: '新增客户',},
                    {value: 'xy', label: '续约客户',},
                ],
                projectText: [
                    {value: 'xz', label: '新增项目',},
                    {value: 'wj', label: '未结项目',},
                    {value: 'yj', label: '已结束项目',},
                ],

            }
        },
        created() {
        },
        watch: {

            //观察父级获取的数据，
            propsData(val) {
                const that = this
                this.settings = this.settings.map(item => {
                    let result = {}
                    for (let i in val) {
                        if (i === item.type) {
                            result = Object.assign({}, item, val[i])
                        }
                    }
                    result.change_arr = that.formatChangeArr(result.change_arr, item.type)
                    result.change_year_arr = that.formatChangeArr(result.change_year_arr, item.type)
                    return result
                })
            }
        },

        methods: {

            //根据传入的type，对obj进行处理，返回[]
            formatChangeArr(obj = {}, type = 'lawcase_arr') {
                //根据传入的类型，将对象的key替换成中文
                const codeArray = [
                    {value: 'lawcase_arr', label: this.caseText},
                    {value: 'client_arr', label: this.clientText},
                    {value: 'project_arr', label: this.projectText}
                ].filter(item => item.value === type)[0]['label']
                let result = codeArray.map(item => {
                    return {
                        value: obj[item.value],
                        key: item.label
                    }
                })
                return result.map(item => {
                    //将包含案件，项目，客户的非新增数据全部置为负,'续约客户'除外
                    if (item.key.indexOf('新增') === -1 && item.key.indexOf('续约') === -1) {
                        for (let i in item.value) {
                            item.value[i] = ~(item.value[i]) + 1
                        }

                    }
                    return item
                })
            },


        }

    }
</script>

