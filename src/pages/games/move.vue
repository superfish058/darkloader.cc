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
      keys: [], //按钮对象
    };
  },
  created() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  },
  unmounted() {
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
      let keys = this.keys;
      // 如果按下的键不在数组中，则将其添加到数组中
      if (!keys.includes(event.key)) {
        keys.push(event.key);
      }
      if (keys.includes(" ")) {
        step = 20;
      }
      // 检查是否同时按下"w"和"d"
      if ((keys.includes("w") && keys.includes("d")) || (keys.includes("ArrowUp") && keys.includes("ArrowRight"))) {
        if (y > maxY - step || x >= maxX - step) {
          return;
        }
        this.$refs.self.style.bottom = y + step + "px";
        this.$refs.self.style.left = x + step + "px";
      } else if ((keys.includes("w") && keys.includes("a")) || (keys.includes("ArrowUp") && keys.includes("ArrowLeft"))) {
        if (y > maxY - step || x < step) {
          return;
        }
        this.$refs.self.style.bottom = y + step + "px";
        this.$refs.self.style.left = x - step + "px";
      } else if ((keys.includes("s") && keys.includes("a")) || (keys.includes("ArrowDown") && keys.includes("ArrowLeft"))) {
        if (y < step || x < step) {
          return;
        }
        this.$refs.self.style.bottom = y - step + "px";
        this.$refs.self.style.left = x - step + "px";
      } else if ((keys.includes("s") && keys.includes("d")) || (keys.includes("ArrowDown") && keys.includes("ArrowRight"))) {
        if (y < step || x >= maxX - step) {
          return;
        }
        this.$refs.self.style.bottom = y - step + "px";
        this.$refs.self.style.left = x + step + "px";
      } else if (keys.includes("ArrowLeft") || keys.includes("a")) {
        if (x < step) {
          return;
        }
        this.$refs.self.style.left = x - step + "px";
      } else if (keys.includes("ArrowUp") || keys.includes("w")) {
        if (y > maxY - step) {
          return;
        }
        this.$refs.self.style.bottom = y + step + "px";
      } else if (keys.includes("ArrowRight") || keys.includes("d")) {
        if (x >= maxX - step) {
          return;
        }
        this.$refs.self.style.left = x + step + "px";
      } else if (keys.includes("ArrowDown") || keys.includes("s")) {
        if (y < step) {
          return;
        }
        this.$refs.self.style.bottom = y - step + "px";
      }
    },
    handleKeyUp(event) {
      // 找到按键在数组中的索引，并将其从数组中删除
      let keys = this.keys;
      let index = keys.indexOf(event.key);

      if (index > -1) {
        keys.splice(index, 1);
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
