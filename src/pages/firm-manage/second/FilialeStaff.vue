<template>
    <div class="">
        <!--表格-->
        <el-table :data="tableData"  style="width: 100%;margin-top: 20px" v-loading="loading"
                  element-loading-text="拼命加载中">
            <el-table-column prop="real_name" label="姓名"></el-table-column>
            <el-table-column prop="email" label="邮箱账号"></el-table-column>
            <el-table-column prop="mobile" label="联系电话"></el-table-column>
            <el-table-column prop="created_at" label="加入时间"></el-table-column>
        </el-table>
    </div>

</template>
<script>


    export default {

        data () {
            return {

               loading:false,
                tableData:[],
            }
        },
        created () {
            this.getList()
        },

        methods: {
            //获取行政人员列表
            getList () {
                this.loading = true
                let firmId = this.$route.query.firm_id
                this.$fetch.api_firm.accountList(
                    {
                        firm_id: firmId,
                        account_type: 2
                    }
                )
                    .then(({ data }) => {
                        this.loading = false
                        this.tableData =  data
                    })
                    .catch(msg => {
                        this.loading = false
                    })
            },
        }

    }

</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
