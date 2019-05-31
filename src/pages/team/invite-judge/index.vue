<template>
    <div class="panel personal">
    </div>
</template>

<script>
    //    /user_center/info?teamToken=$2y$10$EF6eVaoZxuHclRzkPE/Nj.PyB9EChjLnY3g8mY/ix.9vb.wMoPaGG
    //    /team/invite_judge?token=$2y$10$hG.w2H3HPo7gukJ6j4LxVeIwg3/XxU7W2eCJQHgybjxDKSwnIh.3S
    export default {
        data () {
            return {
                team_name: ''
            }
        },
        created () {
            this.get_invite_info()
        },
        methods: {
            //根据url中token获取邀请信息，
            get_invite_info () {
                let token = this.$route.query.token
                this.$fetch.api_invitation.look(
                    { token: token }
                )
                    .then(
                        ({
                             data
                         }) => {
                            if (data.firm_id) {
                                //律所注册
                                this.$router.push({
                                    path: '/register?token=' + data.token + '&type=' + data.type + '&firm_name=' + data.firm_name + '&firm_id=' + data.firm_id
                                    + '&email=' + data.email
                                })
                            } else {
                                //律师注册
                                //未注册用户，团队邀请注册
                                if (data.is_register === 0) {
                                    this.$router.push({
                                        path: '/register?token=' + data.token + '&type=' + data.u_type + '&team_name=' + data.team_name + '&team_id=' + data.team_id
                                        + '&email=' + data.email
                                    })
                                } else {
                                    //已注册已登录可以直接跳转到团队管理
                                    this.$router.push({
                                        name: 'teamManage',
                                        query: {
                                            teamToken: data.token,
                                            teamName: data.team_name
                                        }
                                    })
                                    //已注册未登录，会自动转到登录页，并且带了相关参数
                                }
                            }

                        }
                    ).catch(({ code }) => {
                        this.$router.push({
                            path: '/404'
                        })
                    })
            }

        }
    }

</script>
