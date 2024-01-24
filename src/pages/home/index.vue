<template>
  <div class="baseBox">
    <!-- 顶部导航 -->
    <div class="topArea">
      <div class="logo" @click="turnHome">DARKLOADER</div>
    </div>
    <div class="main">
      <div class="sideMenu">
        <sideMenu @nodeClick="nodeClick" :menus="menus"></sideMenu>
      </div>
      <div class="infoArea">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import sideMenu from "@/components/sideMenu.vue";
export default {
  data() {
    return {
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
  mounted() {},
  methods: {
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
}
</style>
