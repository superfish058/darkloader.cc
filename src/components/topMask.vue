<template>
  <div class="baseBox" @click.self="maskClick">
    <div class="dialog" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="cancel" @click="cancel">
        <el-icon :size="22">
          <Close />
        </el-icon>
      </div>
      <div class="main">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showMaskTrue: true,
      };
    },
    props: {
      // 展示遮罩
      showMask: {
        default: false,
      },
      width: {
        default: 800,
      },
      height: {
        default: 600,
      },
      blank: {
        default: false,
      },//点击背景关闭
    },
    mounted() {
      this.showMaskTrue = this.showMask;
    },
    methods: {
      maskClick() {
        if (this.blank != false || this.blank === '') {
          this.$emit("maskOff", true);
        }
      },
      cancel() {
        this.$emit("maskOff", true);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "@/theme.scss";

  .baseBox {
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;

    .dialog {
      width: 65%;
      height: 70%;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      position: relative;
      border-radius: 4px;

      .cancel {
        position: absolute;
        z-index: 1000;
        right: 12px;
        top: 12px;
        cursor: pointer;

        &:hover {
          color: $blue;
        }
      }

      .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: 20px;
      }
    }
  }
</style>