<template>
    <div class="">
        <router-view :key="key" :select-data="selectData"></router-view>
    </div>
</template>

<script type="text/javascript">
    import { projectNew } from 'components'

    export default {
        components: {
            projectNew
        },
        data () {
            return {
                selectData: {
                    host: 0,
                    pr_status: 0,
                    type: 0
                },

            }
        },
        created () {
        },
        watch: {
            routeName (val) {
                this.host = 0
                this.pr_status = 0
                this.pr_type = 0
            }
        },

        computed: {

            key () {
                return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
            }
        },
        methods: {



        }

    }
</script>
<style>

</style>
