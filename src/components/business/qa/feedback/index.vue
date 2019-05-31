<template>
    <el-dialog title='我要反馈' :visible.sync="dialogFormVisible" width="810px">
        <el-form ref="form" label-width="70px"  label-position="left"
                 :model="form" >
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="问题类别" prop="type">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option :value="1" label="功能性问题"></el-option>
                            <el-option :value="2" label="页面美观问题"></el-option>
                            <el-option :value="3" label="待挖掘的功能提议"></el-option>
                            <el-option :value="4" label="体验反馈"></el-option>
                            <el-option :value="5" label="其它"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="链接地址" prop="url">
                        <el-input v-model="form.url"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="优先级">
                        <el-radio-group v-model="form.degree">
                            <el-radio :label="2">重要</el-radio>
                            <el-radio :label="1">一般</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="问题描述">
                        <el-input type="textarea" v-model="form.description" :rows="4"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="text-right mg-top-20">
                <el-button type="primary"  @click="onSubmit('form')">立即提交</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>


<script>
    export default {
        props: ['addData'],
        data () {
            return {
                from_courthouse: false,
                dialogFormVisible:false,
                type: '',
                des: '',
                form: {
                    type: 1,
                    degree: 1,
                    description: '',
                    url: ''
                },
                rules: {}
            }
        },
        created () {
            this.courtHouseFeedback()
        },
        watch:{
            addData(val) {
                this.dialogFormVisible = val.visible
            },
        },
        methods: {

            //来自于法院法官的反馈
            courtHouseFeedback () {
                let type = parseInt(this.$route.query.type)
                if (!type) {return false}
                this.form.type = parseInt(this.$route.query.type)
                this.form.description = this.$route.query.des
                this.form.url = this.$route.query.url
                //mark来自于法院法官的反馈
                this.from_courthouse = true
            },
            onSubmit (formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$fetch.api_help.feedbackStore(this.form)

                        .then(({
                                   data
                               }) => {
                            this.dialogFormVisible = false
                        })
                })
            }

        }
    }
</script>

