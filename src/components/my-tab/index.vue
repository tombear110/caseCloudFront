<template>
    <div class="tab-component">
        <ul class="tab-list">
            <li class="tab-item" :class="{'tab-active':tabActive===index}" v-for="(item,index) in tabData"
                :key="item.text" @click="tabChange(index)">
                {{item.text}}
            </li>
        </ul>
        <slot name="slot-1"></slot>
        <slot name="slot-2"></slot>
        <slot name="slot-3"></slot>
        <slot name="slot-4"></slot>
    </div>
</template>
<script type="text/javascript">


    export default {
        name: 'myTab',
        props: ['tabData'],
        data () {
            return {
                tabActive: 0,
                routeName: this.$route.name

            }
        },

        created(){
            this.tabClassActive()
        },
        watch: {
            '$route'(to, from) {
                this.tabClassActive()
            }
        },
        methods: {

            //toggle tab
            tabChange (index) {
                this.tabActive = index
                this.$emit('tabEvent', index)
            },
            //tab如果切换的是不同的页面，则进行标记active
            //根据路由显示相应的active-class
            tabClassActive(){
                const routeName = this.$route.name
                //只有一个tab，就不用做标记了
                if (this.tabData.length === 1){return false}
                if (this.tabData[1].index){
                    this.tabData.forEach(value=>{
                        if (value.routeName === routeName){
                            this.tabActive = value.index
                        }
                    })
                }
            },
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

</style>
