<template>
  <div class="baseBox">
    <div class="map" ref="map">
      <div class="self" ref="self">我</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keys: {}, //按钮对象
    };
  },
  created() {
    window.addEventListener("keydown", this.handleKeyDown);
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  mounted() {},
  methods: {
    handleKeyDown(event) {
      let x = this.$refs.self.offsetLeft;
      let y = this.$refs.map.offsetHeight - (this.$refs.self.offsetTop + this.$refs.self.offsetHeight);
      let selfWidth = this.$refs.self.offsetWidth;
      let selfHeight = this.$refs.self.offsetHeight;
      let mapWidth = this.$refs.map.offsetWidth;
      let mapHeight = this.$refs.map.offsetHeight;

      let maxX = mapWidth - selfWidth;
      let maxY = mapHeight - selfHeight;
      let step = 10;
      let keys = this.keys
      keys[event.key] = true;
      // 检查是否同时按下"w"和"d"
      if (keys["w"] && keys["d"]) {
        console.log("同时按下了w和d键");
        
      }

      if (event.key === "ArrowLeft" || event.key === "a") {
        if (x < step) {
          return;
        }
        this.$refs.self.style.left = x - step + "px";
      } else if (event.key === "ArrowUp" || event.key === "w") {
        if (y > maxY - step) {
          return;
        }
        this.$refs.self.style.bottom = y + step + "px";
      } else if (event.key === "ArrowRight" || event.key === "d") {
        if (x >= maxX - step) {
          return;
        }
        this.$refs.self.style.left = x + step + "px";
      } else if (event.key === "ArrowDown" || event.key === "s") {
        if (y < step) {
          return;
        }
        this.$refs.self.style.bottom = y - step + "px";
      }
    },
  },
};
</script>

<style scss scoped>
.baseBox {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  padding-bottom: 10px;

  .map {
    width: 100%;
    height: 100%;
    border: 1px solid #666;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;

    .self {
      position: absolute;
      bottom: 0;
      left: 0;
      font-weight: 700;
      font-size: 20px;
    }
  }
}
</style>
