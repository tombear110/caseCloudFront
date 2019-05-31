<template>
<div class="notify-faq" v-loading="loading" element-loading-text="拼命加载中">
    <div class="section">
        <div class="panel-heading">
            <span class="panel-title ">账号问题</span>
        </div>
        <div class="panel-body">
            <el-collapse v-model="active_1">
                <el-collapse-item :title="item.question" :name="index" v-for="(item,index) in list_1" :key="index">
                    <p class="item-text">{{item.answer}}</p>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
    <div class="section">
        <div class="panel-heading">
            <span class="panel-title ">系统操作</span>
        </div>
        <div class="panel-body">
            <el-collapse v-model="active_2">
                <el-collapse-item :title="item.question" :name="index" v-for="(item,index) in list_2" :key="index">
                    <p class="item-text">{{item.answer}}</p>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
    <div class="section">
        <div class="panel-heading">
            <span class="panel-title ">通用</span>
        </div>
        <div class="panel-body">
            <el-collapse v-model="active_3">
                <el-collapse-item :title="item.question" :name="index" v-for="(item,index) in list_3" :key="index">
                    <p class="item-text">{{item.answer}}</p>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</div>
</template>

<script>
import {
    page
} from 'components'

export default {
    data() {
        return {
            loading: false,
            active_1: [0],
            active_2: [0],
            active_3: [0],
            title: '',
            listData: '',
            user_input: '',
            noMessage: false,
            recordData: '',
            pageData: {
                currentPage: 1,
                total: 0,
                pageSize: 10
            },
            params: {},
            list_1: [],
            list_2: [],
            list_3: [],
            qa_show: 0,
            cur_id: ''

        }
    },
    created() {
        this.get_list()
    },
    methods: {
        //我要反馈
        submitQuestion() {
            this.$router.push({
                name: 'home_feedback_form'
            })
        },
        //qa-折叠
        qaCollapse(index, item) {
            console.log('index-qa', item)
            this.qa_show = index
            this.cur_id = item.id
        },
        //获取faq列表
        get_list() {
            this.loading = true
            this.$fetch.api_help.faqList()
                .then(({
                    data
                }) => {
                    for (let i in data) {
                        if (data[i].type === 1) {
                            this.list_1.push(data[i])
                        } else if (data[i].type === 2) {
                            this.list_2.push(data[i])
                        } else {
                            this.list_3.push(data[i])
                        }
                    }
                    this.loading = false
                })
                .catch(({
                    msg
                }) => {
                    this.$message.error(msg)
                    this.loading = false

                })
        },
        //若页面切换，no message提示变为false,避免无数据一直存在
        routeToggle() {
            this.noMessage = false
        },
        onSearch() {
            this.params.search = this.user_input
            this.get_list()
        },
        tagSearch(val) {
            this.params.tag = val
            this.get_list()
        }
    },
    components: {
        page
    }
}
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss" scoped>

</style>
