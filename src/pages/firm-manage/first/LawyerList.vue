<template>

    <div class="case-list">
        <panel-heading :panel-data="panelData"></panel-heading>
        <!--表格-->
        <el-table :data="tableData"  v-loading="loading" header-row-class-name="case_table"
                  element-loading-text="拼命加载中" fit style="width: 100%">
            <el-table-column prop="lawfirm" label="所属律所" sortable>
            </el-table-column>
            <el-table-column prop="real_name" label="姓名" sortable>
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="mobile" label="联系电话"></el-table-column>
        </el-table>
    </div>
</template>

<script>

    import { page, panelHeading } from 'components'
    import store from 'store'
    export default {
        data () {
            return {
                panelData: {
                    title: '律师列表'
                },

                pageData: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10
                },
                loading:false,
            }
        },
        created () {
            this.getList()
        },
        methods: {

            //获取表格数据
            getList () {
                this.tableData = []
                this.loading = true
                let firmId = store.state.user_info.user.firm_id
                this.$fetch.api_firm.accountList(
                    {
                        firm_id: firmId,
                        account_type: 1
                    }
                )
                    .then(({ data }) => {
                        this.loading = false
                        this.tableData = data
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },


        },
        components: {
            page,
            panelHeading
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
