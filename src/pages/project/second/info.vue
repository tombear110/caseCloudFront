<template>
    <div class="section">
        <ul class="title-group--project">
            <li class="item-title">
                <h4>{{baseData.pr_name}}</h4>
                <el-tag size="mini" type="gold" v-if="baseData.pr_status===1"
                        style="border-radius: 100px;padding: 0 10px;">进行中
                </el-tag>
                <el-tag size="mini" type="black" v-else style="border-radius: 100px;padding: 0 10px;">已结束</el-tag>
                <div class="suffix" @click="editCase(baseData)">
                    <i class="iconfont  icon-bianji5 ft-14 mg-right-5"></i>
                    <span>编辑详情</span>
                </div>
            </li>
            <li class="item-text" v-if="baseData.mark">{{baseData.mark}}</li>
            <li class="item-text" v-else>暂无备注</li>
        </ul>
        <ul class="table-group--project">
            <li class="item">
                <span class="label">项目编号：</span>
                <span class="text">{{baseData.p_num}}</span>
            </li>
            <li class="item">
                <span class="label">项目类型：</span>
                <span class="text">{{baseData.pr_type_text}}</span>
            </li>
            <li class="item">
                <span class="label">项目经费：</span>
                <span class="text" v-if="baseData.funding">{{baseData.funding}}元</span>
                <span class="text" v-else>0元</span>
            </li>
            <li class="item">
                <span class="label">主办人员：</span>
                <span class="text">{{baseData.host_text}}</span>
            </li>
            <li class="item">
                <span class="label">开始时间：</span>
                <span class="text">{{baseData.start_time_text}}</span>
            </li>
            <li class="item">
                <span class="label">结束时间：</span>
                <span class="text">{{baseData.end_time_text}}</span>
            </li>
            <li class="item">
                <span class="label">协办人员：</span>
                <span class="text">{{baseData.assit_text}}</span>
            </li>
            <li class="item">
                <span class="label">关联客户：</span>
                <span class="text text-info cursor"
                      @click="goLinkDetail(baseData)">{{baseData.cl_id_name}}</span>
            </li>
        </ul>
        <div class="panel" style="border-bottom: 1px solid #e1e4ee;">
            <div class="panel-title">
                <h4>联系人</h4>
            </div>
            <div class="panel-control co-9FA5B9 cursor" @click="onLinkmanAdd">
                <i class="iconfont  icon-add1 ft-14 mg-right-5"></i>
                <span>添加联系人</span>
            </div>
        </div>
        <el-table
            :data="baseData.clcontacts_arr"
            @row-click="showLinkmanDetail">
            <el-table-column
                prop="name"
                width="90"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="联系方式">
            </el-table-column>
            <el-table-column
                prop="remark"
                :show-overflow-tooltip="true"
                label="备注">
            </el-table-column>
        </el-table>
        <project-new :editData="editData" @refreshData="refreshData"></project-new>
        <linkman-detail :linkman-detail="linkmanDetail" @onLinkmanEdit="onLinkmanEdit"
                        @refreshLinkmanDelete="refreshLinkmanDelete"></linkman-detail>
        <linkman-add :linkman-add="linkmanAdd" :linkman-edit="linkmanEdit" @refreshLinkmanAdd="refreshLinkmanAdd"
                     @refreshLinkmanEdit="refreshLinkmanEdit"></linkman-add>
    </div>
</template>
<script>
    // import {
    //     projectNew,
    //     linkmanDetail,
    //     linkmanAdd
    // } from 'components'

    export default {
        props: ['infoData'],
        components: {
            // projectNew,
            // linkmanAdd,
            // linkmanDetail
        },
        data() {
            return {
                linkmanEdit: {},
                linkmanAdd: {},
                linkmanDetail: {},
                linkmanData: [],
                baseData: {},
                editData: '',
                code: this.$route.params.code,
            }
        },
        watch: {
            infoData(val) {
                this.baseData = val
            },

        },
        methods: {

            goLinkDetail(data) {
                this.$router.push({
                    name: 'customerDetail',
                    params: {
                        code: data.cl_id_code
                    }
                })
            },

            onLinkmanEdit(code) {
                this.linkmanEdit = {
                    visible: true,
                    code: code
                }
            },

            onLinkmanAdd() {
                this.linkmanAdd = {
                    visible: true,
                    cl_id: 0,
                    pr_id: this.baseData.id
                }
            },

            refreshLinkmanDelete(val) {
                let arr = this.baseData.clcontacts_arr
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].id === val.code) {
                        arr.splice(i, 1)
                    }
                }
            },
            refreshLinkmanAdd(val) {
                let arr = this.baseData.clcontacts_arr
                arr.push({
                    name: val.name,
                    mobile: val.mobile,
                    remark: val.remark,
                    id: val.id
                })
            },
            refreshLinkmanEdit(val) {
                let contactArr = this.baseData.clcontacts_arr
                for (let i = 0; i < contactArr.length; i++) {
                    if (val.id === contactArr[i].id) {
                        contactArr[i].name = val.name
                        contactArr[i].mobile = val.mobile
                        contactArr[i].remark = val.remark
                    }
                }

            },

            showLinkmanDetail(row, event, column) {
                this.linkmanDetail = {
                    visible: true,
                    code: row.id,
                    pr_id: this.baseData.id,
                    cl_id: 0
                }
            },

            //编辑案件
            editCase(data) {
                this.editData = {
                    visible: true,
                    code: data.pr_code,
                    id: data.id
                }
            },

            //渲染数据
            getBaseData() {
                this.$fetch.api_project.projectLook(this.code)
                    .then(
                        ({
                             data
                         }) => {
                            this.baseData = data
                        }
                    )
            },
            refreshData(val) {
                if (val) {
                    this.getBaseData()
                }
            }
        }

    }
</script>
