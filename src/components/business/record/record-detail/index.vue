<template>
<el-dialog :title="title" :visible.sync="visible" :modal="true" append-to-body width="700px">
    <ul class="step-group" v-loading="loading">
        <li class="item">
            <div class="title">
                <h4>办理记录</h4>
            </div>
            <ul class="list-group">
                <li class="item-text">
                    <span class="it-label">主办人员：</span>
                    <span class="it-text">{{baseData.huser_text}}</span>
                </li>
                <li class="item-text">
                    <span class="it-label">协办人员：</span>
                    <span class="it-text">{{baseData.assit_text}}</span>
                </li>
                <li class="item-text">
                    <span class="it-label">办理时间：</span>
                    <span class="it-text">{{baseData.htime_text}}</span>
                </li>
                <li class="item-text">
                    <span class="it-label">结束时间：</span>
                    <span class="it-text">{{baseData.endtime_text}}</span>
                </li>
                <li class="item-text">
                    <span class="it-label">时间花费：</span>
                    <span class="it-text">{{baseData.time_cost}}分钟</span>
                </li>
                <li class="item-text">
                    <span class="it-label">费用花费：</span>
                    <span class="it-text">{{baseData.fee_cost}}元</span>
                </li>
                <li class="item-text">
                    <span class="it-label">重要提醒：</span>
                    <span class="it-text">{{baseData.remind_time_text}}</span>
                </li>
                <li class="item-text">
                    <span class="it-label">待办状态：</span>
                    <span class="it-text" v-if="baseData.hstatus===0">待办</span>
                    <span class="it-text" v-else>已办</span>
                </li>
                <li class="item-text" style="width: 100%" v-if="baseData.type !==3">
                    <span class="it-label" v-if="baseData.type ===1">关联案件：</span>
                    <span class="it-label" v-if="baseData.type ===2">关联项目：</span>
                    <span class="it-label" v-if="baseData.type ===4">关联客户：</span>
                    <p class="it-text  text-info" v-if="baseData.type ===1">
                        <span class="cursor" @click="jumpLink(baseData.linkid_id_info.code,1)">{{baseData.linkid_id_info.linkid_text}}</span>
                    </p>
                    <p class="it-text cursor text-info" v-if="baseData.type ===2">
                        <span class="cursor" @click="jumpLink(baseData.linkid_id_info.pr_code,2)">{{baseData.linkid_id_info.pr_name}}</span>
                    </p>
                    <p class="it-text cursor text-info" v-if="baseData.type ===4">
                        <span class="cursor" @click="jumpLink(baseData.linkid_id_info.code,4)">{{baseData.linkid_id_info.name}}</span>
                    </p>
                </li>
            </ul>
        </li>
        <li class="item">
            <div class="title">
                <h4>工作详情</h4>
            </div>
            <p class="text" v-if="baseData.content">{{baseData.content}}</p>
            <p class="text" v-else>暂无详情</p>
        </li>
        <li class="item">
            <div class="title">
                <h4>案件文书</h4>
            </div>
            <div class="file" v-if="baseData.case_file.length">
                <a class="sm-file" v-for="(item,index) in baseData.case_file" :key="index"
                     :href="url+'cfile/'+item.id+'/download?token='+mytoken"
                       target="_blank">
                        <i class="iconfont  icon-fileempty co-666 pd-right-5"></i>
                        <span class="nowrap co-333 pd-right-5">{{item.file_name}}</span>
                        <i class="iconfont  icon-xiazai text-info"></i>
                    </a>
            </div>
            <p class="text" v-if="!baseData.case_file.length">暂无相关文书</p>
        </li>
    </ul>
    <span slot="footer" class="dialog-footer" v-if="isReadOnly">
            <el-button  @click="visible=false">关闭</el-button>
        </span>
    <span slot="footer" class="dialog-footer" v-else>
            <el-button  type="primary" @click="onEditRecord(baseData)">编辑</el-button>
            <el-button  @click="onDeleteRecord(baseData.rcode)">删除</el-button>
        </span>
</el-dialog>
</template>

<script>
import store from 'store'
import {
    server_base_url
} from 'common/config'

export default {
    props: ['recordDetail'],
    data() {
        return {
            title: '',
            baseData: {
                case_file: []
            },
            visible: false,
            isReadOnly: false,
            loading: false,
            url: server_base_url,
            mytoken: store.state.user_info.token
        }
    },
    watch: {
        recordDetail(val) {
            this.visible = val.visible
            this.isReadOnly = val.isReadOnly
            this.get_data(val.code)
        }
    },
    mounted() {
    },
    methods: {

        jumpLink(code, type) {
            console.log(code, type)
            switch (type) {
                case 1:
                    this.$router.push({
                        name: 'caseDetail',
                        params: {
                            code: code
                        }
                    })
                    break
                case 2:
                    this.$router.push({
                        name: 'projectCode',
                        params: {
                            code: code
                        }
                    })
                    break
                case 4:
                    this.$router.push({
                        name: 'customerDetail',
                        params: {
                            code: code
                        }
                    })
                    break
            }
        },
        //获取详情
        get_data(code) {
            this.loading = true
            this.$fetch.api_record.detail(code)
                .then(({
                    data
                }) => {
                    this.baseData = data
                    console.log(' this.baseData', this.baseData)
                    this.title = data.rtype_text
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },

        onEditRecord(data) {
            this.visible = false
            this.$emit('onEdit', data)
        },
        //删除文件
        delRecord(val) {
            this.$fetch.api_record.deleted(
                    val
                )
                .then(({
                    msg
                }) => {
                    this.$emit('refreshDelete', true)
                    this.visible = false
                })
        },

        //删除某一条数据
        onDeleteRecord(val) {
            this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'is-plain'
            }).then(() => {
                this.delRecord(val)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }

    }
}
</script>
