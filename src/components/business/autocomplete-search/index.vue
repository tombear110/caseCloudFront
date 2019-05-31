<template>
    <div>
        <el-autocomplete
            popper-class="autocomplete-group"
            v-model="value"
            
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            placeholder="请输入当事人名称进行搜索"
            style="width: 100%"
            @select="handleSelect">
            <template slot-scope="{ item }">
                <div class="item-top" v-if="item.id">
                    <el-button size="micro" type="ghost-link">{{item.c_type_pid_text}}</el-button>
                    <el-tooltip  effect="dark" :content="item.title" :disabled="item.title.length<15" placement="bottom-start">
                        <span class="title">{{item.title}}</span>
                    </el-tooltip>
                </div>
                <div class="item-bottom" v-if="item.id">
                    <span class="co-666">{{item.c_type_text}}</span>
                    <span class="co-999">主办：{{item.host_text}}</span>
                </div>
                <div class="item-bottom" v-if="!item.id">
                    <span class="co-666">暂无数据</span>
                    <!--<span class="co-999">主办：{{item.host_text}}</span>-->
                </div>
            </template>
        </el-autocomplete>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { SET_EDIT_DATA } from 'store/actions/type'
    import store from 'store'

    export default {
        props: ['searchOptions'],
        data () {
            return {
                baseOptions: [],
                value: ''

            }
        },
        created () {

        },

        watch: {
            searchOptions (val) {
                console.log('val',val)
                //获取到的所有待搜索的数据
                this.baseOptions = val
                //存储待搜索数据，避免从详情页返回列表页时，无可供搜索的数据源
                this.set_edit_data({
                    arr: val
                })
            }
        },
        computed: {
            //获取vuex中待搜索数据
            storeOptions () {
                const data = store.state.edit_data
                return data.arr ? data.arr : []
            }
        },
        methods: {
            ...mapActions({
                set_edit_data: SET_EDIT_DATA
            }),
            querySearch (queryString, cb) {
                this.$emit('searchData',queryString)
                //若数据源为空，则尝试从vuex中获取
                let baseOptions = this.baseOptions.length ? this.baseOptions : this.storeOptions
                let results = queryString ? baseOptions.filter(this.createFilter(queryString)) : baseOptions
                // 调用 callback 返回建议列表的数据
                console.log('results',results)
                cb(results)
            },
            createFilter (queryString) {
                return (item) => {
                    //避免item.title为null时报错
                    let search = item.title ? item.title : ''
                    return (search.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
                }
            },

            //搜索结果操作
            handleSelect (item) {
                this.$router.push({
                    name: 'case_detail',
                    params: {
                        code: item.code
                    }
                })
            },
            handleIconClick (ev) {
                console.log(ev)
            }
        }

    }
</script>
<style lang="scss" type="text/scss" rel="stylesheet/scss">

    .autocomplete-group {
        li {
            line-height: normal;
            padding: 10px;
            border-bottom: 1px solid #ccc;
            &:hover {
                background-color: #EEE;
            }
        }
        .item-top {
            display: flex;
            overflow: hidden;
            margin-bottom: 10px;
            .title {
                flex: 1;
                margin-left: 10px;
                font-weight: 600;
                color: #85AFC1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .item-bottom {
            display: flex;
            justify-content: space-between;
        }
    }
</style>
