<template>
  <div class="baseBox">
    <div class="lineArea" v-for="(item, index) in lineKeys" :key="index">
      <!-- 分类标题 -->
      <div class="lineTitle" @dblclick="turnEdit">{{ item.name }}
        <div class="tag" v-show="editMode">
          <el-icon size="20" @click="removeTag(item)">
            <Remove />
          </el-icon>
        </div>
      </div>
      <!-- 网站 -->
      <div class="lineWebs">
        <div class="lItemPlus" v-for="(ite, indx) in myWebs[item.name]?.webs" :key="indx" @click="turnWebs(ite)">
          <div class="close" @click.stop="delItem(ite)" v-show="editMode">
            <el-icon size="22">
              <CircleClose />
            </el-icon>
          </div>
          <div class="left">
            <div class="img">
              <img :src="ite.img" alt="" />
            </div>
          </div>
          <div class="right">
            <div class="name">{{ ite.name }}</div>
            <div class="desc">{{ ite.desc }}</div>
          </div>
        </div>
        <div class="lItemPlus" @click="addWeb(item)" v-show="editMode">
          <div class="left">
            <div class="img">
              <img src="@/static/home/logo.png" alt="" />
            </div>
          </div>
          <div class="right">
            <div class="name">添加网址</div>
            <div class="desc">Add Web</div>
          </div>
        </div>
      </div>
    </div>
    <div class="lineArea lineAreaPlus" v-if="!lineKeys.length||editMode">
      <div class="lineTitle" @click="addCate">
        <el-icon size="18">
          <CirclePlus />
        </el-icon>
        <div class="text">添加分类</div>
      </div>
    </div>
    <!-- 添加分类 -->
    <topMask v-if="showMaskCate" @maskOff="showMaskCate = false" width="350" height="200">
      <div class="maskBox">
        <div class="title">分类添加</div>
        <div class="form">
          <div class="fItem">
            <div class="name">分类名：</div>
            <div class="value">
              <el-input type="text" v-model="cateName"></el-input>
            </div>
          </div>
        </div>
        <div class="btns">
          <div class="confirm">
            <el-button type="primary" @click="confirmCate">确定</el-button>
          </div>
          <div class="cancel">
            <el-button @click="showMaskCate = false">取消</el-button>
          </div>
        </div>
      </div>
    </topMask>
    <!-- 添加网站 -->
    <topMask v-if="showMask" @maskOff="maskOff" width="450" height="500">
      <div class="maskBox">
        <div class="title">{{maskTitle}}</div>
        <div class="form">
          <div class="fItem">
            <div class="name">分类：</div>
            <div class="value">
              <el-input type="text" v-model="form.category" :disabled="!editMode||maskTitle.includes('添加')"></el-input>
            </div>
          </div>
          <div class="fItem">
            <div class="name">标题：</div>
            <div class="value">
              <el-input type="text" v-model="form.name"></el-input>
            </div>
          </div>
          <div class="fItem">
            <div class="name">网址：</div>
            <div class="value">
              <el-input type="text" v-model="form.url" @change="setIcon"></el-input>
            </div>
          </div>
          <div class="fItem">
            <div class="name">简介：</div>
            <div class="value">
              <el-input type="text" v-model="form.desc"></el-input>
            </div>
          </div>
          <div class="fItem">
            <div class="name">图标：</div>
            <div class="value">
              <el-input type="text" v-model="form.img"></el-input>
            </div>
          </div>
          <div class="fItem center">
            <div class="name">预览：</div>
            <div class="value">
              <div class="lItemPlus">
                <div class="left">
                  <div class="img">
                    <img :src="form.img" alt="" v-if="form.img" />
                  </div>
                </div>
                <div class="right">
                  <div class="name">{{ form.name||'我是标题' }}</div>
                  <div class="desc">{{form.desc||'我是简介' }}</div>
                </div>
              </div>
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
    <!-- 备案号 -->
    <div class="mustNumber">
      <a href="https://beian.miit.gov.cn/" target="_blank">备案号：浙ICP备2024060975号</a>
    </div>
  </div>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import topMask from "@/components/topMask.vue";
  export default {
    data() {
      return {
        lineKeys: [],
        myWebs: {},
        maskTitle: '网站添加',//添加网站标题
        editMode: false,//编辑模式
        showMask: false,//网站添加遮罩
        showMaskCate: false,//分类添加遮罩
        cateName: '',//添加分类名
        form: {
          url: "",
        },
      };
    },
    components: {
      topMask,
    },
    async mounted() {
      await this.getCates()
      this.getList()
    },
    methods: {
      // 删除标签
      removeTag(item) {
        console.log(item)
        ElMessageBox.confirm(
          '确认删除标签-' + item.name,
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            let res = await this.axios.post('/api/collection/CateDelete', { id: item.id })
            if (res.data.code == 200) {
              this.getCates()
              this.$notify({
                title: '操作成功',
                message: '标签删除成功',
                type: 'success',
                duration: 2000
              });
            }
          })
          .catch(() => {
            console.log('取消操作');
          })
      },
      // 删除网站
      delItem(item) {
        ElMessageBox.confirm(
          '确认删除选中网站-' + item.name,
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(async () => {
            let res = await this.axios.post('/api/collection/delete', { id: item.id })
            if (res.data.code == 200) {
              this.getList()
              this.$notify({
                title: '操作成功',
                message: '网址删除成功',
                type: 'success',
                duration: 2000
              });
            }
          })
          .catch(() => {
            console.log('取消操作');
          })
      },
      // 编辑模式
      turnEdit() {
        this.editMode = !this.editMode
        if (this.editMode) {
          this.$notify({
            title: '网页编辑模式开启',
            message: 'Web page editing mode is on',
            type: 'success',
            duration: 2000
          });
        } else {
          this.$notify({
            title: '网页编辑模式关闭',
            message: 'Web page editing mode is off',
            type: 'info',
            duration: 2000
          });
        }
      },
      // 确认添加分类
      async confirmCate() {
        if (!this.cateName) {
          return ElMessage({
            message: '请填写分类名',
            type: 'warning',
          })
        }
        let data = {
          name: this.cateName
        }
        let res = await this.axios.post('/api/collection/cateAdd', data)
        if (res.data.code == 200) {
          this.showMaskCate = false
          this.$notify({
            title: '操作成功',
            message: '分类添加成功',
            type: 'success',
            duration: 2000
          });
          this.getCates()
        }
      },
      // 添加分类
      addCate() {
        this.showMaskCate = true
      },
      // 获取分类
      getCates() {
        this.axios.get('/api/collection/cateList').then(res => {
          this.lineKeys = res.data.data
        })
      },
      // 获取网站
      getList() {
        this.axios.get('/api/collection/list').then(res => {
          let list = res.data.data
          let categories = list.map(item => item.category).filter(it => it)
          categories.forEach(item => {
            let webs = []
            list.forEach(it => {
              if (it.category == item) {
                webs.push(it)
              }
            })
            this.myWebs[item] = {
              id: item,
              webs
            }
          })
          console.log(this.myWebs);
        })
      },
      // 默认带出图标 
      setIcon() {
        this.form.img = this.getIconUrl(this.form.url)
      },
      // 获取图标
      getIconUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `http://${url}`;
        }
        let icoUrl = `${url}/favicon.ico`
        console.log(icoUrl);
        return icoUrl
      },
      // 确认添加
      confirm() {
        if (!this.form.name || !this.form.url) {
          return ElMessage({
            message: '请填写完整表单',
            type: 'warning',
          })
        }
        let data = this.form
        if (this.editMode && this.maskTitle.includes('修改')) {
          this.axios.post('/api/collection/update', data).then(res => {
            if (res.data.code == 200) {
              this.showMask = false
              this.$notify({
                title: '操作成功',
                message: '网址添加成功',
                type: 'success',
                duration: 2000
              });
              this.getList()
            }
          })
        } else {
          this.axios.post('/api/collection/add', data).then(res => {
            if (res.data.code == 200) {
              this.showMask = false
              this.$notify({
                title: '操作成功',
                message: '网址添加成功',
                type: 'success',
                duration: 2000
              });
              this.getList()
            }
          })
        }

      },
      // 跳转网页
      turnWebs(item) {
        if (this.editMode) {
          this.form = item
          this.showMask = true
          this.maskTitle = '网站修改'
          return
        }
        let url = item.url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `http://${url}`;
        }
        window.open(url, "_blank");
      },
      // 添加网页
      addWeb(item) {
        this.form = {}
        this.form.category = item.name
        this.showMask = true;
        this.maskTitle = '网站添加'
      },
      // 取消
      cancel() {
        this.showMask = false;
      },
      // 遮罩点击，此处无效
      maskOff(val) {
        this.showMask = false;
      },
    },
  };
</script>

<style scss scoped>
  .baseBox {
    height: 100%;
    width: 100%;
    color: #333;
    position: relative;
    padding-bottom: 50px;
    box-sizing: border-box;

    .mustNumber{
      position: absolute;
      bottom: 0;
      display: flex;
      width: 100%;
      justify-content: center;
      transform: translateY(10px);
      a{
        font-size: 12px;
        text-decoration:none;
        color: gray;
        &:hover{
          color: #00a4ff;
        }
      }

    }

    .center {
      justify-content: center;
    }

    .lItemPlus {
      user-select: none;
      min-width: 200px;
      width: 12%;
      height: 70px;
      display: flex;
      background: #fff;
      cursor: pointer;
      border-width: 0;
      box-shadow: 0px 0px 20px -5px rgba(158, 158, 158, 0.25);
      transition: transform 0.3s;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 5px;
      padding-left: 10px;
      position: relative;

      .close {
        position: absolute;
        right: 5px;
        top: 5px;

        &:hover {
          color: #ed6d7c;
        }
      }

      .left {
        width: 30%;
        height: 100%;
        display: flex;
        align-items: center;

        .img {
          height: 70%;
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }

      .right {
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;

        .name {
          color: #333;
          font-size: 16px;
          font-weight: 700;
        }

        .desc {
          color: #999;
          font-size: 14px;
        }
      }

      &:hover {
        transform: translateY(-7px);
        box-shadow: 0px 0px 20px -5px rgba(158, 158, 158, 0.35);

        .right {
          .name {
            color: #409eff;
          }
        }
      }
    }

    .lineArea {
      width: 100%;
      margin-bottom: 20px;

      .lineTitle {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 25px;
        user-select: none;
        cursor: default;
        display: flex;
        align-items: center;
        gap: 5px;

        .tag {
          display: flex;
          align-items: center;
          height: 100%;
        }

        svg {
          cursor: pointer;

          &:hover {
            color: #409eff;
          }

        }

      }

      .lineWebs {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
      }
    }

    .lineAreaPlus {
      .lineTitle {
        display: flex;
        align-items: center;
        gap: 2px;
        cursor: pointer;

        &:hover {
          svg {
            color: #409eff;
          }

        }
      }
    }

    .maskBox {
      display: flex;
      flex-direction: column;
      position: relative;
      align-items: center;
      height: 100%;
      width: 100%;

      .title {
        font-size: 20px;
        font-weight: 700;
        margin: 0 auto;
      }

      .form {
        margin-top: 40px;
        display: flex;
        flex-direction: column;

        .fItem {
          display: flex;
          margin-bottom: 20px;
          align-items: center;

          .lItemPlus {
            transform: translateY(0px);
          }
        }
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
    }
  }
</style>