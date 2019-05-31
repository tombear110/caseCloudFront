<template>
    <div class="case-detail">
        <div class="wrap" style="padding-bottom: 20px">
            <div class="left-box" >
                <router-view :case-data="baseData"></router-view>
            </div>
            <div class="right-box" style="background-color: #fff">
                <router-view name="info" :case-data="baseData"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import store from 'store'
    import { mapActions } from 'vuex'
    import { SET_CASE_DATA, } from 'store/actions/type'
    import { server_base_url } from 'common/config'
    export default {
        components: {},
        data () {
            return {
                baseData: {},
                baseUrl: server_base_url,
                token: store.state.user_info.token,
                code:this.$route.params.code,

            }
        },
        created () {
            this.getBaseData()
        },
        computed: {
            /**
             * 计算vuex中caseData
             * @params: mod
             * @return: 返回值/返回值说明
             */
            caseData() {
                return store.state.case_data.isChange
            }
        },
        watch:{
            /**
             * 监听基础数据是否发生变动，
             * 若发生改变，则重新请求
             * @params: mod
             * @return: 返回值/返回值说明
             */
            caseData(newVal, oldVal){
                console.log('newVal',newVal)
                this.getBaseData()
            },
        },

        methods: {

            ...mapActions({
                set_case_data: SET_CASE_DATA,
            }),

            //渲染数据
            getBaseData () {
                this.$fetch.api_case.caseShow(this.code)
                    .then(
                        ({
                             data,
                            code,
                         }) => {
                            this.baseData = data
                        }
                    )
                    .catch((msg) => {
                    })
            },



        }

    }
</script>

