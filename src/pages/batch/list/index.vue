<template>
    <div class="case-list " @keyup.enter="handleIconClick">
       <!--<div class="heading">-->
           <!--<div class="" v-show="false">-->
               <!--<el-input-->
                   <!--placeholder="请输入客户或项目名称"-->
                   <!---->
                   <!--class="search-input"-->
                   <!--style="width: 100%"-->
                   <!--v-model="searchParams">-->
                   <!--<i slot="prefix" class="el-input__icon el-icon-search cursor" @click="handleIconClick"></i>-->
               <!--</el-input>-->
           <!--</div>-->
       <!--</div>-->
        <el-table
            :data="table_data"
            size="small-short"
            stripe
            fit
            v-loading="loading"
            element-loading-text="拼命加载中"
            style="width: 100%;padding-top: 10px">
            <el-table-column
                label="批次号"
                width="180">
                <template  slot-scope="scope">
                    <div class="text-info cursor"
                         @click="goBatch(scope.row)">
                        {{scope.row.batch}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="客户名称">
                <template  slot-scope="scope">
                    <div class="text-info cursor"
                         @click="goClient(scope.row)">
                        {{scope.row.client.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="项目名称">
                <template  slot-scope="scope">
                    <div class="text-info cursor"
                         @click="goProject(scope.row)">
                        {{scope.row.project.pr_name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="project.host_text"
                width="180"
                label="主办律师">
            </el-table-column>
            <el-table-column
                prop="created_at_text"
                width="180"
                label="导入时间">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        components: {

        },
        data() {
            return {
                loading:false,
                table_data:[],
                base_table_data:[],
                searchParams:'',
            };
        },
        created() {
            this.getList()
        },
        computed:{

        },
        methods: {
            //前往对应批次
            goBatch(data){
//                console.log('data---pc',data)
//                return false
                this.$router.push({name: 'batchMy',query: {client_id:data.client_id,
                    project_id:data.project_id,batch:data.batch,batch_id:data.id
                }})
            },
            //前往客户
            goClient(row){
                this.$router.push({
                    name: 'customer_detail',
                    params:{code:row.client.code}
                })
            },
            //前往项目
            goProject(row){
                this.$router.push({
                    name: "project_detail",
                    params:{code:row.project.pr_code},
                });
            },
            //获取列表数据
            getList() {
                this.loading = true
                this.$fetch.api_batch.batchList()
                    .then(({
                              data
                           }) => {
                        this.table_data = data
                        this.base_table_data = data
                        this.loading = false

                    })
                    .catch(({
                                msg
                            }) => {
                        this.$message.warning(msg)
                        this.loading = false

                    })
            },
            //使用indexof找出出字符串中某个字符的位置
            stringFunc(keyWord,list){
                //字符串方法indexOf
                let len = list.length;
                let arr = [];
                for(let i=0;i<len;i++){
                    //如果字符串中不包含目标字符会返回-1
                    if(list[i].indexOf(keyWord)>=0){
                        arr.push(list[i]);
                    }
                }
                return arr;
            },
            //搜索
            handleIconClick(){
                let temp_cus = []
                let temp_pro = []
                let keyword = this.searchParams
//                console.log('keyword',keyword)
                if (!keyword){
                    this.table_data = this.base_table_data
                    return false
                }
                //从列表数据分别取出客户，项目两个数组,传入两个参数--项目名或者客户名，批次.
                for (let i in this.base_table_data){
                    temp_cus.push(this.base_table_data[i].client.name)
                    temp_pro.push(this.base_table_data[i].project.pr_name)
                }
                //列表中是否含有用户输入的项目名或者客户名，有则返回对应的数组
                let match_cus = this.stringFunc(keyword,temp_cus)
                let match_pro = this.stringFunc(keyword,temp_pro)
                //定义一个过渡数组，用来分别接受用项目名/客户名搜索的结果
                let result_table_data = []
                //根据客户名搜索的结果返回对应table_data中的一条数据
                if (match_cus.length>0){
                    for (let i in this.base_table_data){
                        for (let j in match_cus){
                            if (this.base_table_data[i].client.name === match_cus[j]){
                                result_table_data.push(this.base_table_data[i])
                                break;
                            }
                        }
                    }
                }

                //根据项目名名搜索的结果返回对应table_data中的一条数据
                if (match_pro.length>0){
                    for (let i in this.base_table_data){
                        for (let j in match_pro){
                            if (this.base_table_data[i].project.pr_name === match_pro[j]){
                                result_table_data.push(this.base_table_data[i])
                                break;
                            }
                        }
                    }
                }
                this.table_data = result_table_data

            },
        }
    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>


</style>
