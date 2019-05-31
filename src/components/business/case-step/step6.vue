<template>
    <div class="info-box">
        <div class="tab-component tab-component__mini">
            <ul class="tab-list">
                <li class="tab-item  tab-active">归档情况</li>
            </ul>
            <div class="co-9FA5B9 mg-right-15 cursor" @click="openFiledDialog(stepData)">
                <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                <span>编辑</span>
            </div>
        </div>
        <ul class="list-group">
            <li class="item">
                <span class="item-label">办理状态：</span>
                <span class="item-text">{{stepData.g_status_text}}</span>
            </li>
            <li class="item">
                <span class="item-label">结案日期：</span>
                <span class="item-text">{{stepData.j_time}}</span>
            </li>
            <li class="item">
                <span class="item-label">结案状态：</span>
                <span class="item-text">{{stepData.ja_status_text}}</span>
            </li>
            <li class="item">
                <span class="item-label">归档人：</span>
                <span class="item-text">{{stepData.g_user_text}}</span>
            </li>
            <li class="item">
                <span class="item-label">归档日期：</span>
                <span class="item-text">{{stepData.g_time}}</span>
            </li>
            <li class="item" style="width: 100%">
                <span class="item-label">档案保管地：</span>
                <span class="item-text">{{stepData.g_address}}</span>
            </li>
        </ul>
        <case-filed :caseFiled="caseFiled"></case-filed>
        <!--<div class="tab-component">-->
            <!--<ul class="tab-list">-->
                <!--<li class="tab-item  tab-active">办案总结</li>-->
            <!--</ul>-->
            <!--<div class="co-9FA5B9 mg-right-15 cursor">-->
                <!--<i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>-->
                <!--<span>添加</span>-->
            <!--</div>-->
        <!--</div>-->
        <!--<ul class="list-group">-->
            <!--<li class="item">-->
                <!--<span class="item-label">办案时长：</span>-->
                <!--<span class="item-text">{{stepData.pr_time}}</span>-->
            <!--</li>-->
            <!--<li class="item">-->
                <!--<span class="item-label">办案成本：</span>-->
                <!--<span class="item-text">{{stepData.la_time}}</span>-->
            <!--</li>-->
            <!--<li class="item">-->
                <!--<span class="item-label">办案收入：</span>-->
                <!--<span class="item-text">{{stepData.ja_status_text}}</span>-->
            <!--</li>-->
            <!--<li class="item">-->
                <!--<span class="item-label">办案人员：</span>-->
                <!--<span class="item-text">{{stepData.pr_time}}</span>-->
            <!--</li>-->
            <!--<li class="item">-->
                <!--<span class="item-label">办案周期：</span>-->
                <!--<span class="item-text">{{stepData.la_time}}</span>-->
            <!--</li>-->
            <!--<li class="item">-->
                <!--<span class="item-label">客户评价：</span>-->
                <!--<span class="item-text">{{stepData.ja_status_text}}</span>-->
            <!--</li>-->
            <!--<li class="item">-->
                <!--<span class="item-label">办案总结：</span>-->
                <!--<span class="item-text">{{stepData.ja_status_text}}</span>-->
            <!--</li>-->
        <!--</ul>-->
    </div>
</template>
<script>
    import caseFiled from '../case-simple/case-filed/index'
    export default {
        components: {
            caseFiled
        },
        props: ['stepData'],
        data () {
            return {
                caseFiled:{},
            }
        },
        created () {
//            this.getstepData()
        },

        methods: {

            /**
             * 打开归档编辑弹窗
             * @params: mod
             * @return: 返回值/返回值说明
             */
            openFiledDialog (stepData) {
                this.caseFiled = {
                    visible: true,
                    code:stepData.case_code
                }
            },

        }

    }
</script>
