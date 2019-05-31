<template>
    <div class="user-info mg-bottom-20" style="min-height: 350px">
        <div class="tab-component">
            <ul class="tab-list">
                <li class="tab-item" :class="{'tab-active':tabActive===index}"
                    v-for="(item,index) in infoTab"
                    :key="item.text">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <div class="user-table">
            <ul class="list-group"  v-loading="loading"
                element-loading-text="拼命加载中">
                <li class="list-item">
                    <span class="item-label">律所名称：</span>
                    <div class="item-body">{{form.name}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">所在地区：</span>
                    <div class="item-body">{{form.area}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">执业证号：</span>
                    <div class="item-body">{{form.card_num}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">主管司法局：</span>
                    <div class="item-body">{{form.justice_bureau}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">负责人：</span>
                    <div class="item-body">{{form.charge_man}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">成立日期：</span>
                    <div class="item-body">{{form.birthday}}</div>
                </li>
                <li class="list-item">
                    <span class="item-label">组织形式：</span>
                    <div class="item-body" v-if="form.org_type === 1">普通合伙人</div>
                    <div class="item-body" v-else-if="form.org_type === 2">特殊的普通合伙</div>
                    <div class="item-body" v-else>个人</div>
                </li>
                <li class="list-item">
                    <span class="item-label">联系电话：</span>
                    <div class="item-body">{{form.contact_phone}}</div>
                </li>
                <li style="margin-top: 30px;min-width: 100%;text-align: right" >
                    <el-button type="primary"  @click="visible = true">修改信息</el-button>
                </li>
            </ul>
        </div>
        <!--<div class="user-icon" v-else>-->
        <!--<i class="iconfont icon-jrtd"></i>-->
        <!--<div>-->
        <!--还没有团队，赶紧<span class="text-info cursor" @click="openTeamNew">去创建</span>，或等待团队邀请-->
        <!--</div>-->
        <!--</div>-->
        <!--<join-lawfirm :data="joinDialogData" @refreshData="refreshData"></join-lawfirm>-->
    </div>
</template>
<script>

    import store from 'store'

    export default {
        data () {
            return {
                tabActive:0,
                infoTab: [
                    {
                        text: '律所信息'
                    }
                ],
                form:{},
                loading: false
            }
        },
        created () {
            this.getFirmInfo()
        },
        methods: {
            getFirmInfo () {
                this.loading = true
                const id = this.$route.query.firm_id
                this.$fetch.api_firm.look(id)
                    .then(
                        ({
                             data
                         }) => {
                            console.log('data', data)
                            this.form = data
                            this.loading = false
                        }
                    ).catch(() => {
                    this.loading = false

                })
            },


        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>

