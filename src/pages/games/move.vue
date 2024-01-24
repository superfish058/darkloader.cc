<template>
  <div class="baseBox">
    <div class="map" ref="map">
      <div class="self" ref="self">
        我
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        count: 0,
        set: 1,
      };
    },
    created() {
      window.addEventListener('keydown', this.handleKeyDown);
    },
    unmounted() {
      window.removeEventListener('keydown', this.handleKeyDown);
    },
    mounted() {
    },
    methods: {
      handleKeyDown(event) {
        let x = this.$refs.self.offsetLeft
        let y = this.$refs.map.offsetHeight - (this.$refs.self.offsetTop + this.$refs.self.offsetHeight);
        let selfWidth = this.$refs.self.offsetWidth
        let selfHeight = this.$refs.self.offsetHeight
        let mapWidth = this.$refs.map.offsetWidth
        let mapHeight = this.$refs.map.offsetHeight

        let maxX = mapWidth - selfWidth
        let maxY = mapHeight - selfHeight
        let step = 10
        if (event.key === 'ArrowLeft') {
          if (x < step) {
            return
          }
          this.$refs.self.style.left = x - step + 'px'
        } else if (event.key === 'ArrowUp') {
          if (y > maxY-step) {
            return
          }
          this.$refs.self.style.bottom = y + step + 'px'
        } else if (event.key === 'ArrowRight') {
          if (x >= maxX-step) {
            return
          }
          this.$refs.self.style.left = x + step + 'px'
        } else if (event.key === 'ArrowDown') {
          if (y < step) {
            return
          }
          this.$refs.self.style.bottom = y - step + 'px'
        }

      }
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