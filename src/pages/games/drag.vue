<template>
  <div class="baseBox" @dragover="dragOver" @drop="dropBox">
    <div class="drag-item" v-for="item in items" :key="item.id" :draggable="true" @dragstart="dragStart(item)" @dragleave="dragLeave" @drop="drop(item)" v-show="item.visible">
      {{ item.content }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, content: "Item 1", visible: true },
        { id: 2, content: "Item 2", visible: true },
        { id: 3, content: "Item 3", visible: true },
      ],
      dragItem: null,
      drop1: false,
    };
  },
  methods: {
    // 拖拽松开
    dropBox(e) {
      this.dragItem.visible = true;
      if (this.drop1) {
        return (this.drop1 = false);
      }
      let findIndex = this.items.findIndex((item) => item.id == this.dragItem.id);
      this.items.push(this.dragItem);
      this.items.splice(findIndex, 1);
    },
    //拖拽开始
    dragStart(item) {
      this.dragItem = item;
    },
    // 拖拽经过
    dragOver(e) {
      e.preventDefault();
    },
    // 离开拖拽边框
    dragLeave(e) {
      this.dragItem.visible = false;
      e.preventDefault();
    },
    // 拖拽松开
    drop(item) {
      this.drop1 = true;
      const indexDrag = this.items.findIndex((i) => i.id === this.dragItem.id);
      const indexDrop = this.items.findIndex((i) => i.id === item.id);
      const temp = this.items[indexDrag];
      this.items[indexDrag] = this.items[indexDrop];
      this.items[indexDrop] = temp;

      // this.dragItem = null;
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
}
.drag-item {
  padding: 10px;
  margin: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
