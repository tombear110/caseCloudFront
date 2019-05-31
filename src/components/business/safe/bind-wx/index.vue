<template>
    <el-dialog title="绑定微信" :visible.sync="visible" width="420px" :append-to-body="true" class="bind-wx">
        <div class="bind-wx-content">
            <div class="qr-wrap">
                <img :src="qrCodeUrl" alt="">
            </div>
            <p>微信扫一扫二维码</p>
            <p>关注“案件云平台”完成绑定</p>
            <p style="margin-bottom: 70px;">即可在微信轻松管理你的案件</p>
        </div>
    </el-dialog>
</template>
<script>
    import store from 'store'
    import {server_base_url, img_url} from 'common/config'

    export default {
        props:['qrInfo', 'qrCodeUrl'],
        data() {
            return {
                visible: false,
                qrUrl: '',
            }
        },
        watch:{
            qrInfo(val) {
                this.visible = val.visible
            }
        },
        created() {
        },
        methods: {
            close() {
                this.visible = false
            }
        }
    }
</script>
<style lang="scss">
.bind-wx{
    line-height: 1;
    .el-dialog__body{
        padding: 0;
    }
    .el-dialog{
        border-radius: 4px;
        margin-top: 25vh !important;
    }
    .bind-wx-content{
        text-align: center;
        overflow: hidden;
        .qr-wrap{
            width: 180px;
            height: 180px;
            box-shadow:0px 1px 16px 0px rgba(156,158,174,0.33);
            margin: 60px auto 25px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        p{
            color: #999;
            font-size:14px;
            font-weight: 400;
            line-height: 24px;
        }
    }
}
</style>
