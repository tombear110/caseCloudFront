<template>
    <div class="error-page">
        <div class="error-wrap">
            <div class="image">
                <span>4</span>
                <img src="static/images/404.png" alt="">
                <span>4</span>
            </div>
            <h2 class="title" v-text="title"></h2>
            <h3 class="desc" v-text="desc"></h3>
            <router-link :to="path" class="backBtn" tag="span">返回首页</router-link>
        </div>
    </div>
</template>
<script type="text/javascript">
    export default {
        name: 'noPage',
        data () {
            return {
                image: require('./images/404_error.png'),
                title: 'PAGE NOT FOUND',
                desc: 'WE COULDN’T FIND THIS PAGE',
                path: '/'
            }
        },
        methods:{
            jumpHome(){
                console.log('1111')
                this.$router.push({name:'/'})
            },
        },

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>
    .error-page {
        display: flex;
        width: 100%;
        height: 100vh;
        align-items: center;
        justify-content: center;
        background: #F0F2F5;
        .error-wrap{
            text-align: center;
        }
        .image {
            display: flex;
            width: 675px;
            justify-content: space-between;
            align-items: center;
           span{
               font-size: 320px;
               font-weight: 700;
               color: #CDD7EC;
           }
        }
        .title {
            color: #fff;
            font-size: 66px;
            font-weight: bold;
            margin: 60px 0;
        }
        .desc {
            font-size: 32px;
            color: #688AC2;
            font-weight: bold;
            line-height: 30px;
        }
        .backBtn {
            display: inline-block;
            width: 148px;
            height: 43px;
            line-height: 43px;
            margin-top: 45px;
            font-size: 24px;
            color: #666;
            border: 1px solid #666;
            border-radius: 8px;
            cursor: pointer;
            &:hover{
                color: #688AC2;
                border-color:#688AC2 ;
            }
        }
    }
</style>
