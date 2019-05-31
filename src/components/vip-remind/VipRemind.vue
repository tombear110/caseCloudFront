<template>
    <el-dialog :visible.sync="visible" width="560px" custom-class="vip-remind" :class="{'vip-remind--wx':bgWx}"
               :close-on-click-modal="false">
        <div class="content">
            <p class="content-text">{{textA}}</p>
            <p class="content-text">{{textB}}</p>
            <span class="content-link">了解更多高阶版功能（链接）</span>
            <button class="content-btn" @click="getTemporaryVip">立即体验高阶版</button>
        </div>
    </el-dialog>
</template>
<script type="text/javascript">
    import store from 'store'
    export default {
        name: 'VipRemind',
        data () {
            return {
                visible: false,
                textA: '111',
                textB: '2222',
                pathCrown: '/static/images/vip-crown.png',
                pathWx: '/static/images/vip-wx.png',
                bgWx: false
            }
        },

        methods: {

            getTemporaryVip () {
                this.$fetch.api_order.save()
                    .then(({
                               data, code
                           }) => {
                        if (code === 0) {
                            store.dispatch('set_v_info',data.v_info)
                            this.visible = false
                        }
                    })
            },
        }
    }
</script>
