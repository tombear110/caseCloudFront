<template>
    <!--共享弹窗-->
    <el-dialog title="复制案件" :visible.sync="visible"  width="350px" @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" >
            <el-form-item label="复制数量" prop="copy_count">
                <el-input-number v-model="form.copy_count"  :min="1" :max="10" style="width: 100%"></el-input-number>
            </el-form-item>
        </el-form>
        <div  class="text-center">
            <el-button type="primary"  @click="onSubmit('form')">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>

    import store from 'store'

    export default {
        props: ['caseCopyData'],
        data () {
            return {
                rules:{
                    copy_count: [
                        { required: true, message: '必填项', trigger: 'blur' },
                    ],
                },
                form:{
                    copy_count:1,
                },
                type: '',
                popoverOptions: [
                    { text: '可以编辑', value: 1 },
                    { text: '不可编辑', value: 0 }
                ],
                tabList: [
                    { text: '已分享' },
                    { text: '团队成员' }
                ],
                loadingShare: false,
                visible: false,
                cid: '',
                teamData: [],
                sharedData: [],
                baseData: {},
                host: '',
                assit: '',
                follower: '',
            }
        },
        watch: {
            //获取列表传过来的共享数据
            caseCopyData (val) {

                this.visible = val.visible
                this.baseData = val
                console.log('val---casecopy',val)
            },

        },

        created () {

        },

        methods: {
            closeDialog () {

            },

            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {return false}

                    this.$fetch.api_case.copy(
                        {
                            case_code:this.baseData.case_code,
                            copy_count:this.form.copy_count,
                        }
                    )
                        .then(({ data }) => {
                            this.$emit('caseCopyRefresh', true)
                            this.loadingShare = false
                            this.visible = false
                        })
                        .catch(({ msg }) => {
                            this.loadingShare = false
                        })
                });
            },



        },
        components: {

        }
    }
</script>

<style lang="scss" type="text/scss" rel="stylesheet/scss">


</style>
