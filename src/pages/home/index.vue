<template>
  <div class="baseBox">
    <!-- 顶部导航 -->
    <div class="topArea" v-if="mode == 'PC'">
      <div class="logo" @click="turnHome">个人编程日记</div>
    </div>
    <div class="main" v-if="mode == 'PC'">
      <div class="sideMenu">
        <sideMenu @nodeClick="nodeClick" :menus="menus"></sideMenu>
      </div>
      <div class="infoArea">
        <router-view></router-view>
      </div>
    </div>
    <div class="sub" v-if="mode == 'mobile'&&!isFish&&!isSis">
      <div class="loginPage">
        <div class="title">
          DARKLOADER
        </div>
        <div class="account">
          <div class="name">账号：</div>
          <div class="value">
            <el-input v-model="account"></el-input>
          </div>
        </div>
        <div class="password">
          <div class="name">密码：</div>
          <div class="value">
            <el-input v-model="password"></el-input>
          </div>
        </div>
        <div class="btns">
          <div class="login" @click="handleLogin">登录</div>
        </div>
      </div>
    </div>
    <div class="page" v-if="mode == 'mobile'&&isFish">
      <router-view></router-view>
    </div>
    <div class="page" v-if="mode == 'mobile'&&isSis">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'
  import sideMenu from "@/components/sideMenu.vue";
  export default {
    data() {
      return {
        isFish: false,
        isSis: false,
        account: 'darkLoader',
        password: '',
        mode: 'PC',
        count: 0,
        set: 1,
        menus: [
          {
            name: "网站资源",
            url: "/collection",
            icon: "Collection",
          },
          {
            name: "哲理感悟",
            url: "/article",
            icon: "Tickets",
          },
          {
            name: "模块测试",
            url: "/games",
            icon: "SwitchFilled",
          },
        ],
      };
    },
    components: {
      sideMenu,
    },
    watch: {
      isFish(val) {
        if (val) {
          const ignoreArr = ['/phone']
          if (!ignoreArr.includes(this.$route.path)) {
            this.$router.push('/note')
          }
        }
      },
      isSis(val) {
        if (val) {
          this.$router.push('/phone')
        }
      }
    },
    mounted() {
      this.judgeMobile()
      window.onresize = () => {
        this.judgeMobile()
      }
    },
    methods: {
      handleLogin(type = 0) {
        if (this.password == 'superfish058') {
          if (type == 1) {
            return this.isFish = true
          }
          localStorage.setItem('password', this.password)
          this.isFish = true
          ElMessage({
            message: '登录成功',
            type: 'success',
          })
        } else if (this.password == '123456') {
          if (type == 1) {
            return this.isSis = true
          }
          localStorage.setItem('password', this.password)
          this.isSis = true
          ElMessage({
            message: '登录成功',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '登录失败',
            type: 'info',
          })
        }
      },
      readPassword() {
        let password = localStorage.getItem('password')
        if (password) {
          this.password = password
          this.handleLogin(1)
        }
        console.log(password);
      },
      judgeMobile() {
        let width = document.body.clientWidth
        if (width <= 800) {
          this.mode = 'mobile'
          this.readPassword()
        } else {
          this.mode = 'PC'
        }
      },
      turnHome() {
        this.$router.push("/");
      },
      nodeClick(val) {
        this.$router.push(val.url);
      },
    },
  };
</script>

<style scss scoped>
  .baseBox {
    color: #333;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .topArea {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px 2px 5px 0px rgba(188, 189, 192, 0.2);
      padding: 0 10px;

      .logo {
        font-size: 22px;
        font-weight: 700;
        cursor: pointer;
        user-select: none;
      }
    }

    .main {
      flex: 1;
      display: flex;

      .infoArea {
        flex: 1;
        box-sizing: border-box;
        padding: 20px;
      }
    }

    .sub {
      flex: 1;
      display: flex;
      box-sizing: border-box;
      padding: 20px;
      flex-direction: column;
      padding-top: 40px;

      .title {
        font-size: 28px;
        font-weight: 700;
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
      }

      .account,
      .password {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 30px;

      }

      .btns {
        display: flex;
        width: 100%;
        justify-content: center;


        .login {
          margin-top: 30px;
          width: 90%;
          height: 45px;
          border-radius: 4px;
          display: flex;
          background-color: #42b883;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          color: #fff;
          box-shadow: 0px 1px 5px 0px rgba(188, 189, 192, 0.2);


        }
      }
    }

    .page {
      width: 100%;
      height: 100%;
    }
  }
</style>