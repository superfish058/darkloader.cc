<template>
  <div class="baseBox">
    <div class="defArea">
      <div class="score">最终得分：{{ score }}</div>
      <div class="arrows">
        <div class="dItem" v-for="(item, index) in defLine" :key="index" :style="{ color: line[index] == item ? 'orange' : '' }">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keys: [],
      line: [],
      defLine: [],
      curIndex: 0,
      length:3,
      score: 0,
      stage:0,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.initDefLine();
  },
  methods: {
    initDefLine(type = 0) {
      function generateRandomArray(characters, length) {
        const randomArray = [];
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charactersLength);
          randomArray.push(characters[randomIndex]);
        }

        return randomArray;
      }
      if (type == 1) {
        return (this.line = generateRandomArray(["1"], this.length));
      }
      this.defLine = generateRandomArray(["↑", "↓", "←", "→"], this.length);
      this.line = generateRandomArray(["1"], this.length);
    },
    handleKeyDown(event) {
      let keys = this.keys;
      // 如果按下的键不在数组中，则将其添加到数组中
      if (!keys.includes(event.key)) {
        keys.push(event.key);

        if (event.key == "w" || event.key == "ArrowUp") {
          this.line[this.curIndex] = "↑";
        } else if (event.key == "s" || event.key == "ArrowDown") {
          this.line[this.curIndex] = "↓";
        } else if (event.key == "a" || event.key == "ArrowLeft") {
          this.line[this.curIndex] = "←";
        } else if (event.key == "d" || event.key == "ArrowRight") {
          this.line[this.curIndex] = "→";
        }
        if (this.line[this.curIndex] != this.defLine[this.curIndex]) {
          this.curIndex = 0;
          this.initDefLine(1);
          return;
        }
        if (this.line[this.length - 1] == this.defLine[this.length - 1]) {
          this.curIndex = 0;
          this.score++;
          this.stage++
          if(this.stage==3){
            this.stage=0
            this.length++
          }
          this.initDefLine(0);
          return
        }

        this.curIndex++;
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
  .score {
    font-size: 24px;
    font-weight: 700;
    color: #e44eaa;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .arrows {
    width: 100%;
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  .defArea {
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 40px;
    font-weight: 700;
    color: #999;
  }
}
</style>
