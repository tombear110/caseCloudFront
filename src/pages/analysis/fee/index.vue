<template>
    <div class="analysis-content">
        <div class="analysis-content__body">
            <bar-rose :chartsData="caseData"></bar-rose>
            <bar-rose :chartsData="abstractData"></bar-rose>
        </div>
        <div class="analysis-content__body">
            <bar-rose :chartsData="project1Data"></bar-rose>
            <bar-rose :chartsData="project2Data"></bar-rose>
        </div>

    </div>
</template>

<script>

    export default {
        props: {
            propsData: {
                type: Object
            }
        },
        data () {
            return {
                caseData: {},
                abstractData: {},
                project1Data: {},
                project2Data: {},
                monthData: {},
                options: {}
            }
        },
        created () {
            // this.getData()
        },
        watch: {
            propsData (val) {
                console.log('data-prop', val)
                this.caseData = {
                    x: val.case_arr.x || [],
                    y: val.case_arr.y || [],
                    title: '各案件成本分布',
                    type: 1
                }
                this.abstractData = {
                    x: val.abstracts_arr.x || [],
                    y: val.abstracts_arr.y || [],
                    title: '各类工作成本分布',
                    type: 2
                }
                this.project1Data = {
                    x: val.project1_arr.x || [],
                    y: val.project1_arr.y || [],
                    title: '非诉项目成本分布',
                    type: 1
                }
                this.project2Data = {
                    x: val.project2_arr.x || [],
                    y: val.project2_arr.y || [],
                    title: '诉讼项目成本分布',
                    type: 2
                }
            }
        },

        methods: {}
    }
</script>
