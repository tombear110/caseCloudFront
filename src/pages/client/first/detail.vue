<template>
    <div class="case-detail">
        <div class="wrap">
            <div class="left-box left-box--client" style="box-shadow: none">
                <router-view  :detail-data="baseData"></router-view>
                <router-view name="project" :detail-data="baseData"></router-view>
                <router-view name="file" :detail-data="baseData"></router-view>
            </div>
            <div class="right-box" style="box-shadow: none">
                <router-view name="linkRecord" :detail-data="linkRecordData"></router-view>
                <router-view name="projectRecord" :detail-data="projectRecordData"></router-view>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        components: {},
        data () {
            return {
                baseData:{},
                linkRecordData:{},
                projectRecordData:{},
            }
        },
        created () {
            this.getBaseData()
        },

        methods: {
            //渲染数据
            getBaseData () {
                let code = this.$route.params.code
                this.$fetch.api_client.clientLook(code)
                    .then(
                        ({
                             data
                         }) => {
                            this.baseData = data
                            this.linkRecordData = Object.assign({},data,{isLinkProject:0})
                            this.projectRecordData = Object.assign({},data,{isLinkProject:1})
                        }
                    )
            },
        },
        computed: {
            //切换路由，展示对应数据
            key () {
                return this.$route.name !== undefined
                    ? this.$route.name + new Date()
                    : this.$route + new Date()
            }

        }

    }
</script>


