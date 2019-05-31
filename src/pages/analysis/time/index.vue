<template>
<div class="analysis-content">
    <div class="analysis-content__body">
        <bar-ring :chartsData="caseData"></bar-ring>
        <bar-ring :chartsData="abstractData"></bar-ring>
    </div>
    <div class="analysis-content__body">
            <bar-ring :chartsData="project1Data"></bar-ring>
            <bar-ring :chartsData="project2Data"></bar-ring>
        </div>
    <div class="analysis-content__body">
            <charts-line :chartsData="monthData"></charts-line>
        </div>
</div>
</template>

<script>
import store from 'store'

export default {
    props: {
        propsData: {
            type: Object,
        }
    },
    components: {
    },
    data() {
        return {
            caseData: {},
            abstractData: {},
            project1Data: {},
            project2Data: {},
            monthData: {},
            options: {},
        }
    },
    created() {
        // this.getData()
    },
    watch: {
        propsData(val) {
            console.log('data-prop', val)
            this.caseData = {
                x: val.case_arr.x || [],
                y: val.case_arr.y || [],
                title: '各案件用时分布',
                type: 1,
            }
            this.abstractData = {
                x: val.abstracts_arr.x || [],
                y: val.abstracts_arr.y || [],
                title: '各类工作用时分布',
                type: 2
            }
            this.project1Data = {
                x: val.project1_arr.x || [],
                y: val.project1_arr.y || [],
                title: '诉讼项目用时分布',
                type: 1
            }
            this.project2Data = {
                x: val.project2_arr.x || [],
                y: val.project2_arr.y || [],
                title: '非诉项目用时分布',
                type: 2
            }
            this.monthData = {
                x: val.date_arr.x || [],
                y: val.date_arr.y || [],
                title: '每日繁忙度情况',
                month:val.month
            }
        },
    },

    methods: {

    }
}
</script>
