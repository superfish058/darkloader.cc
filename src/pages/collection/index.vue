<template>
  <div class="baseBox">
    <div class="lineArea" v-for="(item, index) in lineKeys" :key="index">
      <!-- 分类标题 -->
      <div class="lineTitle" @dblclick="addWeb(item)">{{ item }}</div>
      <!-- 网站 -->
      <div class="lineWebs">
        <div class="lItemPlus" v-for="(ite, indx) in myWebs[item]?.webs" :key="indx" @click="turnWebs(ite)">
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
      </div>
    </div>
    <topMask v-if="showMask" @maskClick="maskClick" width="450" height="500" :blank="false">
      <div class="maskBox">
        <div class="title">网站添加</div>
        <div class="form">
          <div class="fItem">
            <div class="name">分类：</div>
            <div class="value">
              <el-input type="text" v-model="form.category" disabled></el-input>
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
  </div>
</template>

<script>
  import topMask from "@/components/topMask.vue";
  export default {
    data() {
      return {
        lineKeys: [],
        myWebs: {},
        showMask: false,
        form: {
          url: "",
        },
      };
    },
    components: {
      topMask,
    },
    mounted() {
      this.getList()
    },
    methods: {
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
            this.lineKeys = Object.keys(this.myWebs);
          })
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
        let data = this.form
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
      },
      // 跳转网页
      turnWebs(item) {
        let url = item.url
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `http://${url}`;
        }
        window.open(url, "_blank");
      },
      // 添加网页
      addWeb(item) {
        this.form.category = item
        this.showMask = true;
      },
      maskClick(val) {
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
      }

      .lineWebs {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
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