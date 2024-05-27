<template>
    <div class="baseBox">
        <!-- 信息填写/信息查询 -->
        <div class="switch">
            <switch-bar @change="changeBar" :items="['信息填写', '信息查询']" :fz="18" bold fontColor="#336DFD"></switch-bar>
        </div>
        <!-- 信息填写 -->
        <div class="sItem" v-show="cur==0">
            <div class="textArea">
                <el-input type="textarea" placeholder="请输入内容" v-model="copyValue">
                </el-input>
            </div>
            <div class="showArea">
                <div class="line">
                    <div class="name">姓名:</div>
                    <el-input type="text" placeholder="" v-model="copyPlus.name">
                    </el-input>
                </div>
                <div class="line">
                    <div class="name">手机:</div>
                    <el-input type="text" placeholder="" v-model="copyPlus.phone">
                    </el-input>
                </div>
                <div class="line">
                    <div class="name">地址:</div>
                    <el-input type="textarea" placeholder="" v-model="copyPlus.address">
                    </el-input>
                </div>
            </div>
            <div class="btns">
                <div class="confirm">
                    <el-button type="primary" @click="editSubmit">保存</el-button>
                </div>
                <div class="cancel">
                    <el-button @click="cancel">清空</el-button>
                </div>
            </div>
        </div>
        <div class="sItem" v-show="cur==1">
            <div class="searchBox">
                <div class="input">
                    <el-input placeholder="查询姓名" v-model="searchValue" class="input-with-select" clearable>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="find" style="background-color: #3376fd;">查询</el-button>
                </div>
            </div>
            <div class="infoBox">
                <div class="iItemBox" v-for="item,index in infoList" :key="index" @click="showDetail(item)">
                    <div class="close" @click.stop="delItem(item)" v-show="delMode">
                        <el-icon size="22">
                            <CircleClose />
                        </el-icon>
                    </div>
                    <div class="iItem">
                        <div class="name">姓名:</div>
                        <div class="value">{{item.name}}</div>
                    </div>
                    <div class="iItem">
                        <div class="name">手机:</div>
                        <div class="value">{{item.phone}}</div>
                    </div>
                </div>
            </div>
        </div>
        <topMask v-if="showMask" @maskOff="showMask = false" perWidth="90" height="270" blank>
            <div class="maskBox">
                <div class="title">
                    详情信息
                </div>
                <div class="line">
                    <div class="name">姓名:</div>
                    <el-input type="text" placeholder="" v-model="curItem.name">
                    </el-input>
                </div>
                <div class="line">
                    <div class="name">手机:</div>
                    <el-input type="text" placeholder="" v-model="curItem.phone">
                    </el-input>
                </div>
                <div class="line">
                    <div class="name">地址:</div>
                    <el-input type="textarea" placeholder="" v-model="curItem.address">
                    </el-input>
                </div>
                <div class="btns">
                    <div class="confirm">
                        <el-button type="primary" @click="saveItem">保存</el-button>
                    </div>
                    <div class="cancel">
                        <el-button @click="showMask = false">取消</el-button>
                    </div>
                </div>
            </div>
        </topMask>
    </div>
</template>

<script>
    import SwitchBar from "@/components/switchBar.vue";
    import topMask from "@/components/topMask.vue";
    import { ElMessage, ElMessageBox } from 'element-plus'
    export default {
        data() {
            return {
                delMode:false,//删除模式
                showMask: false,//遮罩
                cur: 0,
                copyValue: '',//复制内容
                copyPlus: {
                    name: '',
                    phone: '',
                    address: '',
                },//保存对象
                infoList: [],//信息列表
                searchValue: '',//查询姓名
                curItem: {}//当前对象

            };
        },
        components: {
            SwitchBar,
            topMask
        },
        watch: {
            cur(val) {
                if (val == 1) {
                    this.getList()
                }else{
                    this.delMode = false
                }
            },
            copyValue(val) {
                this.setPlus()
            }
        },
        mounted() {

        },
        methods: {
            // 删除
            async delItem(item){
                let res = await this.axios.post('/api/phone/delete', { id: item.id })
                if (res.data.code == 200) {
                    this.getList()
                    this.$notify({
                        title: '操作成功',
                        message: '网址删除成功',
                        type: 'success',
                        duration: 1000
                    });
                }
            },
            // 保存
            saveItem() {
                this.axios.post('/api/phone/update', this.curItem).then(res => {
                    if (res.data.code == 200) {
                        ElMessage({
                            message: '保存成功',
                            type: 'success',
                        })
                        this.showMask = false
                        this.getList()
                    }
                })
            },
            showDetail(item) {
                this.showMask = true
                this.curItem = JSON.parse(JSON.stringify(item))
            },
            // 查询
            find() {
                if (this.searchValue == '删除') {
                    return this.delMode = true
                }
                this.delMode = false
                this.axios.get('/api/phone/list', {
                    params: {
                        name: this.searchValue
                    }
                }).then(res => {
                    this.infoList = res.data.data
                })
            },
            // 获取列表
            getList() {
                this.axios.get('/api/phone/list').then(res => {
                    this.infoList = res.data.data
                })
            },
            // 清空
            cancel() {
                this.copyValue = ''
                this.copyPlus = {
                    name: '',
                    phone: '',
                    address: '',
                }
            },
            // 保存
            editSubmit() {
                let flag = 0
                if (!this.copyPlus.name || !this.copyPlus.phone || !this.copyPlus.address) {
                    ElMessageBox.confirm(
                        '信息未填写完整，确认继续',
                        {
                            confirmButtonText: '确认',
                            cancelButtonText: '取消',
                            type: 'warning',
                        }
                    ).then(
                        () => {
                            this.submit()
                        }
                    ).catch(() => {
                        console.log('取消操作');
                    })
                } else {
                    this.submit()
                }
            },
            // 保存
            submit() {
                this.axios.post('/api/phone/add', this.copyPlus).then(res => {
                    if (res.data.code == 200) {
                        ElMessage({
                            message: '添加成功',
                            type: 'success',
                            duration: 1000
                        })
                    }
                })
            },
            // 转化
            setPlus() {
                const str = this.copyValue

                // 使用正则表达式提取手机号码
                const phoneMatch = str.match(/\d{11}/);
                if (!phoneMatch) {
                    // this.$message.warning('没有匹配到手机号')
                } else {
                    const phone = phoneMatch[0];

                    // 计算手机号码在字符串中的起始位置
                    const phoneIndex = str.indexOf(phone);

                    // 分割字符串以获取姓名和地址
                    // 注意：这里假设姓名在手机号之前，地址在之后，且没有明确的分隔符
                    // 如果实际情况更复杂，可能需要调整策略
                    let name = "";
                    let address = "";
                    if (phoneIndex > 0) {
                        name = str.substring(0, phoneIndex).trim();
                    }
                    if (phoneIndex + phone.length < str.length) {
                        address = str.substring(phoneIndex + phone.length).trim();
                    }
                    this.copyPlus = { name, phone, address }
                    // if (name && phone && address) {
                    //     this.$message.success('提取成功')
                    // }
                }
            },
            //登录注册切换
            changeBar(e) {
                this.cur = e;
            },
        },
    };
</script>

<style scss scoped>
    .baseBox {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 10px;

        .maskBox {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 10px;

            .title {
                font-size: 18px;
                font-weight: 700;
                display: flex;
                justify-content: center;
                transform: translateY(-15px);
            }

            .btns {
                display: flex;
                justify-content: space-around;
                margin-top: 20px;
            }

            .line {
                display: flex;
                margin-top: 10px;

                .name {
                    white-space: nowrap;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;

                }
            }

        }

        .switch {
            width: 100%;
            font-size: 44upx;
            display: flex;
            padding: 0 20upx;
            box-sizing: border-box;
            font-weight: 500;
            line-height: 1.6;

            .left {
                margin-right: 40upx;
            }

            .active {
                color: #336dfd;
                position: relative;

                &::after {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    content: "";
                    height: 4upx;
                    width: 100%;
                    background-color: #336dfd;
                }
            }
        }

        .sItem {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding-top: 15px;
            box-sizing: border-box;
            gap: 10px;
            overflow-y: auto;

            .textArea {
                flex: 1;
                box-sizing: border-box;


                .el-textarea {
                    height: 100%;
                }

                ::v-deep .el-textarea__inner {
                    height: 100%;
                }

            }

            .showArea {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .line {
                    display: flex;

                    .name {
                        white-space: nowrap;
                        margin-right: 10px;
                        display: flex;
                        align-items: center;
                    }
                }
            }

            .btns {
                max-height: 100px;
                height: 15%;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }

            .searchBox {
                display: flex;
                align-items: center;
                gap: 10px;

                .input {
                    flex: 1;
                }
            }

            .infoBox {
                display: flex;
                flex-wrap: wrap;
                margin-top: 15px;

                .iItemBox {
                    width: calc(50% - 5px);
                    margin-right: 10px;
                    border: 1px solid gray;
                    box-sizing: border-box;
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                    border-radius: 2px;
                    gap: 5px;
                    margin-bottom: 10px;
                    position: relative;

                    .close {
                        position: absolute;
                        right: 5px;
                        top: 5px;
                    }

                    .iItem {
                        display: flex;
                        align-items: center;
                    }

                    &:nth-child(2n) {
                        margin-right: 0;
                    }
                }
            }

        }
    }
</style>