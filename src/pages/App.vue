<template>
    <div class="main">
        <header>
            <top-menu></top-menu>
        </header>
        <div class="container">
            <aside>
                <left-menu></left-menu>
            </aside>
            <div class="content " :class="{'is-collapse':isCollapse}">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
    import {
        leftMenu,
        topMenu,

    } from 'components'
    import store from 'store'

    export default {
        name: 'page',
        components: {
            leftMenu,
            topMenu,
        },
        computed:{
            isCollapse(){
                return store.state.case_info.isCollapse
            },
        },

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

    .main{
        position: relative;
        header{
            position: fixed;
            top:0;
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            background-color: #323232;
            z-index: 99;
        }
        .container{
            position: relative;
            box-sizing: border-box;
            padding-top: 60px;
            display: flex;
            width: 100%;
            aside{
                position: fixed;
                top:60px;
                border-radius: 4px;
                border-top: 1px solid #E6E6E6;
                border-right: 1px solid #E6E6E6;
            }
            .content{
                flex: 1;
                width: 100%;
                /*margin-bottom: 20px;*/
                box-sizing: border-box;
                padding-left:240px ;
                padding-right: 20px;
                transition: all .5s;
            }
            .is-collapse{
                padding-left: 84px;
            }
        }
    }
</style>

