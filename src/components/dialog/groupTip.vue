<template>
    <el-dialog :visible.sync="showGroup" append-to-body width="600px" class="fee-dialog"
                   :close-on-click-modal="false">
        <div class="group-wrap">
            <el-button round class="group-btn" @click="getTemporaryVip">马上体验高阶版</el-button>
            <i class="iconfont icon-quxiao co-black group-close-icon" @click="closeFee"></i>
        </div>
    </el-dialog>
</template>

<script>
    import { mapActions } from 'vuex'
    import { SET_V_INFO } from 'store/actions/type'
    export default {
        props: ['groupShow'],
        data() {
            return {
                showGroup: false
            }
        },
        computed: {

        },
        watch: {
            groupShow(val) {
                this.showGroup = true
            }
        },
        created() {
        },
        methods: {
            ...mapActions({
                set_v_info: SET_V_INFO
            }),
            closeFee() {
                this.showGroup = false
                this.$router.go(-1)
            },
            getTemporaryVip() {
                this.$fetch.api_order.save().then(({data, code}) => {
                    if (code === 0) {
                        this.showGroup = false
                        this.set_v_info(data.v_info)
                        this.$router.push({ name: 'createTeam'})
                    }
                }).catch(() => {
                })
            }
        }

    }
</script>
<style lang="scss">
.group-wrap{
    width: 600px;
    height: 780px;
    background: url('/static/images/group-pic.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    .group-btn{
        width: 340px;
        height: 72px;
        background: #846545;
        color: #fff;
        border: none;
        position: absolute;
        bottom: 40px;
        left: 50%;
        margin-left: -170px;
        border-radius: 100px;
        font-size: 28px;
    }
    .group-close-icon{
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 15px;
        color: #ccc;
    }
}
</style>
