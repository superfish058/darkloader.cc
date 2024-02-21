<template>
    <div class="schedule">
        <div class="baseTitle">
            日程
        </div>
        <div class="main">
            <!-- 日期列表 -->
            <div class="slider">
                <div class="left">
                    <div class="lItem" :class="{'active':curDate==yesterday}" @click="curDate=yesterday">
                        昨日
                    </div>
                    <div class="lItem" :class="{'active':curDate==today}" @click="curDate=today">
                        今日
                    </div>
                    <div class="lItem" :class="{'active':curDate==tomorrow}" @click="curDate=tomorrow">
                        明日
                    </div>
                </div>
                <div class="right" @click="showDate = true">
                    其他日期
                </div>
            </div>
            <!-- 当日计划 -->
            <div class="planList" @click="showPlanEdit=true">
                <div class="title">当日计划（{{dealPlanStatus()}}）</div>
                <div class="pItem" v-for="item,index in curSchedule?.plan" :key="index">
                    <div class="line">
                        <div class="left">
                            <div class="index">{{index+1}}.</div>
                            <div class="content">{{item.content}}</div>
                        </div>
                        <div class="right">
                            <div class="situation" v-if="item.situation">{{item.situation}}</div>
                        </div>
                    </div>
                    <div class="line2" v-if="item.comment">
                        <div class="comment">
                            {{item.comment}}
                        </div>
                    </div>
                </div>
                <div class="empty" v-if="!curSchedule.plan?.length">
                    点击添加记录
                </div>
            </div>
            <!-- 今日饮食 -->
            <div class="diet" @click="showDietEdit=true">
                <div class="title">今日饮食：</div>
                <div class="dItem">
                    <div class="name">体重-早：</div>
                    <div class="value">{{curSchedule?.diet?.weight1}}</div>
                </div>
                <div class="dItem">
                    <div class="name">体重-晚：</div>
                    <div class="value">{{curSchedule?.diet?.weight2}}</div>
                </div>
                <div class="dItem">
                    <div class="name">早餐：</div>
                    <div class="value">{{curSchedule?.diet?.food1}}</div>
                </div>
                <div class="dItem">
                    <div class="name">午餐：</div>
                    <div class="value">{{curSchedule?.diet?.food2}}</div>
                </div>
                <div class="dItem">
                    <div class="name">晚餐：</div>
                    <div class="value">{{curSchedule?.diet?.food3}}</div>
                </div>
                <div class="dItem">
                    <div class="name">其他摄入：</div>
                    <div class="value">{{curSchedule?.diet?.food4}}</div>
                </div>
            </div>
            <!-- 评价区 -->
            <div class="evaluationArea" @click="showEvaluationEdit=true">
                <div class="rate">
                    <div class="name">评分：</div>
                    <div class="value">
                        <el-rate v-model="curSchedule.rate" text-color="#ff9900" disabled show-score
                            score-template="{value}" />
                    </div>
                </div>
                <div class="evaluation">
                    <div class="name">评价：</div>
                    <div class="value">{{curSchedule.evaluation||'暂无评价'}}</div>
                </div>
                <div class="remark">
                    <div class="name">记录：</div>
                    <div class="value">{{curSchedule.remark||'没有留下记录'}}</div>
                </div>
            </div>
            <!-- 日期 -->
            <div class="date">
                当前日期：{{curSchedule.date}}
            </div>
        </div>
        <!-- 弹窗-其他日期 -->
        <topMask v-show="showDate" @maskOff="showDate = false" perWidth="90" height="130" blank>
            <div class="mask">
                <div class="line">
                    <div class="name">
                        日期：
                    </div>
                    <div class="value">
                        <el-date-picker v-model="curDate" type="date" placeholder="选择日期" :size="small"
                            value-format="YYYY-MM-DD" />
                    </div>
                </div>
            </div>
        </topMask>
        <!-- 弹窗-编辑计划 -->
        <topMask v-show="showPlanEdit" @maskOff="showPlanEdit = false" perWidth="90" height="auto" blank>
            <div class="planEditArea">
                <!-- 计划|评分 -->
                <div class="radio">
                    <el-radio-group v-model="planType" size="small">
                        <el-radio-button label="计划" />
                        <el-radio-button label="复核" />
                    </el-radio-group>
                </div>
                <!-- 计划 -->
                <div class="plans" v-show="planType=='计划'">
                    <div class="pItem" v-for="item,index in planList" :key="index" @click="planDelIndex=index">
                        <div class="index">{{index+1}}.</div>
                        <div class="input">
                            <input v-model="item.content"></input>
                        </div>
                    </div>
                    <div class="add">
                        <el-button size="small" color="#626aef" type="primary" @click="addPlan">添加计划</el-button>
                        <el-button size="small" @click="delPlan">删除计划</el-button>
                    </div>
                </div>
                <!-- 复核 -->
                <div class="check" v-show="planType=='复核'">
                    <div class="cItem" v-for="item,index in planList" :key="index" @click="planDelIndex=index">
                        <div class="line">
                            <div class="name">{{index+1}}.</div>
                            <div class="input">
                                {{item.content}}
                            </div>
                        </div>
                        <div class="line">
                            <div class="name">执行情况：</div>
                            <div class="input">
                                <el-select v-model="item.situation" class="m-2" placeholder="Select"
                                    style="width: 100%">
                                    <el-option v-for="item,index in situationTypes" :key="index" :label="item.name"
                                        :value="item.name" />
                                </el-select>
                            </div>
                        </div>
                        <div class="line">
                            <div class="name">评价：</div>
                            <div class="input textarea">
                                <el-input v-model="item.comment" autosize maxlength="150" placeholder="输入内容"
                                    show-word-limit type="textarea" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 按钮 -->
                <div class="btns">
                    <div class="confirm">
                        <el-button type="primary" @click="planConfirm" size="small">保存</el-button>
                    </div>
                    <div class="cancel">
                        <el-button size="small" @click="planCancel">取消</el-button>
                    </div>
                </div>
            </div>
        </topMask>
        <!-- 弹窗-编辑饮食 -->
        <topMask v-show="showDietEdit" @maskOff="showDietEdit = false" perWidth="90" height="400" blank>
            <div class="planEditArea dietEditArea">
                <!-- 标题 -->
                <div class="radio">饮食记录</div>
                <!-- 计划 -->
                <div class="plans">
                    <div class="pItem">
                        <div class="name">
                            体重-早：
                        </div>
                        <div class="input">
                            <input v-model="dietForm.weight1"></input>
                        </div>
                    </div>
                    <div class="pItem">
                        <div class="name">
                            体重-晚：
                        </div>
                        <div class="input">
                            <input v-model="dietForm.weight2"></input>
                        </div>
                    </div>
                    <div class="pItem">
                        <div class="name">
                            早餐：
                        </div>
                        <div class="input">
                            <input v-model="dietForm.food1"></input>
                        </div>
                    </div>
                    <div class="pItem">
                        <div class="name">
                            午餐：
                        </div>
                        <div class="input">
                            <input v-model="dietForm.food2"></input>
                        </div>
                    </div>
                    <div class="pItem">
                        <div class="name">
                            晚餐：
                        </div>
                        <div class="input">
                            <input v-model="dietForm.food3"></input>
                        </div>
                    </div>
                    <div class="pItem">
                        <div class="name">
                            其他摄入：
                        </div>
                        <div class="input">
                            <input v-model="dietForm.food4"></input>
                        </div>
                    </div>
                </div>
                <!-- 按钮 -->
                <div class="btns">
                    <div class="confirm">
                        <el-button type="primary" @click="dietConfirm" size="small">保存</el-button>
                    </div>
                    <div class="cancel">
                        <el-button size="small" @click="showDietEdit=false">取消</el-button>
                    </div>
                </div>
            </div>
        </topMask>
        <!-- 弹窗-编辑评价 -->
        <topMask v-show="showEvaluationEdit" @maskOff="showEvaluationEdit = false" perWidth="90" height="400" blank>
            <div class="planEditArea evaluationEditArea">
                <!-- 标题 -->
                <div class="radio">饮食记录</div>
                <!-- 计划 -->
                <div class="plans">
                    <div class="pItem">
                        <div class="name">
                            评分：
                        </div>
                        <div class="input fRight">
                            <el-rate v-model="evaluationForm.rate" text-color="#ff9900" show-score
                                score-template="{value}" />
                        </div>
                    </div>
                    <div class="pItem">
                        <div class="name">
                            评价：
                        </div>
                        <div class="input">
                            <el-input v-model="evaluationForm.evaluation" :autosize="{minRows: 2}" maxlength="150" placeholder="输入内容" show-word-limit
                                type="textarea" />
                        </div>
                    </div>
                    <div class="pItem">
                        <div class="name">
                            记录：
                        </div>
                        <div class="input">
                            <el-input v-model="evaluationForm.remark" :autosize="{minRows: 2}" maxlength="200" placeholder="输入内容" show-word-limit
                                type="textarea" />
                        </div>
                    </div>
                </div>
                <!-- 按钮 -->
                <div class="btns">
                    <div class="confirm">
                        <el-button type="primary" @click="evaluationConfirm" size="small">保存</el-button>
                    </div>
                    <div class="cancel">
                        <el-button size="small" @click="showEvaluationEdit=false">取消</el-button>
                    </div>
                </div>
            </div>
        </topMask>
    </div>
</template>

<script>
    import { ElMessage, ElMessageBox } from 'element-plus'
    import topMask from "@/components/topMask.vue";
    export default {
        data() {
            return {
                showDate: false,//其他日期-日期选择
                curSchedule: {
                    rate: 0,
                    plan: []
                },//当前日程
                curDate: '',//当前日期
                today: '',//今天
                yesterday: '',//昨天
                tomorrow: '',//明天
                showPlanEdit: false,//编辑计划-弹窗
                showDietEdit: false,//编辑饮食-弹窗
                showEvaluationEdit: false,//编辑评价-弹窗
                planType: '计划',//计划|评分
                planList: [],//计划列表
                planDelIndex: -1,//删除下标
                situationTypes: [
                    { name: '完美执行' },
                    { name: '不错' },
                    { name: '未完成' }
                ],
                dietForm: {},//饮食
                evaluationForm: {},//评价
            };
        },
        async mounted() {
            await this.setBase()
        },
        components: {
            topMask
        },
        watch: {
            curDate: {
                handler(val) {
                    this.getScheduleList()
                },
                deep: true
            },
            showPlanEdit: {
                handler(val) {
                    if (val) {
                        this.planType='计划'
                        this.planList = JSON.parse(JSON.stringify(this.curSchedule.plan))
                    }
                }
            },
            showDietEdit: {
                handler(val) {
                    if (val) {
                        this.dietForm = JSON.parse(JSON.stringify(this.curSchedule.diet))
                    }
                }
            },
            showEvaluationEdit: {
                handler(val) {
                    if (val) {
                        this.evaluationForm = JSON.parse(JSON.stringify({
                            rate:this.curSchedule.rate,
                            evaluation:this.curSchedule.evaluation,
                            remark:this.curSchedule.remark,
                        }))
                    }
                }
            },
        },
        methods: {
            // 确认修改评价
            async evaluationConfirm() {
                let detail = JSON.parse(JSON.stringify(this.curSchedule))
                detail['rate'] = this.evaluationForm['rate']
                detail['evaluation'] = this.evaluationForm['evaluation']
                detail['remark'] = this.evaluationForm['remark']
                let res = await this.axios.post('/api/schedule/update', detail)
                if (res.data.code == 200) {
                    this.$notify({
                        title: '操作成功',
                        message: '评价已更新',
                        type: 'success',
                        duration: 2000
                    });
                    this.curSchedule = res.data.data
                    this.curSchedule.date = this.curSchedule.date.slice(0, 10)
                    this.showEvaluationEdit = false
                }
            },
            // 确认修改饮食记录
            async dietConfirm() {
                let detail = JSON.parse(JSON.stringify(this.curSchedule))
                detail['diet'] = this.dietForm
                let res = await this.axios.post('/api/schedule/update', detail)
                if (res.data.code == 200) {
                    this.$notify({
                        title: '操作成功',
                        message: '饮食记录已更新',
                        type: 'success',
                        duration: 2000
                    });
                    this.curSchedule = res.data.data
                    this.curSchedule.date = this.curSchedule.date.slice(0, 10)
                    this.showDietEdit = false
                }
            },
            // 取消添加计划
            planCancel() {
                this.showPlanEdit = false
            },
            // 确认添加计划
            async planConfirm() {
                let detail = JSON.parse(JSON.stringify(this.curSchedule))
                detail['plan'] = this.planList
                let res = await this.axios.post('/api/schedule/update', detail)
                if (res.data.code == 200) {
                    this.$notify({
                        title: '操作成功',
                        message: '计划进度已更新',
                        type: 'success',
                        duration: 2000
                    });
                    this.curSchedule = res.data.data
                    this.curSchedule.date = this.curSchedule.date.slice(0, 10)
                    this.showPlanEdit = false
                }
            },
            // 添加计划
            addPlan() {
                this.planList.push({
                    content: '',
                    situation: '',
                    comment: '',
                })
            },
            // 删除计划
            delPlan() {
                if (this.planDelIndex == -1) {
                    return ElMessage({
                        message: '请选择删除计划',
                        type: 'warning',
                    })
                }
                ElMessageBox.confirm(
                    '确认删除第' + (this.planDelIndex + 1) + '项计划-' + this.planList[this.planDelIndex].content.slice(0, 8),
                    '提示',
                    {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }
                ).then(async () => {
                    this.planList.splice(this.planDelIndex, 1)
                    this.planDelIndex = -1
                })
            },
            // 计划进度
            dealPlanStatus() {
                let plan = this.curSchedule?.plan
                let statusIndex = 0
                let statusArr = ['未复核', '复核中', '已复核']
                if (plan?.length) {
                    let total = plan.length
                    let done = 0
                    plan.forEach(item => {
                        if (item.situation) {
                            done++
                        }
                    })
                    if (done == total) {
                        statusIndex = 2
                    } else {
                        statusIndex = 1
                    }
                }
                return statusArr[statusIndex]
            },
            // 基础数据
            setBase() {
                // 日期获取
                let today = new Date()
                let yesterday = new Date(today)
                yesterday.setDate(today.getDate() - 1)
                let tomorrow = new Date(today)
                tomorrow.setDate(today.getDate() + 1)
                this.today = this.formatDate(today)
                this.yesterday = this.formatDate(yesterday)
                this.tomorrow = this.formatDate(tomorrow)
                this.curDate = this.today
            },
            // 格式化日期为 "yyyy-MM-dd"
            formatDate(date) {
                let dd = String(date.getDate()).padStart(2, '0');
                let mm = String(date.getMonth() + 1).padStart(2, '0'); // 注意月份是从0开始的
                let yyyy = date.getFullYear();
                return `${yyyy}-${mm}-${dd}`;
            },
            // 获取日程
            getScheduleList() {
                this.axios.get('/api/schedule/list?date=' + this.curDate).then(async res => {
                    if (!res.data.data.length) {
                        let curSchedule = {
                            "diet": {
                                "weight1": "",
                                "weight2": "",
                                "food1": "",
                                "food2": "",
                                "food3": "",
                                "food4": ""
                            },
                            "rate": 0,
                            "date": this.curDate,
                            "plan": [
                            ],
                            "evaluation": "",
                            "remark": ""
                        }
                        let res = await this.axios.post('/api/schedule/add', curSchedule)
                        if (res.data.code == 200) {
                            this.$notify({
                                title: '操作成功',
                                message: '当日无数据，已生成默认单据',
                                type: 'success',
                                duration: 2000
                            });
                            this.curSchedule = res.data.data
                            this.curSchedule.date = this.curSchedule.date.slice(0, 10)
                        }
                    } else {
                        this.curSchedule = res.data.data[0]
                    }
                })
            }
        },
    };
</script>

<style scss scoped>
    .schedule {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        font-size: 15px;

        .baseTitle {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 5px;
            font-size: 22px;
        }

        .main {
            flex: 1;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 5px 0;

            .slider {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                align-items: center;

                .left {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    .lItem {
                        box-sizing: border-box;
                        padding: 1px 5px 2px;
                        background-color: #fff;
                        border: 1px solid gray;
                        border-radius: 4px;
                    }

                    .active {
                        background-color: gray;
                        border-color: transparent;
                        color: #fff;
                    }
                }

                .right {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                }
            }

            .planList,
            .diet,
            .evaluationArea {
                border-radius: 4px;
                width: 98%;
                margin: 0 auto;
                border: 1px solid gray;
                box-sizing: border-box;
                padding: 5px;
                display: flex;
                flex-direction: column;
                min-height: 25%;
                max-height: 35%;
                overflow-y: auto;
                margin-bottom: 10px;

                .empty {
                    display: flex;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                }

                .title {
                    font-size: 15px;
                    font-weight: 700;
                }

                .pItem {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    margin-top: 2px;

                    .line {
                        display: flex;
                        margin-bottom: 2px;

                        .left {
                            flex: 1;
                            display: flex;
                            flex-wrap: wrap;
                        }

                        .right {
                            display: flex;

                            .situation {
                                font-size: 12px;
                                color: #fff;
                                background-color: #626aef;
                                box-sizing: border-box;
                                padding: 1px 3px 2px 2px;
                                border-radius: 2px;
                            }
                        }
                    }

                    .line2 {
                        display: flex;
                        color: #409eff;
                        font-size: 14px;
                    }
                }
            }

            .diet {
                flex-direction: row;
                flex-wrap: wrap;
                align-content: flex-start;
                min-height: 100px;
                box-sizing: border-box;
                padding-bottom: 10px;

                .title {
                    width: 100%;
                }

                .dItem {
                    width: 50%;
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                }
            }

            .evaluationArea {
                display: flex;
                flex-direction: column;
                min-height: 100px;
                gap: 5px;

                .rate {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .value {
                        display: flex;
                        align-items: center;
                    }
                }

                .evaluation,
                .remark {
                    display: flex;
                    flex-direction: column;

                    .value {
                        display: flex;
                        font-size: 14px;
                        color: #409eff;
                    }
                }
            }

            .date {
                font-size: 14px;
                display: flex;
                justify-content: flex-end;
                width: 98%;
                margin: 0 auto;
            }
        }

        .mask {
            box-sizing: border-box;
            padding-top: 30px;

            .line {
                display: flex;
                align-items: center;
            }
        }

        .planEditArea {
            display: flex;
            flex-direction: column;
            width: 90%;
            height: 100%;
            margin: 0 auto;
            position: relative;

            .btns {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                bottom: 25px;
                display: flex;
                justify-content: space-around;
            }

            .radio {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }

            .plans,
            .check {
                display: flex;
                flex-direction: column;
                height: 75%;
                overflow-y: auto;
                overflow-x: hidden;

                .pItem {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                    overflow: hidden;

                    .index {
                        margin-right: 7px;
                    }

                    .input {
                        flex: 1;
                        border-bottom: 1px solid gray;

                        input {
                            width: 100%;
                            border: none;
                            font-size: 15px;

                            &:focus-visible {
                                outline: none;
                            }
                        }
                    }

                }

                .add {
                    margin-top: 10px;
                }
            }

            .check {
                display: flex;
                flex-direction: column;
                font-size: 14px;
                box-sizing: border-box;
                padding-right: 3px;
                padding-bottom: 5px;

                .cItem {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 7px;

                    .line {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        margin-bottom: 5px;

                        .name {
                            margin-right: 2px;
                            height: 100%;
                            display: flex;
                            align-items: center;
                        }

                        .input {
                            flex: 1;
                            display: flex;
                        }

                        .textarea {
                            .el-textarea {
                                height: 100%;
                            }

                            :deep(.el-textarea__inner) {
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }

        .evaluationEditArea {
            .input {
                border: none !important
            }

            .fRight {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
</style>