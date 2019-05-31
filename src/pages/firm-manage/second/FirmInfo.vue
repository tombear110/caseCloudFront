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
                <li class="list-item" style="width: 100%;min-width: 100%">
                    <span class="item-label">律所名称：</span>
                    <div class="item-body">
                        <span>{{form.name}}</span>
                        <el-button class="mg-left-20" plain size="micro" v-if="!form.fid && routeName !== 'parent_firm'"
                                   @click="openLawfirmDialog">
                            加入律所
                        </el-button>
                    </div>
                </li>
                <li class="list-item" style="width: 100%;min-width: 100%">
                    <span class="item-label">律所代码：</span>
                    <div class="item-body">
                        <span >{{form.code}}</span>
                        <el-button plain class="mg-left-20"
                                   size="micro"
                                   v-clipboard:copy="form.code"
                                   v-clipboard:success="onCopy"
                                   v-clipboard:error="onError">复制代码
                        </el-button>
                    </div>
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
        <!--修改信息-->
        <el-dialog title="提示" :visible.sync="visible">
            <el-form ref="form" label-width="90px" 
                     with="650px"
                     :model="form"
                     :rules="rules">
                <el-row class="">
                    <el-col :span="12">
                        <el-form-item label="律所名称" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="律所代码" prop="code">
                            <el-input disabled v-model="form.code"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="area" label="所在地区">
                            <el-input v-model="form.area"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="执业证号" prop="card_num">
                            <el-input v-model=" form.card_num" type="tell"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="主管司法局" prop="justice_bureau">
                            <el-input v-model="form.justice_bureau"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="charge_man">
                            <el-input v-model="form.charge_man"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="成立日期">
                            <el-date-picker
                                v-model="form.birthday"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                                style="width: 100%;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="org_type" label="组织形式">
                            <el-select v-model="form.org_type" clearable style="width: 100%">
                                <el-option label="普通合伙人" :value="1"></el-option>
                                <el-option label="特殊的普通合伙" :value="2"></el-option>
                                <el-option label="个人" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="contact_man" label="联系人">
                            <el-input type="text" v-model="form.contact_man"
                                      :autofocus="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="contact_phone" label="联系电话">
                            <el-input type="text" v-model="form.contact_phone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="text-right">
                <el-button type="primary"   @click="putFirmInfo('form')">确认修改</el-button>
                <el-button   @click="toggle = true" plain>返回</el-button>
            </div>
        </el-dialog>
        <!--加入律所-->
        <join-lawfirm :data="joinDialogData" @refreshData="refreshData"></join-lawfirm>
    </div>
</template>
<script>
    import {  joinLawfirm } from 'components'
    import { mapActions } from 'vuex'
    import { SET_USER_INFO } from 'store/actions/type'
    import store from 'store'
    import { server_base_url, img_url } from 'common/config'

    export default {
        components: {
            joinLawfirm
        },
        data () {
            return {
                visible: false,
                tabActive:0,
                infoTab: [
                    {
                        text: '律所信息'
                    }
                ],
                joinDialogData: {},
                panelData: {
                    title: '律所信息'
                },
                clickLi: 0,
                titles: ['个人中心', '密码修改'],
                toggle: true,
                img_url: img_url,
                url: server_base_url,
                user: store.state.user_info.user,
                routeName: this.$route.name,
                form: {
                    fid: ''
                },
                rules: {
                    name: [
                        { required: true, message: '请输入律所名称', trigger: 'blur' }
                    ],
                    contact_man: [
                        { required: true, message: '请输入联系人！', trigger: 'blur' }
                    ],
                    contact_phone: [
                        { required: true, message: '请输入联系电话！', trigger: 'blur' }
                    ]
                },
                imageUrl: '',
                loading: false
            }
        },
        created () {
            this.getFirmInfo()
        },
        methods: {
            ...mapActions({
                set_user_info: SET_USER_INFO
            }),

            openLawfirmDialog () {
                this.joinDialogData = { join_type: 3 }
            },

            refreshData (val) {
                if (val) {
                    this.getFirmInfo()
                }
            },
            //复制代码到剪贴板
            // 复制成功
            onCopy (e) {
                console.log(e)
                this.$message.success('复制成功')
            },
            // 复制失败
            onError (e) {
                this.$message.error('复制失败')
            },

            //获取律所数据，
            getFirmInfo () {
                this.loading = true
                if (!this.user.firm_info) {
                    this.user.firm_info = {}
                }
                const firmId = (this.$route.name === 'firm_info') ? this.user.firm_id : this.user.firm_info.fid
                this.$fetch.api_firm.look(firmId)
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
            //修改用户信息
            putFirmInfo (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) return false
                    this.loading = true
                    const delArr = [
                        'add_uid', 'child_ids', 'updated_at', 'f'
                    ]
                    for (let i = 0; i < delArr.length; i++) {
                        delete this.form[delArr[i]]
                    }
                    let submitForm = this.form
                    //提交
                    const firmId = (this.$route.name === 'firm_info') ? this.user.firm_id : this.user.firm_info.fid
                    this.$fetch.api_firm.put(firmId, submitForm)
                        .then(({
                                   msg,
                                   data
                               }) => {
                            this.$message.success(msg)
                            this.toggle = true
                            this.loading = false
                        })
                        .catch(({
                                    code,
                                    msg
                                }) => {
                            this.loading = false
                        })
                })
            }
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>

