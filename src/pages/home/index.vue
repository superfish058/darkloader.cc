<template>
  <div class="baseBox">
    <!-- 顶部导航 -->
    <div class="topArea">
      <div class="logo">DARKLOADER</div>
    </div>
    <div class="main">
      <div class="sideMenu" >
        <sideMenu @nodeClick="nodeClick"></sideMenu>
      </div>
      <div class="infoArea"></div>
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
    };
  },
  components:{
    sideMenu
  },
  mounted() {},
  methods: {
    nodeClick(val){
      console.log(val);
    }
  },
};
</script>

<style scss scoped>
.baseBox {
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
    }
  }
  .main {
    flex: 1;
    display: flex;
    .infoArea {
      flex: 1;
    }
  }
}
</style>
