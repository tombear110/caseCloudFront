<template>
    <!--翻页组件-->
    <div class="text-right" v-if="pageData.total>10"  style="padding: 10px" >
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
            :current-page="pageData.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageData.total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name:'pagination',
        props: ['pageData'],
        data() {
            return {

            }
        },
        created(){
        },
        methods: {
            //改变每页显示条数size
            handleSizeChange(val) {
                let curData = this.pageData
                curData.pageSize = val
                this.$emit('pageEvent',curData)
            },
            //当前页数
            handleCurrentPageChange(val) {
                let curData = this.pageData
                curData.currentPage = val
                this.$emit('pageEvent',curData)
            }

        },
        components: {

        }
    }
</script>
