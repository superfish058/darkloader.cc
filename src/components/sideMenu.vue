<template>
  <div class="baseBox" :style="{ width: trueWidth + 'px' }">
    <div class="menuList">
      <div class="mItem" v-for="(item, index) in menus" :key="index" @click="nodeClick(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="hideBtn">
      <el-icon size="22"><ArrowLeft /></el-icon>
    </div>
    <div class="hideBtn" @click="hideSide()" v-if="!isHide">
      <el-icon size="22"><ArrowLeft /></el-icon>
    </div>
    <div class="hideBtn hideBtn2" @click="hideSide()" v-if="isHide">
      <el-icon size="22"><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHide: false, //是否隐藏
      trueWidth: 0, //菜单宽度
    };
  },
  props: {
    //默认宽度
    defWidth: {
      default: 250,
    },
    // 菜单列表
    menus: {
      default: () => [
        {
          name: "菜单1",
          url: "/",
        },
        {
          name: "菜单2",
          url: "/",
        },
        {
          name: "菜单3",
          url: "/",
        },
      ],
    },
  },
  mounted() {
    this.trueWidth = this.defWidth;
  },
  methods: {
    // 收起|展开侧边
    hideSide() {
      if (!this.trueWidth) {
        this.trueWidth = this.defWidth;
        this.isHide = false;
      } else {
        this.trueWidth = 0;
        setTimeout(() => {
          this.isHide = !this.isHide;
        }, 300);
      }
    },
    // 点击节点
    nodeClick(item){
      this.$emit('nodeClick',item)
    }
  },
};
</script>

<style scss scoped>
.baseBox {
  height: 100%;
  width: 100%;
  position: relative;
  box-shadow: 0 0 4px 0 #f6f6f7, 0 2px 4px 0 #f6f6f7;
  overflow: visible;
  transition: width 0.3s ease;
  .menuList {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-top: 20px;
    .mItem {
      width: 93%;
      display: flex;
      font-size: 15px;
      align-items: center;
      white-space: nowrap;
      height: 40px;
      border-radius: 4px;
      padding-left: 6px;
      box-sizing: border-box;
      cursor: pointer;
      user-select: none;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
  .hideBtn {
    cursor: pointer;
    z-index: 999;
    border-radius: 24px 0 0 24px;
    width: 20px;
    height: 96px;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: -2px 0 5px 0px rgba(188, 189, 192, 0.2);

    &:hover {
      box-shadow: -2px 0 5px 0px rgba(188, 189, 192, 0.3) !important;
      color: #409eff;
    }
  }

  .hideBtn2 {
    transform: translate(100%, -50%);
    border-radius: 0 24px 24px 0;
    box-shadow: 2px 0 5px 0px rgba(188, 189, 192, 0.2);
    &:hover {
      box-shadow: -2px 0 5px 0px rgba(188, 189, 192, 0.3) !important;
    }
  }
}
</style>
