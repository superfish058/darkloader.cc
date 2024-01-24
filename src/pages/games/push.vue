<template>
  <div class="baseBox">
    <div class="bar">
      <div class="outBox">
        <div class="innerBar" ref="innerBar">
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button @mousedown="mousedown" @mouseup="mouseup">点击</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pushTimer: null,//按压定时
        releaseTimer: null,//松开定时
        pushFlag: false,//按压中
      };
    },
    mounted() {

    },
    unmounted() {
      clearInterval(this.pushTimer)
      clearInterval(this.releaseTimer)
    },
    methods: {
      // 持续点击
      mousedown() {
        this.pushFlag = true
        this.pushTimer = setInterval(() => {
          this.pushing()
        }, 10)
      },
      // 松开
      mouseup() {
        this.pushFlag = false
        clearInterval(this.pushTimer)
        this.releaseTimer = setInterval(() => {
          this.release()
        }, 10)
      },
      // 按压事件
      pushing() {
        let curHeight = this.$refs.innerBar.style.height.slice(0, -2)
        if (curHeight < 300) {
          let speed = 1
          let factor = 0.01
          if (curHeight > 200) {
            factor = 0.008
          }
          this.$refs.innerBar.style.height = curHeight * 1 + speed * (1 + curHeight * factor) + 'px'
        }
      },
      // 松开事件
      release() {
        if (this.pushFlag) {
          clearInterval(this.releaseTimer)
        }
        let curHeight = this.$refs.innerBar.style.height.slice(0, -2) * 1
        if (curHeight <= 1) {
          clearInterval(this.releaseTimer)
          this.$refs.innerBar.style.height = 0
        } else {
          let speed = 1
          this.$refs.innerBar.style.height = curHeight * 1 - speed + 'px'
        }


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
    align-items: center;
    justify-content: center;

    .bar {
      width: 60px;
      height: 300px;
      border: 1px solid #666;
      border-radius: 4px;
      margin-bottom: 20px;
      position: relative;

      .innerBar {
        background-color: #42b883;
        width: 100%;
        height: 50px;
        position: absolute;
        bottom: 0;

      }
    }
  }
</style>