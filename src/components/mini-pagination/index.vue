<template>
    <!--翻页组件-->
    <div class="text-right" v-if="pageData.total>20"  style="padding: 10px" >
        <el-pagination
            small
            layout="prev, pager, next"
            @current-change="handleCurrentPageChange"
            :current-page="pageData.currentPage"
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
