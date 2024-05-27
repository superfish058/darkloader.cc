<template>
  <div class="SwitchBar">
    <div class="switchBar" v-if="items.length" :style="{ fontSize: fz + 'px', fontWeight: bold ? 700 : 500 }">
      <div class="sItemPlus" v-for="(item, index) in items" :key="index" :style="{ marginRight: fz + 'px' }" @click="change(index)">
        <div class="count" v-if="index == 2&&count2">{{ count2 }}</div>
        <div class="count" v-if="index == 3&&count3">{{ count3 }}</div>
        <div class="text"> {{ item }}</div>
      </div>
      <div class="linePlus" :style="{ backgroundColor: lineColor }"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cur: 0,
    };
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    }, //选项数组
    fz: {
      type: Number,
      default: 15,
    }, //字体大小 px
    bold: {
      type: Boolean,
      default: false,
    }, //是否加粗
    fontColor: {
      type: String,
      default: "#333",
    }, //选中字体颜色
    lineColor: {
      type: String,
      default: "#185ee0",
    }, //选中横线颜色
    default: {
      type: Number,
      default: 0,
    }, //默认选中下标
    count2: {
      type: Number,
      default: 0,
    },
    count3: {
      type: Number,
      default: 0,
    },
    trans1:{
      type: Number,
      default: 0,
    }
  },
  mounted() {
    let cur = document.querySelectorAll(".sItemPlus")[this.default];
    let line = document.querySelectorAll(".linePlus")[0];
    //当前选中颜色设置
    cur.style.color = this.fontColor;
    //当前选中长度设置-按字体大小和长度
    let numCount = this.judgeNum(this.items[this.default]);
    line.style.width = this.items[this.default].length * this.fz - (numCount / 2) * this.fz + "px";
    //响应和移动
    this.change(this.default);
  },
  watch: {
    default(val) {
      let cur = document.querySelectorAll(".sItemPlus")[this.default];
      let line = document.querySelectorAll(".linePlus")[0];
      //当前选中颜色设置
      cur.style.color = this.fontColor;
      //当前选中长度设置-按字体大小和长度
      let numCount = this.judgeNum(this.items[this.default]);
      line.style.width = this.items[this.default].length * this.fz - (numCount / 2.2) * this.fz + "px";
      //响应和移动
      this.change(this.default);
    },
  },
  methods: {
    //统计数字和字母
    judgeNum(str) {
      var regex = /[0-9a-zA-Z]/g; // 正则表达式匹配数字和字母
      var matches = str.match(regex); // 使用match方法找到所有匹配项
      if (matches) {
        return matches.length;
      } else {
        return 0;
      }
    },
    change(type) {
      let distanceArr = [0];
      let items = document.querySelectorAll(".sItemPlus");
      for (let i = 0; i < items.length; i++) {
        items[i].style.color = "#333";
        let numCount = this.judgeNum(this.items[i]);
        let trans = 0
        if(type==1){
          trans = this.trans1
        }
        distanceArr.push(this.fz * this.items[i].length - (numCount / 2.2) * this.fz + trans +distanceArr[i]);
      }

      let select = document.querySelectorAll(".sItemPlus")[type];
      let line = document.querySelectorAll(".linePlus")[0];
      select.style.color = this.fontColor;
      let numCount = this.judgeNum(this.items[type]);
      line.style.width = this.items[type].length * this.fz - (numCount / 2.2) * this.fz + "px";
      line.style.left = distanceArr[type] + this.fz * type + "px";
      this.$emit("change", type);
    },
  },
};
</script>

<style lang="scss">
.SwitchBar {
  .switchBar {
    padding-top: 2px;
    position: relative;
    display: flex;
    font-size: 15px;
    font-weight: 700;
    overflow: hidden;
    overflow-x: auto;

    .sItemPlus {
      line-height: 1.7;
      margin-right: 6px;
      display: flex;
      white-space: nowrap;
      position: relative;
      .count {
        position: absolute;
        top: -5px;
        right: -9px;
        z-index: 2;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background-color: #eb5959;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-weight: 500;
        font-size: 11px;
        box-sizing: border-box;
        letter-spacing: 0.05em;
      }
    }

    .linePlus {
      border-radius: 1px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 2px;
      background-color: #185ee0;
      transition: all 0.2s ease-out;
    }

    .switch0 {
      left: 0;
    }

    .switch1 {
      left: 73px;
    }
  }
}
</style>
