<template>
    <div class="detail-info" >
        <ul class="list-btns">
            <li class="item" style="position: relative;" :class="{'btn-active':btnActive===index}" v-for="(item,index) in btnList" :key="index"
                @click="onTabChange(index)">
                <i class="iconfont" :class="item.icon"></i>
                <span>{{item.text}}</span>
                <div class="new-wrap" v-if="item.tab === 'step8'">new</div>
            </li>
        </ul>
        <component :is="currentTabComponent" :stepData="stepData"></component>
    </div>
</template>
<script>
    import {
        caseStep0,
        caseStep1,
        caseStep2,
        caseStep3,
        caseStep4,
        caseStep5,
        caseStep6,
        caseStep7,
    } from 'components'

    export default {
        props: ['caseData'],
        data () {
            return {
                baseData: {},
                btnActive: 0,
                tabActive: 0,
                btnList: [
                    {
                        icon: 'icon-test1',
                        text: '案情',
                        tab: 'step0'
                    },
                    {
                        icon: 'icon-test8',
                        text: '办案策略',
                        tab: 'step8'
                    },
                    {
                        icon: 'icon-test2',
                        text: '收费',
                        tab: 'step1'
                    },
                    {
                        icon: 'icon-test3',
                        text: '当事人',
                        tab: 'step2'
                    },
                    {
                        icon: 'icon-test4',
                        text: '受理单位',
                        tab: 'step3'
                    },
                    {
                        icon: 'icon-test5',
                        text: '保全执行',
                        tab: 'step4'
                    },
                    // {
                    //     icon: 'icon-test6',
                    //     text: '归档情况',
                    //     tab: 'step6'
                    // },
                    {
                        icon: 'icon-test7',
                        text: '案件文书',
                        tab: 'step7'
                    }
                ],
            }
        },
        watch: {
            caseData (val) {
                this.baseData = val
            }
        },

        computed: {
            currentTabComponent () {
                return `case-${this.btnList[this.btnActive].tab}`
            },
            stepData () {
                return JSON.parse(JSON.stringify(this.baseData))
            }
        },
        methods: {
            //详情切换
            onTabChange (index) {
                this.btnActive = index
            }
        },
        components: {
            caseStep0,
            caseStep1,
            caseStep2,
            caseStep3,
            caseStep4,
            caseStep5,
            caseStep6,
            caseStep7
        }
    }
</script>
<style lang="scss">
.new-wrap{
    font-size:12px;
    font-weight:400;
    color: #fff;
    width: 34px;
    height: 15px;
    background: #F55A5A;
    border-radius: 15px;
    position: absolute;
    top: 15px;
    right: -13px;
}
</style>
