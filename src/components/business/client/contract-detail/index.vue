<template>
    <el-dialog
        :title="baseData.title"
        :visible.sync="visible"
        v-loading="loading"
        width="800px">
        <!--:before-close="handleClose"-->
        <ul class="step-group" v-loading="loading">
            <li class="item">
                <div class="title">
                    <h4>合同详情</h4>
                </div>
                <ul class="list-group">
                    <li class="item-text">
                        <span class="it-label">合同编号：</span>
                        <span class="it-text">{{baseData.num}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">所属项目：</span>
                        <span class="it-text" v-if="baseData.pr_data">{{baseData.pr_data.pr_name}}</span>
                        <span class="it-text" v-else></span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">签约甲方：</span>
                        <span class="it-text">{{baseData.part_a}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">签约日期：</span>
                        <span class="it-text">{{baseData.sign_at_text}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">合同期限：</span>
                        <span class="it-text">{{baseData.period}}年</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">签约乙方：</span>
                        <span class="it-text">{{baseData.part_b}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">合同到期日：</span>
                        <span class="it-text">{{baseData.end_time_text}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">合同状态：</span>
                        <span class="it-text">{{baseData.status_text}}</span>
                    </li>
                    <li class="item-text">
                        <span class="it-label">自动延期：</span>
                        <span class="it-text">{{baseData.extend_at}}年</span>
                    </li>
                </ul>
            </li>
            <li class="item">
                <div class="title">
                    <h4>付费条款</h4>
                </div>
                <p class="text" v-if="baseData.fee_terms">{{baseData.fee_terms}}</p>
                <p class="text" v-else>暂无付费条款</p>
            </li>
            <li class="item">
                <div class="title">
                    <h4>合同文书</h4>
                </div>
                <div class="file" v-if="baseData.file_arr.length">
                    <a class="sm-file" v-for="(item,index) in baseData.file_arr" :key="index"
                       v-if="baseData.file_arr.length" :href="url+'cfile/'+item.id+'/download?token='+mytoken" target="_blank">
                        <i class="iconfont  icon-fileempty co-666 pd-right-5"></i>
                        <span class="nowrap co-333 pd-right-5">{{item.file_name}}</span>
                        <i class="iconfont  icon-xiazai text-info"></i>
                    </a>
                </div>
                <p class="text" v-if="!baseData.file_arr.length">暂无相关文书</p>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="onEdit(baseData.code)">编辑</el-button>
            <el-button  @click="onDelete(baseData.id)">删除</el-button>
        </span>
    </el-dialog>
</template>
<script>

    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        props: [  'contractDetail'],
        data () {
            return {
                title: '',
                baseData: {
                    file_arr: []
                },
                loading:false,
                visible: false,
                url: server_base_url,
                mytoken: store.state.user_info.token
            }
        },

        watch: {
            contractDetail (val) {
                this.visible = val.visible
                this.getBaseData(val.code)
            }
        },
        methods: {

            handleClose (done) {
//
            },
            //获取详情
            getBaseData(code) {
                this.$fetch.api_contract.contractLook(code)
                    .then(({
                               data
                           }) => {
                        this.baseData = data
                    })
            },

            onEdit(code){
                this.$emit('onContractEdit',code)
                this.visible= false
            },
            //删除
            onDelete(id) {
                this.$confirm('此操作将删除该合同, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass:'is-plain',
                }).then(() => {
                    this.handleDelete(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //删除文件
            handleDelete(id) {
                this.$fetch.api_contract.contractDel(
                    id
                )
                    .then(({
                               msg
                           }) => {
                            this.visible = false
                            this.$emit('refreshContractDelete',{code:this.baseData.code})
                        }
                    )
            },
        }
    }
</script>


