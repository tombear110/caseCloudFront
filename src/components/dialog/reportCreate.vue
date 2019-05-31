<template>
    <el-dialog title='' :visible.sync="visible"  append-to-body width="420px" class="report-create" @close="close">
        <div class="report-wrap1" :class="slideOut ? 'slide-out' : ''" v-if="!isLoad">
            <img src="/static/images/loading.gif" alt="" class="move-img">
            <div v-show="showFade" :class="showFade ? 'transition-box' : ''" style="padding-top: 20px;">正在导入案件信息...<!-- <span v-for="(item, index) in dot" :key="index">{{item}}</span> --></div>
            <div v-show="showFade2" :class="showFade2 ? 'transition-box' : ''">正在导入案件办理记录...<!-- <span v-for="(item, index) in dot" :key="index">{{item}}</span> --></div>
            <div v-show="showFade3" :class="showFade3 ? 'transition-box' : ''">正在导入律师名片...<!-- <span v-for="(item, index) in dot" :key="index">{{item}}</span> --></div>
        </div>
        <div class="report-wrap2" :class="slideIn ? 'slide-in' : ''" v-if="slideIn">
            <img src="/static/images/report-already.png" alt="" class="report-already">
            <p class="report-txt">主上大人，您的专属案件报告已经生成，</p>
            <p class="report-txt">关注公众号“案件云平台”，输入接头暗号</p>
            <p class="report-txt">（案件查阅密码）就能查阅啦，截图该界面分享给客户查阅吧！</p>
            <div class="report-pwd">查阅密码：<span class="fw-700">{{pwd}}</span><span class="cursor pwd-modify" @click="modifyPwd">修改</span><!-- <span class="cursor pwd-modify" id="copyBtn" :data-clipboard-text="pwd" @click="copy">复制</span> --></div>
            <img src="/static/images/gold-qr.png" alt="" class="report-qr">
            <p class="qr-txt">扫码关注</p>
        </div>
    </el-dialog>
</template>

<script>
    import { mapActions } from 'vuex'
    import { SET_V_INFO } from 'store/actions/type'
    import Clipboard from 'clipboard';
    let timer = null
    let timer1,timer2,timer3,timer4,timer5
    export default {
        props: ['reportInfo'],
        data() {
            return {
                isLoad: false,
                visible: false,
                showFade: false,
                showFade2: false,
                showFade3: false,
                dot: ['.'],
                slideOut: false,
                slideIn: false,
                code: '',
                pwd: ''
            }
        },
        mounted() {

        },
        watch: {
            reportInfo(val) {
                if (val.report_code || this.isLoad) {
                    this.visible = val.visible
                    this.code = val.code
                    if (val.report_code) {
                        this.pwd = val.report_code
                    }
                    this.isLoad = true
                    this.slideIn = true
                } else {
                    Object.assign(this.$data, this.$options.data())
                    this.visible = val.visible
                    this.code = val.code
                    this.init()
                }
            }   
        },
        created() {
        },
        beforeDestroy () {
        },
        methods: {
            ...mapActions({
                set_v_info: SET_V_INFO
            }),
            // copy() {
            //     var clipboard = new Clipboard('#copyBtn')
            //     clipboard.on('success', e => {
            //         this.$message.success('复制成功')
            //         clipboard.destroy()
            //     })
            //     clipboard.on('error', e => {
            //         this.$message.warning('该浏览器不支持自动复制，请手动复制查阅密码')
            //         clipboard.destroy()
            //     })
            // },
            init() {
                timer1 = setTimeout(() => {
                    this.showFade = true
                },500)
                timer2 = setTimeout(() => {
                    this.showFade2 = true
                },1400)
                timer3 = setTimeout(() => {
                    this.showFade3 = true
                },2300)
                timer4 = setTimeout(()=>{
                    this.createCode()
                },2700)
                timer = setInterval(()=>{
                    if (this.dot.length >= 3) {
                        this.dot = ['.']
                    } else {
                        this.dot.push('.')
                    }
                }, 500)
            },
            close() {
                this.showFade = false
                clearInterval(timer)
                clearTimeout(timer1)
                clearTimeout(timer2)
                clearTimeout(timer3)
                clearTimeout(timer4)
                clearTimeout(timer5)
            },
            createCode() {
                let params = {
                    case_code: this.code
                }
                this.$fetch.api_report.create(params).then(({data, msg, code}) => {
                    if (code === 0) {
                        this.slideOut = true
                        this.pwd = data.code
                        timer5 = setTimeout(()=>{
                            this.isLoad = true
                            this.slideIn = true
                        }, 420)
                    }
                }).catch(({msg}) => {
                    this.$message.error(msg)
                })
            },
            modifyPwd() {
                this.isLoad = false
                this.slideOut = false
                this.slideIn = false
                this.showFade = false
                this.showFade2 = false
                this.showFade3 = false
                this.init()
            }
        }

    }
</script>
<style lang="scss">
.transition-box {
    text-align: center;
    padding-top: 20px;
    font-size:14px;
    font-weight:400;
    color: #666;
    animation-duration: 600ms;
    animation-name: bgFadeIn;
}
.slide-in{
    animation-duration: 500ms;
    animation-name: bgSlideIn;
}
.slide-out{
    animation-duration: 500ms;
    animation-name: bgSlideOut;
}
.delay-300{
    animation-delay: 300ms;
}
.delay-1500{
    animation-delay: 1500ms;
}
.delay-2500{
    animation-delay: 1500ms;
}
@keyframes bgFadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
@keyframes bgFadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
@keyframes bgSlideIn {
    0% {
        opacity: 0;
        transform: translateY(200px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes bgSlideOut {
    0% {
        opacity: 1;
        transform: translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateY(-200px);
    }
}
.report-create{
    text-align: center;
    .el-dialog{
        height: 460px;
    }
    .el-dialog__header{
        border-bottom: none;
    }
    .el-dialog__body{
        padding: 0;
        overflow: hidden;
    }
    .move-img{
        width:350px;
        height:220px;
    }
    .report-already{
        width: 190px;
        height: 118px;
    }
    .report-txt{
        font-size: 14px;
        color: #666;
        padding-top: 15px;
        line-height: 1;
    }
    .report-pwd{
        color: #333;
        font-size: 16px;
        line-height: 1;
        padding-top: 25px;
        .pwd-modify{
            color: #999;
            font-size: 14px;
            padding-left: 20px;
        }
    }
    .report-qr{
        width: 125px;
        height: 125px;
        margin-top: 20px;
    }
    .qr-txt{
        font-size: 14px;
        color: #999;
    }
}
</style>
