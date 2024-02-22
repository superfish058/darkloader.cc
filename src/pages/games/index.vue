<template>
  <div class="baseBox">
    <!-- 标签 -->
    <div class="tabs">
      <div class="tItem" v-for="(item, index) in tabs" :key="index" @click="showModel(item)">
        <div class="left">
          <div class="img">
            <img src="@/static/home/logo.png" alt="" />
          </div>
        </div>
        <div class="right">
          <div class="name">{{ item.name }}</div>
          <div class="desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <!-- 遮罩 -->
    <topMask v-if="showMask" @maskOff="maskOff" width="650" height="600" blank>
      <div class="model">
        <component :is="curTab.model"></component>
      </div>
    </topMask> 
  </div>
</template>

<script>
import topMask from "@/components/topMask.vue";
import push from "./push.vue";
import move from "./move.vue";
import shoot from "./shoot.vue";
import drag from "./drag.vue";
import dance from "./dance.vue";
import choice from "./choice.vue";

export default {
  data() {
    return {
      tabs: [
        {
          name: "蓄力模拟",
          model: "push",
        },
        {
          name: "移动模拟",
          model: "move",
        },
        {
          name: "射击模拟",
          model: "shoot",
        },
        {
          name: "拖拽模拟",
          model: "drag",
        },
        {
          name: "街舞模拟",
          model: "dance",
        },
        {
          name: "抽奖模拟",
          model: "choice",
        },
      ], //标签
      curTab: null, //当前标签
      showMask: false, //遮罩开关
    };
  },
  components: {
    topMask,
    push,
    move,
    shoot,
    drag,
    dance,
    choice
  },
  mounted() {},
  methods: {
    // 展示模块
    showModel(item) {
      this.curTab = item;
      this.showMask = true;
    },
    maskOff(val) {
      console.log(val);
      this.showMask = false;
    },
  },
};
</script>

<style scss scoped>
.baseBox {
  height: 100%;
  width: 100%;

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .tItem {
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
        /* transform: translateY(-7px); */
        box-shadow: 0px 0px 20px -5px rgba(158, 158, 158, 0.35);

        .right {
          .name {
            color: #1db877;
          }
        }
      }
    }
  }

  .model {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0 20px 20px;
    width: 100%;
    height: 100%;
  }
}
</style>
