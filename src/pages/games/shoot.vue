<template>
  <div class="baseBox">
    <div class="time" :style="{ color: count % 2 == 0 ? '#333' : '#444' }">{{ time }}</div>
    <div class="map" ref="map">
      <div class="cannon" ref="cannon" :style="cannon.style">大炮</div>
      <div class="bullet" v-for="(item, index) in bullets" :style="item?.style" :key="index" v-show="item.visible">子弹</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timers: [],
      bullets: [],
      keys: [],
      cannon: {
        style: {
          left: "20px",
        },
      },
      moveInterval: null, //移动监听
      time: "",
      minutes: 0,
      seconds: 0,
      count: 0,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keypress", this.handleKeyPress);
    window.addEventListener("keyup", this.handleKeyUp);
    this.timerCounter = setInterval(() => {
      this.count++;
      if (this.count == 10) {
        this.count = 0;
        // 每秒递增1
        this.seconds++;
      }

      // 每60秒增加1分钟
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
      }

      // 格式化时间
      const formattedMinutes = this.minutes.toString().padStart(2, "0");
      const formattedSeconds = this.seconds.toString().padStart(2, "0");
      this.time = `${formattedMinutes}:${formattedSeconds}`;
    }, 100);
  },
  unmounted() {
    this.timers.forEach((item) => {
      clearInterval(item);
    });
    clearInterval(this.timerCounter);
  },
  methods: {
    handleKeyPress(event) {
      let keys = this.keys;
      let step = 10;
      let cannon = this.cannon;
      // 如果按下的键不在数组中，则将其添加到数组中
      if (!keys.includes(event.key)) {
        keys.push(event.key);
      }
      // a
      if (keys.includes("a")) {
        cannon.style["left"] = cannon.style["left"].slice(0, -2) * 1 - step + "px";
      }
      // d
      if (keys.includes("d")) {
        cannon.style["left"] = cannon.style["left"].slice(0, -2) * 1 + step + "px";
      }
    },
    handleKeyDown(event) {
      let keys = this.keys;
      if (!keys.includes(event.key)) {
        keys.push(event.key);
      }
      // 空格发射
      if (keys.includes(" ")) {
        this.shoot(this.cannon.style["left"].slice(0, -2) * 1);
      }
    },
    shoot(x) {
      let left = x + "px";
      let bottom = 0 + "px";
      let bullet = {
        style: {
          left,
          bottom,
        },
        visible: true,
      };
      this.flying(bullet);
      this.bullets.push(bullet);
    },
    flying(obj) {
      let style = obj.style;
      let step = 20;
      let timer = setInterval(() => {
        style.bottom = style.bottom.slice(0, -2) * 1 + step + "px";

        if (style.bottom.slice(0, -2) * 1 > 510) {
          obj.visible=false
          clearInterval(timer);
        }
      }, 100);
      this.timers.push(timer);
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
  .time {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10px;
  }
  .map {
    width: 100%;
    height: 100%;
    border: 1px solid #666;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;

    .cannon {
      position: absolute;
      bottom: 0;
      left: 0;
      font-weight: 700;
      font-size: 20px;
    }
    .bullet {
      position: absolute;
    }
  }
}
</style>
