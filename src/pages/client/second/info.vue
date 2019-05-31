<template>
    <div class="section" style="padding-bottom: 0">
        <div class="title-wrap">
            <i class="iconfont list-suffix" :class="baseData.mark===1 ? 'icon-qiye' :'icon-geren'"></i>
            <ul class="list-group">
                <li class="item-title">
                    <h4 class="co-333">{{baseData.name}}</h4>
                    <el-tag size="mini" :type="baseData.type===2?'gray':'gold'"
                            style="padding: 0 10px;border-radius: 100px;">{{baseData.type_text}}
                    </el-tag>
                    <div class="item-title__suffix">
                        <div class="btn-text" @click="openEditModal(baseData)">
                            <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                            <span>修改信息</span>
                        </div>
                    </div>
                </li>
                <li class="item-text" v-if="baseData.description">
                    {{baseData.description}}
                </li>
                <li class="item-text" v-else>
                    暂无备注
                </li>
            </ul>
        </div>
        <ul class="table-group">
            <li class="item">
                <span class="label">客户编号：</span>
                <div class="text">{{baseData.c_num}}</div>
            </li>
            <li class="item">
                <span class="label">所属行业：</span>
                <div class="text">{{baseData.industry_text}}</div>
            </li>
            <li class="item">
                <span class="label">客户来源：</span>
                <div class="text">{{baseData.from_text}}</div>
            </li>
            <li class="item">
                <span class="label">跟进人：</span>
                <div class="text">{{baseData.follower_text}}</div>
            </li>
        </ul>
        <div class="panel" style="border-bottom: 1px solid #e1e4ee;">
            <div class="panel-title">
                <h4 v-if="baseData.mark===1">企业资料</h4>
                <h4 v-if="baseData.mark===2">个人资料</h4>
            </div>
        </div>
        <ul class="table-group" v-if="baseData.mark===1">
            <li class="item">
                <span class="label">单位名称：</span>
                <div class="text">{{baseData.name}}</div>
            </li>
            <li class="item">
                <span class="label">注册地址：</span>
                <div class="text">{{baseData.address}}</div>
            </li>
            <li class="item">
                <span class="label">法定代表人：</span>
                <div class="text">{{baseData.legal_per}}</div>
            </li>
            <li class="item">
                <span class="label" style="width: 135px">统一社会信用代码：</span>
                <div class="text">{{baseData.card_num}}</div>
            </li>
        </ul>
        <ul class="table-group" v-if="baseData.mark===2">
            <li class="item">
                <span class="label">姓名：</span>
                <div class="text">{{baseData.name}}</div>
            </li>
            <li class="item">
                <span class="label">民族：</span>
                <div class="text">{{baseData.nation}}</div>
            </li>
            <li class="item">
                <span class="label">性别：</span>
                <div class="text" v-if="baseData.sex===0">男</div>
                <div class="text" v-else>女</div>
            </li>
            <li class="item">
                <span class="label">联系方式：</span>
                <div class="text">{{baseData.contact}}</div>
            </li>
            <li class="item">
                <span class="label">住所地：</span>
                <div class="text">{{baseData.address}}</div>
            </li>
            <li class="item">
                <span class="label">证件号码：</span>
                <div class="text">{{baseData.card_num}}</div>
            </li>
        </ul>
        <client-new :client-edit="clientEdit" @refreshData="refreshData"></client-new>
    </div>
</template>
<script>
    import {clientNew} from 'components'

    export default {
        props: ['detailData'],
        components: {
            clientNew
        },
        data() {
            return {
                infoTab: [
                    {text: '关联项目'}
                ],
                tabActive: 0,
                projectVisible: false,
                projectData: [],
                baseData: {},
                clientEdit: '',
                hasLinkData: [],
                noLinkData: []
            }
        },
        created() {

        },
        watch: {
            detailData(val) {
                this.baseData = val
                let arr = val.project
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].cl_id) {
                        this.hasLinkData.push(arr[i])
                    } else {
                        this.noLinkData.push(arr[i])
                    }
                }

            }
        },
        methods: {
            jumpProjectDetail(row) {
                this.$router.push({
                    name: 'projectCode',
                    params: {
                        code: row.pr_code
                    }
                })
            },

            //点击关联项目的row，跳转到详情页
            clickRow(row, event, column) {
                this.$router.push({
                    name: 'projectCode',
                    params: {
                        code: row.pr_code
                    }
                })
            },

            //解除关联
            releaseClient(item, index) {
                item.cl_id = 0
                this.onSubmit(item, index)
            },

            //关联客户
            catchClient(row, index) {
                row.cl_id = this.baseData.id
                this.onSubmit(row, index)
            },

            //修改项目的cl_id
            onSubmit(data, index) {
                this.$fetch.api_project.projectPut({cl_id: data.cl_id}, data.id)
                    .then(({
                               msg
                           }) => {
                        this.$message.success(msg)
                        if (data.cl_id) {
                            //关联客户
                            //从noLinkData中去除，加入到hasLinkData
                            this.noLinkData.splice(index, 1)
                            this.hasLinkData.push(data)

                        } else {
                            //解除关联
                            //从hasLinkData中去除，加入到noLinkData
                            this.hasLinkData.splice(index, 1)
                            this.noLinkData.push(data)
                        }
                    })
            },

            openEditModal(data) {
                this.clientEdit = {
                    visible: true,
                    code: data.code
                }
            },

            refreshData() {

            },

            showProjectDialog() {
                if (this.noLinkData.length) {
                    this.projectVisible = true
                } else {
                    this.$message.warning('暂无待关联项目')
                }
            }
        }
    }
</script>
