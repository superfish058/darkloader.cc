<template>
  <div class="outBox">
    <!-- 导航内容 -->
    <div class="baseBox" v-show="!editMode&&curTab.name=='笔记'">
      <div class="top">
        <div class="left">{{curTab.name}}</div>
        <div class="center">
          {{date}}
        </div>
        <div class="right">
          <el-icon size="18" @click="showMenu">
            <MoreFilled />
          </el-icon>
        </div>
      </div>
      <!-- 笔记 -->
      <div class="bMain">
        <!-- 分类集合 -->
        <div class="slider">
          <div class="sItem" @click="selectSlider({name:'全部'})" :class="{active:curSlider?.name=='全部'}">全部</div>
          <div class="sItem" v-for="item,index in sliders" :key="index" @click="selectSlider(item)"
            :class="{active:curSlider?.name==item.name}">
            {{item.name}}
            <div class="cancel" v-show="showAdd" @click="delClass(item)">
              <el-icon size="20">
                <Remove />
              </el-icon>
            </div>
          </div>
          <!-- 添加分类 -->
          <div class="addBtn" v-show="showAdd" @click="addClass">
            <div class="left">
              <el-icon size="18">
                <CirclePlus />
              </el-icon>
            </div>
            <div class="right">
              添加分类
            </div>
          </div>
        </div>
        <!-- 笔记列表 -->
        <div class="bBox">
          <div class="bxItem" v-for="item,index in noteList" :key="item?.id" @click="showNoteDetail(item)">
            <div class="del" v-show="showAdd">
              <el-icon size="20" @click.stop="delNoteItem(item)">
                <Remove />
              </el-icon>
            </div>
            <div class="type">
              {{item.type?.slice(0,1)}}
            </div>
            <div class="other">
              <div class="title">
                {{item.title}}
              </div>
              <div class="desc">
                {{setDesc(item.content)}}
              </div>
            </div>
          </div>
        </div>
        <div class="addBtnBlue" @click="addNote">
          <div class="icon">+</div>
        </div>
      </div>
    </div>
    <!-- 编辑页 -->
    <div class="baseBox" v-show="editMode&&curTab.name=='笔记'">
      <div class="top">
        <div class="left" @click="editMode=false">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </div>
        <div class="center">
          <div class="text">{{editPage.hasOwnProperty('id')?'编辑笔记':'添加笔记'}}</div>
        </div>
        <div class="right">
          &nbsp;
        </div>
      </div>
      <div class="bMain">
        <!-- 所属分类 -->
        <div class="line top20">
          <div class="name">分类:</div>
          <div class="value">
            <el-select v-model="editPage.type" class="m-2" placeholder="Select" style="width: 100%">
              <el-option v-for="item,index in [{name:'全部'},...sliders]" :key="index" :label="item.name"
                :value="item.name" />
            </el-select>
          </div>
        </div>
        <!-- 标题 -->
        <div class="line">
          <div class="name">标题:</div>
          <div class="value">
            <el-input v-model="editPage.title" placeholder="输入标题"></el-input>
          </div>
        </div>
        <!-- 内容 -->
        <div class="line rest">
          <div class="name">内容:</div>
          <div class="value">
            <el-input v-model="editPage.content" maxlength="1500" placeholder="输入内容" show-word-limit type="textarea" />
          </div>
          <div class="createTime" v-if="editPage?.createdAt">
            <div class="time">创建日期：</div>
            <div class="timeValue">{{editPage?.createdAt?.slice(0,10)}}</div>
          </div>
          <div class="createTime" v-else>
            <div class="time">更新日期：</div>
            <div class="timeValue">{{editPage?.updatedAt?.slice(0,10)}}</div>
          </div>
          <div class="btns">
            <div class="confirm">
              <el-button type="primary" @click="editSubmit">确定</el-button>
            </div>
            <div class="cancel">
              <el-button @click="editMode = false">取消</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 笔记-更多 -->
    <div class="menus" v-show="menuShow" @click="menuShow=!menuShow&&curTab.name=='笔记'">
      <div class="main">
        <!-- 编辑分类 -->
        <div class="mItem" @click.stop="showAdd=!showAdd">
          <div class="text">编辑分类：</div>
          <div class="icon">
            <el-icon v-show="!showAdd" size="24">
              <TurnOff />
            </el-icon>
            <el-icon v-show="showAdd" size="24">
              <Open />
            </el-icon>
          </div>
          <div class="text text2">
            {{showAdd?'on':'off'}}
          </div>
        </div>
      </div>
    </div>
    <!-- 分类添加-->
    <topMask v-if="showSliderAdd&&curTab.name=='笔记'" @maskOff="showSliderAdd = false" perWidth="90" height="230" blank>
      <div class="maskBox">
        <div class="title">
          添加分类
        </div>
        <div class="main">
          <div class="mItem">
            <div class="name">
              名称：
            </div>
            <div class="value">
              <el-input v-model="sliderName"></el-input>
            </div>
          </div>
          <div class="mItem">
            <div class="name">
              类型：
            </div>
            <div class="value">
              <el-select v-model="sliderType" class="m-2" placeholder="Select" style="width: 100%">
                <el-option v-for="item,index in sliderTypeOptions" :key="index" :label="item.name"
                  :value="item.value" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="btns">
          <div class="confirm">
            <el-button type="primary" @click="confirm">确定</el-button>
          </div>
          <div class="cancel">
            <el-button @click="cancel">取消</el-button>
          </div>
        </div>
      </div>
    </topMask>
    <!-- 其他 -->
    <div class="baseBox" v-show="curTab.name!=='笔记'">
      <!-- 日程 -->
      <div class="other" v-if="curTab.name=='日程'">
        <schedule></schedule>
      </div>
    </div>
    <!-- 底部导航 -->
    <div class="tabBar">
      <div class="tItem" v-for="item,index in tabBars" :key="index" @click="selectTab(item)">
        <div class="icon">
          <el-icon size="18" :style="{color:curTab.name==item.name?'#409eff':''}">
            <component :is="item.icon || 'Star'"></component>
          </el-icon>
        </div>
        {{item.name}}
      </div>
    </div>

  </div>

</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import topMask from "@/components/topMask.vue";
  import schedule from "./schedule.vue";
  export default {
    data() {
      return {
        editPage: {
          type: '全部',
          title: ''
        },//编辑内容
        editMode: false,//编辑模式
        noteList: [],//笔记列表
        curTab: {
          name: '笔记'
        },
        tabBars: [
          {
            name: '笔记',
            icon: 'Promotion'
          },
          {
            name: '日程',
            icon: 'Histogram'
          }
        ],
        curSlider: {
          name: '全部'
        },//当前选中
        sliderTypeOptions: [
          {
            name: '普通',
            value: '1'
          },
          {
            name: '其他',
            value: '2'
          },
        ],
        sliderName: '',//添加分类名
        sliderType: '',//添加分类类型
        showSliderAdd: false,//分类添加弹窗
        menuShow: false,//弹出菜单
        showAdd: false,//分类标签添加按钮
        date: '',//日期
        sliders: [
          {
            name: '全部',
          }
        ],//标签
      };
    },
    mounted() {
      this.judgeFish()
      this.setDate()
      this.getSliders()
    },
    watch: {
      curSlider: {
        handler(val) {
          this.getNoteList(val?.name)
        },
        deep: true,
        immediate: true
      }
    },
    components: {
      topMask,
      schedule
    },
    methods: {
      //判断本人
      judgeFish(){
        if(localStorage.getItem('password')!=='superfish058'){
          // 清空password
          localStorage.removeItem('password')
          this.$router.push('/home')
        }
      },
      // 删除笔记
      delNoteItem(item) {
        ElMessageBox.confirm(
          '确认删除当前笔记-' + item.title,
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            let res = await this.axios.post('/api/note/delete', { id: item.id })
            if (res.data.code == 200) {
              this.getNoteList()
              this.$notify({
                title: '操作成功',
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
            }
          })
      },
      // 笔记详情
      showNoteDetail(item) {
        this.editMode = true
        this.editPage = item
      },
      // 笔记简述
      setDesc(text) {
        if (text.length > 6) {
          return text.slice(0, 6) + '...'
        }
        return text
      },
      // 笔记上传
      editSubmit() {
        if (!this.editPage.content) {
          return ElMessage({
            message: '请填写内容',
            type: 'warning',
          })
        }
        // 修改
        if (this.editPage.hasOwnProperty('id')) {
          this.axios.post('/api/note/update', this.editPage).then(res => {
            if (res.data.code == 200) {
              this.getNoteList(this.curSlider.name)
              ElMessage({
                message: '修改成功',
                type: 'success',
              })
              this.editMode = false
            }
          })
        } else {
          // 添加
          this.axios.post('/api/note/add', this.editPage).then(res => {
            if (res.data.code == 200) {
              this.getNoteList(this.curSlider.name)
              ElMessage({
                message: '添加成功',
                type: 'success',
              })
              this.editMode = false
            }
          })
        }
      },
      //获取笔记列表
      getNoteList(name) {
        let namePro = name == '全部' ? '' : name
        this.axios.get('/api/note/list?type=' + namePro).then(res => {
          this.noteList = res.data.data
        })
      },
      // 添加笔记
      addNote() {
        this.editPage = {}
        this.editPage.type = this.curSlider.name

        this.editMode = true
      },
      // 选择底部导航
      selectTab(item) {
        this.curTab = item
        this.editMode = false
      },
      // 选中分类
      selectSlider(item) {
        this.curSlider = item
      },
      // 删除分类
      delClass(item) {
        ElMessageBox.confirm(
          '确认删除选中分类-' + item.name,
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            let res = await this.axios.post('/api/noteSlider/delete', { id: item.id })
            if (res.data.code == 200) {
              this.getSliders()
              this.$notify({
                title: '操作成功',
                message: '删除成功',
                type: 'success',
                duration: 1000
              });
            }
          })
      },
      // 确认添加
      confirm() {
        if (!this.sliderName || !this.sliderType) {
          return ElMessage({
            message: '请填写完整项',
            type: 'warning',
          })
        }
        this.axios.post('/api/noteSlider/add', {
          name: this.sliderName,
          type: this.sliderType
        }).then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.getSliders()
            ElMessage({
              message: '添加成功',
              type: 'success',
            })
            this.showSliderAdd = false
          }
        })
      },
      // 取消添加
      cancel() {
        console.log(2);
      },
      // 添加分类
      addClass() {
        this.sliderName = ''
        this.sliderType = ''

        this.showSliderAdd = true
      },
      // 展示菜单
      showMenu() {
        this.menuShow = !this.menuShow
      },
      async getSliders() {
        let res = await this.axios.get('/api/noteSlider/list')
        this.sliders = res.data.data
        if (!this.sliders.length) {
          this.showAdd = true
        }
      },
      setDate() {
        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let day = now.getDate()
        let weekIndex = now.getDay()
        let weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        this.date = year + '-' + month + '-' + day + ' ' + weekArr[weekIndex]
      },
    },
  };
</script>

<style scss scoped>
  .outBox {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .menus {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      z-index: 9;
      background-color: rgba(0, 0, 0, 0.2);

      .main {
        background-color: #fff;
        padding: 10px 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        box-sizing: border-box;
        border-top: 1px solid #333;
      }


      .mItem {
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px dashed #333;
        padding-bottom: 10px;

        .text,
        .icon {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 700;
        }

        .icon {
          margin: 0 5px;
          width: 30px;
        }

        .text2 {
          transform: translateY(-2px);
        }
      }
    }

    .maskBox {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
      }

      .btns {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        bottom: 25px;
        display: flex;
        justify-content: space-around;
      }

      .main {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 0 15px;
        margin-top: 10px;

        .mItem {
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .value {
            flex: 1;
          }
        }
      }
    }
  }

  .baseBox {
    height: calc(100% - 50px);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 10px;

    .other {
      flex: 1;
    }

    .top {
      display: flex;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      margin-top: 10px;
      align-items: center;

      .left {
        font-size: 22px;
      }

      .right {
        font-size: 16px;
      }

      .center {
        .text {
          font-size: 18px;
          font-weight: 700;
        }
      }
    }

    .bMain {
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
      height: calc(100% - 50px);
      overflow: hidden;

      .addBtnBlue {
        position: absolute;
        right: 15px;
        bottom: 10%;
        background-color: #409eff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 34px;
        font-size: 700;
        color: #fff;

        .icon {
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      }

      .slider {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        margin-top: 15px;



        .sItem,
        .addBtn {
          border-radius: 100px;
          padding: 5px;
          box-sizing: border-box;
          border: 1px solid #555;
          display: flex;
          align-items: center;
          margin-right: 7px;
          position: relative;
          margin-bottom: 10px;

          .cancel {
            border-radius: 50%;
            background-color: #fff;
            height: 100%;
            display: flex;
            align-items: center;
            margin-left: 5px;
          }

          .left,
          .right {
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-right: 5px;
          }
        }

        .sItem {
          border-radius: 4px;
        }

        .active {
          background-color: #409eff;
          color: #fff;
          border-color: transparent;

          .cancel {
            background-color: transparent;
          }
        }
      }

      .top20 {
        margin-top: 20px;
      }

      .line {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        width: 100%;

        .value {
          flex: 1;
        }
      }

      .rest {
        flex: 1;
        display: flex;
        flex-direction: column;

        .name {
          width: 100%;
        }

        .value {
          width: 100%;
          flex: 1;

          .el-textarea {
            height: 100%;
          }

          :deep(.el-textarea__inner) {
            height: 100%;
          }
        }

        .btns {
          height: 25px;
          transform: translateY(10px);
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-around;
        }
      }

      .createTime {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        box-sizing: border-box;
        padding-right: 1px;
        font-size: 13px;
      }
    }

    .bBox {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-content: flex-start;
      overflow: auto;

      .bxItem {
        width: 48%;
        margin-right: 4%;
        margin-bottom: 10px;
        height: 60px;
        display: flex;
        border-width: 0;
        box-shadow: 0 0 20px -5px #9e9e9e40;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 5px 5px 5px 10px;
        gap: 5px;
        align-items: center;
        position: relative;

        .del {
          position: absolute;
          right: 2px;
          top: 2px;
        }

        .type {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          height: 80%;
          aspect-ratio: 1;
          background-color: #409eff;
          color: #fff;
          box-sizing: border-box;
          padding-bottom: 2px;
        }

        .other {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .title {
            font-size: 15px;
            font-weight: 700;
          }

          .desc {
            font-size: 14px;
          }
        }

        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }



  }

  .tabBar {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid rgba(64, 158, 255, 0.5);
    box-sizing: border-box;

    .tItem {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      justify-content: center;
    }

  }
</style>