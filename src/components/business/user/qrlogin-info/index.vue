<template>
    <el-dialog title="" :visible.sync="visible" width="400px" :append-to-body="true" class="qrlogin-info">
        <div class="qrlogin-info-content">
            <i class="iconfont icon-chenggong1"></i>
            <p>扫码成功，登陆立即绑定微信！</p>
            <div class="btn mat-40" @click="close">知道了</div>
        </div>
    </el-dialog>

</template>
<script>
    import store from 'store'
    import {server_base_url, img_url} from 'common/config'

    export default {
        props:['qrInfo'],
        data() {
            return {
                visible: false
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
.qrlogin-info{
    .el-dialog__header{
        display: none;
    }
    .el-dialog{
        border-radius: 10px;
        margin-top: 35vh !important;
    }
    .qrlogin-info-content{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    i{
        color: #3ec483;
        font-size: 53px;
        margin-top: -10px;
    }
    p{
        font-size:14px;
        font-weight:400;
        color: #333;
        padding-top: 30px;
    }
    .btn{
        width: 160px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #9FA5B9;
        color: #F7F8FC;
        font-size:18px;
        font-weight:400;
        border-radius: 40px;
        cursor: pointer;
        &:active{
            opacity: 0.5;
            filter:alpha(opacity=50);
        }
    }
}
</style>
