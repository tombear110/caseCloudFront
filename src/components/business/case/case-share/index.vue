<template>
    <!--共享弹窗-->
    <el-dialog :visible.sync="visible" custom-class="case-share-dialog" width="500px" @close="closeDialog">
        <div slot="title">
            <el-input class="share-search" placeholder="输入邮箱、搜索姓名、添加成员" v-model="selfSearch">
                <i slot="prefix" class="el-input__icon el-icon-search cursor" @click="search(selfSearch)"></i>
            </el-input>
        </div>
        <div class="tab-component mg-left-20 mg-right-20" v-if="tabShow">
            <ul class="tab-list">
                <li
                    class="tab-item"
                    :class="{'tab-active':tabActive===index}"
                    @click="onTabClick(index)"
                    v-for="(item,index) in tabList"
                    :key="index">
                    {{item.text}}
                </li>
            </ul>
        </div>
        <ul class="share-list" v-loading="loadingShare">
            <li class="item" v-for="(item,index) in baseData" :key="index" v-if="baseData.length">
                <div>
                    <img v-if="item.img_path" class="avatar"
                         :src="item.img_path.substr(0,4) === 'http' ? item.img_path : `${img_url}${item.img_path}`"/>
                    <img v-else class="avatar" :src="userImg">
                    <span>{{item.real_name}}</span>
                </div>
                <div>{{item.email}}</div>
                <div class="item-right" v-if="host===item.id">主办</div>
                <div class="item-right" v-else-if="assit.indexOf(item.id)!==-1">协办</div>
                <div class="item-right" v-else-if="follower===item.id">跟进人</div>
                <div class="item-right" v-else>
                    <el-popover
                        v-if="item.share_id"
                        popper-class="case-share-popover"
                        placement="bottom"
                        width="100"
                        trigger="click">
                        <ul class="select-group">
                            <li class="select-item" v-for="(part,index1) in popoverOptions" @click="changeShareAuth(part.value,item.share_id)" :key="part.value">
                                {{part.text}}
                            </li>
                            <li class="select-item-delete" @click="onItemDelete(item)">删除</li>
                        </ul>
                        <div slot="reference" class="edit-btn">
                            <span v-if="item.share_auth===1">可以编辑</span>
                            <span v-else>不可编辑</span>
                            <i class="iconfont icon-jiantou-copy-copy ft-12"></i>
                        </div>
                    </el-popover>
                    <div class="add-btn" v-else @click="oneShare(item)">添加</div>
                </div>
            </li>
            <li class="item text-center" v-if="baseData.length===0">
                暂无数据
            </li>
        </ul>
        <div slot="footer" class="text-right" v-if="tabActive===0">
            <el-button type="primary" :disabled="baseData.length===0" @click="removeShare">解除所有共享</el-button>
        </div>
    </el-dialog>
</template>

<script>
import {
    img_url
} from 'common/config'
import userImg from 'assets/images/user.png'
import {
    throttle,
    debounce
} from 'common/lib/common'
let timer = null
export default {
    props: ['caseShareData'],
    data() {
        return {
            tabShow: true,
            img_url: img_url,
            userImg: userImg,
            type: '',
            popoverOptions: [{
                    text: '可以编辑',
                    value: 1
                },
                {
                    text: '不可编辑',
                    value: 0
                }
            ],
            tabList: [{
                    text: '已分享'
                },
                {
                    text: '团队成员'
                }
            ],
            selfSearch: '',
            loadingShare: false,
            tabActive: 0,
            visible: false,
            cid: '',
            teamData: [],
            sharedData: [],
            baseData: [],
            host: '',
            assit: '',
            follower: '',
        }
    },
    watch: {
        //获取列表传过来的共享数据
        caseShareData(val) {
            this.visible = true
            this.tabActive = 0
            if (val.follower) {
                //共享客户时
                this.follower = val.follower
            } else {
                //共享案件时
                //assit有可能为undefind,所以要给默认值
                this.assit = val.assit || ''
                this.host = val.host
            }
            this.cid = val.id
            this.type = val.type
            this.getBaseData(val.id, val.type)
        },
        //监听搜索输入框，若为空，展示默认数据
        selfSearch(val) {
            if (!val) {
                this.tabShow = true
                this.baseData = this.tabActive === 0 ? this.sharedData : this.teamData
            } else {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    this.tabShow = false
                    this.search(val)
                }, 500)
            }
        }
    },

    created() {},

    methods: {

        closeDialog() {
            this.tabShow = true
            this.selfSearch = ''
        },
        search(val) {
            //清空搜索栏
            this.baseData = []
            if (!val) {
                this.$message.warning('搜索条件不能为空')
                return false
            }
            this.loadingShare = true
            this.$fetch.api_case.shareSearch({
                    search: val
                })
                .then(({
                    data
                }) => {
                    //如果搜索到相应成员
                    if (data.id) {
                        this.baseData = []
                        data.share_auth = 0
                        this.baseData.push(data)
                    }
                    this.loadingShare = false
                })
                .catch(({
                    msg
                }) => {
                    this.loadingShare = false
                })

        },
        onTabClick(index) {
            this.tabActive = index
            this.baseData = []
            this.baseData = index === 0 ? this.sharedData : this.teamData
        },
        //获取共享数据
        getBaseData(id, type) {
            this.loadingShare = true
            this.teamData = []
            this.$fetch.api_case.shareEdit(
                    id, {
                        type: type
                    }
                )
                .then(({
                    data
                }) => {
                    this.baseData = data.shared_users
                    //移除已冻结的团队成员
                    for (let i = 0; i < data.myTeam.length; i++) {
                        if (data.myTeam[i].status === 1 || (data.myTeam[i].share_id && data.myTeam[i].status === 0))
                            this.teamData.push(data.myTeam[i])
                    }
                    this.sharedData = data.shared_users
                    this.loadingShare = false
                })
                .catch(({
                    msg
                }) => {
                    this.loadingShare = false
                })
        },
        //共享权限修改
        changeShareAuth(share_auth, share_id) {
            this.$fetch.api_case
                .sharePut(share_id, {
                    auth: share_auth
                })
                .then(({
                    msg
                }) => {
                    this.$message.success(msg)
                    //修改共享状态成功,将编辑权限更新
                    for (let i = 0; i < this.teamData.length; i++) {
                        if (this.teamData[i].share_id === share_id)
                            this.teamData[i].share_auth = share_auth
                    }
                    for (let i = 0; i < this.sharedData.length; i++) {
                        if (this.sharedData[i].share_id === share_id)
                            this.sharedData[i].share_auth = share_auth
                    }
                    for (let i = 0; i < this.baseData.length; i++) {
                        if (this.baseData[i].share_id === share_id)
                            this.baseData[i].share_auth = share_auth
                    }

                })
                .catch(({
                    msg
                }) => {
                    this.$message.warning(msg)
                })
        },
        //单个解除共享
        onItemDelete(val) {
            this.$fetch.api_case
                .shareDel(val.share_id)
                .then(({
                    msg
                }) => {
                    //删除单个共享成功后，将对应row的share_id重置为0
                    //baseData必须放到最后再改变状态，否则会动态响应更新，造成val.share_id变成0
                    for (let i = 0; i < this.teamData.length; i++) {
                        if (this.teamData[i].share_id === val.share_id)
                            this.teamData[i].share_id = 0
                    }
                    for (let i = 0; i < this.sharedData.length; i++) {
                        if (this.sharedData[i].share_id === val.share_id) {
                            this.sharedData.splice(i, 1)
                        }
                    }
                    for (let i = 0; i < this.baseData.length; i++) {
                        if (this.baseData[i].share_id === val.share_id)
                            this.baseData[i].share_id = 0
                    }
                })
        },
        //单个共享
        oneShare(val) {
            //默认设置为可编辑状态
            this.$fetch.api_case
                .shareStore({
                    cid: this.cid,
                    uid: val.id,
                    type: this.type,
                    auth: 1
                })
                .then(({
                    msg,
                    data
                }) => {
                    this.$message.success(msg)
                    //创建共享成功返回这条共享的share_id,将对应row里面的share_id从0更新到返回值
                    for (let i = 0; i < this.teamData.length; i++) {
                        if (this.teamData[i].id === val.id) {
                            this.teamData[i].share_id = data.share_id
                            this.teamData[i].share_auth = 1
                        }
                    }
                    for (let i = 0; i < this.baseData.length; i++) {
                        if (this.baseData[i].id === val.id) {
                            this.$set(this.baseData[i], 'share_id', data.share_id)
                            this.$set(this.baseData[i], 'share_auth', 1)
                            this.sharedData.push(this.baseData[i])
                        }
                    }
                })
        },
        //解除所有共享
        removeShare() {
            let cid = this.cid
            this.$fetch.api_case
                .shareDelAll(cid, {
                    type: 1
                })
                .then(({
                    msg
                }) => {
                    for (let i in this.teamData) {
                        this.$set(this.teamData[i], 'share_id', 0)
                        this.$set(this.teamData[i], 'share_auth', 0)
                    }
                    this.baseData = []
                    this.sharedData = []
                })
        }

    },
}
</script>

<style lang="scss">
.case-share-dialog {
    .share-search {
        width: 300px;

        .el-input__inner {
            border-radius: 16px;
        }
    }

    .avatar {
        display: inline-block;
        width: 22px;
        height: 22px;
        border-radius: 50%;
    }

    .el-dialog__header {
        border-bottom: none;
    }

    .el-dialog__body {
        padding: 0;
    }

    .share-list {
        min-height: 150px;
        max-height: 600px;
        overflow: auto;

        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 50px;
            padding: 0 20px;

            &:hover {
                background-color: #F4F4F4;
            }
        }

        .item-right {
            position: relative;

            .edit-btn {
                text-align: center;
                display: inline-block;
                width: 96px;
                height: 22px;
                line-height: 22px;
                border-radius: 4px;
                color: #ECB86C;
                border: 1px solid #ECB86C;
                cursor: pointer;
            }

            .add-btn {
                text-align: center;
                display: inline-block;
                width: 68px;
                height: 22px;
                line-height: 22px;
                border-radius: 4px;
                border: 1px solid #666;
                cursor: pointer;
                color: #666;
            }

        }
    }
}

.case-share-popover {
    padding: 0;

    .select-group {
        .select-item {
            padding: 6px 10px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #666;
            cursor: pointer;

            &:hover {
                background-color: #F5F5F5;
            }
        }

        .select-item-delete {
            margin: 0 10px;
            border-top: 1px solid #ccc;
            height: 30px;
            line-height: 30px;
            color: #FF5A5A;
            cursor: pointer;
        }
    }
}
</style>
