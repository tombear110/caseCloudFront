<template>
    <div class="new-info-tip" v-if="visible">
        <div class="content-wrap">
            <div class="header">消息<i class="iconfont icon-quxiao" @click="close"></i></div>
            <div class="content">{{infoData.action}}</div>
            <div class="footer">{{infoData.add_uid_text}} | {{infoData.created_at}}</div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { SET_V_INFO } from 'store/actions/type'
    export default {
        props: ['infoTip'],
        data() {
            return {
                visible: false,
                infoData: null
            }
        },
        computed: {

        },
        watch: {
            infoTip(val) {
                this.visible = val.visible
                this.infoData = val.data
            }
        },
        created() {
        },
        methods: {
            ...mapActions({
                set_v_info: SET_V_INFO
            }),
            close() {
                this.visible = false
            }
        }

    }
</script>
<style lang="scss">
.new-info-tip{
    .content-wrap{
        position: fixed;
        width: 315px;
        right: 0;
        bottom: 15px;
        background: #fff;
        box-shadow:0px 0px 32px 0px rgba(0, 0, 0, 0.17);
        .header{
            width: 315px;
            height: 48px;
            line-height: 48px;
            background: #ECB86C;
            color: #fff;
            text-align: center;
            font-weight:bold;
            font-size:18px;
            .icon-quxiao{
                position: absolute;
                top: -10px;
                right: 10px;
                color: #eee;
                font-size: 12px;
            }
        }
        .content{
            color: #666;
            font-weight:400;
            font-size:16px;
            line-height:24px;
            padding: 5px 30px 10px;
        }
        .footer{
            text-align: right;
            font-weight:400;
            font-size: 12px;
            color: #999;
            padding-right: 20px;
            padding-bottom: 10px;
        }
    }
}
</style>
