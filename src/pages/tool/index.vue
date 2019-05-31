<template>
    <div class="tool">
        <div class="row-x">
            <router-view></router-view>
        </div>
        <div class="row-3x">
            <router-view name="toolCourthouse"></router-view>
        </div>
        <!--<router-view name="toolCaculate"></router-view>-->
    </div>
</template>

<script type="text/javascript">
    import store from 'store'

    export default {
        components: {},
        data () {
            return {}
        },
        computed: {},
        methods: {

        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">


</style>
