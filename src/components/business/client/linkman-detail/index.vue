<template>
    <el-dialog
        title="联系人详情"
        :visible.sync="visible"
        v-loading="loading"
        width="500px">
        <ul class="step-group">
            <li class="item">
                <ul class="list-group" style="padding: 0">
                    <li class="item-text" style="width: 49%">
                        <span class="it-label">姓名：</span>
                        <span class="it-text">{{tableData.name}}</span>
                    </li>
                    <li class="item-text" style="width: 49%">
                        <span class="it-label">联系电话：</span>
                        <span class="it-text">{{tableData.mobile}}</span>
                    </li>
                    <li class="item-text" style="width: 49%">
                        <span class="it-label">邮箱：</span>
                        <span class="it-text">{{tableData.email}}</span>
                    </li>
                    <li class="item-text" style="width: 49%">
                        <span class="it-label">地址：</span>
                        <span class="it-text">{{tableData.address}}</span>
                    </li>
                    <li class="item-text" style="width: 99%">
                        <span class="it-label">其他备注：</span>
                        <span class="it-text" v-if="tableData.remark">{{tableData.remark}}</span>
                        <span class="it-text" v-else>暂无其他备注</span>
                    </li>
                </ul>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="onEdit(tableData.id)">编辑</el-button>
            <el-button  @click="onDelete(tableData.id)">删除</el-button>
        </span>
    </el-dialog>
</template>
<script>

    import store from 'store'
    import { server_base_url } from 'common/config'

    export default {
        props: ['linkmanDetail'],
        data () {
            return {
                title: '',
                tableData: {
                    file_arr: []
                },
                baseData: {},
                loading: false,
                visible: false,
                url: server_base_url,
                mytoken: store.state.user_info.token
            }
        },

        watch: {
            linkmanDetail (val) {
                this.visible = val.visible
                this.baseData = val
                this.getTableData(val.code)
            }
        },
        methods: {

            handleClose (done) {
//
            },
            //获取详情
            getTableData (code) {
                this.$fetch.api_linkman.linkmanLook(code)
                    .then(({
                               data
                           }) => {
                        this.tableData = data
                    })
            },

            onEdit (code) {
                this.$emit('onLinkmanEdit', code)
                this.visible = false
            },
            //删除
            onDelete (id) {
                this.$confirm('此操作将删除该联系人, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'is-plain'
                }).then(() => {
                    this.handleDelete(id)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //删除文件
            handleDelete (id) {
                this.$fetch.api_linkman.linkmanDel(
                    id,
                    {
                        pr_id: this.baseData.pr_id,
                        cl_id: this.baseData.cl_id
                    }
                )
                    .then(({
                               msg
                           }) => {
                            this.visible = false
                            this.$emit('refreshLinkmanDelete', {code:this.baseData.code})
                        }
                    )
            }

        }
    }
</script>


