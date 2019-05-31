<template>
    <div class="login login-register">
        <div class="login-box">
            <div class="login-img">
                <img class="img-mobile" src="/static/images/login-mobile.png" alt="">
                <ul class="wx-group">
                    <li class="item-img">
                        <img src="/static/images/login-ewm.jpg" alt="">
                    </li>
                    <li class="item-text">微信扫一扫</li>
                    <li class="item-text">或搜索 “ <span style="color: #fff;">案件云</span> ” 小程序</li>
                    <li class="item-text">点击“关注”</li>
                    <li class="item-text">使用手机端，更方便哦！</li>
                </ul>
            </div>
            <router-view></router-view>
        </div>
        <div class="copyright">
            <a href="http://www.law086.com" target="_blank">官方网站</a>
            <span class="mg-left-5 mg-right-5" style="color: #fff;opacity: 0.5">|</span>
            <!-- <img src="/static/images/copyright.png" /> -->
            <span>Copyright © 2019 All rights reserved 律杏科技 版权所有 沪ICP备10018377号-3</span>
        </div>
    </div>
</template>

<script type="text/javascript">

    export default {
        data () {
            return {

            }
        },
        created () {

        },
        methods: {

        }
    }
</script>

<style scope type="text/scss" rel="stylesheet/scss">


</style>
