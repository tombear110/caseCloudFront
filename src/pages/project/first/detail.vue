<template>
    <div class="case-detail">
        <div class="wrap">
            <div class="left-box" style="box-shadow: none">
                <router-view name="info" :info-data="baseData"></router-view>
                <router-view name="case" v-show="baseData.type === 1" :case-data="baseData"></router-view>
                <router-view name="file" :detail-data="baseData"></router-view>
            </div>
            <div class="right-box" style="background-color: #fff;">
                <router-view :record-data="baseData"></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                baseData: {},
            }
        },
        created () {
            this.getBaseData()
        },

        methods: {
            //渲染数据
            getBaseData () {
                let code = this.$route.params.code
                this.$fetch.api_project.projectLook(code)
                    .then(
                        ({
                             data
                         }) => {
                            this.baseData = data
                            console.log('this.baseData',this.baseData)
                        }
                    )
            }

        }

    }
</script>

