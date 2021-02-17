<template>
  <div>
    <div v-if='this.player == 0'>
    <p>绿茶汉化组2021春活之你画我猜</p>
    <p style="color:red">请用浏览器打开，不要QQ直接点开网页，游戏过程会有bug！</p>
    <p style="color:#F93A">没轮到您画的时候不要打开"我来画",不然绘画区会出现错乱的线条！</p>
    <p>程序开发的很简单，可能存在特殊看到答案的方法，可这是一场活动而已，希望大家能诚信游戏哈!</p>
  </div>
  <drawing-board v-if='this.player == 1'></drawing-board>
  <showing-board v-if='this.player == 2'></showing-board>
  <master v-if='this.player == 3'></master>
  <button v-if='this.player == 0' @click='draw'>我来画(画师进入)</button>
  <button v-if='this.player == 0' @click='guess'>我来猜(猜谜请进！)</button>
  <button v-if='this.player == 1' @click='master'>控制台(测试页,别点，会影响全局)</button>
  <button v-if='this.player == 3' @click='replay'>重新开始</button>
  <p>界面开发：@奶嘴偷走初吻</p>
</div>

</template>

<script>
import Vue from 'vue'

import DrawingBoard from './components/drawing-board.vue'
import showingBoard from './components/showing-board.vue'
import master from './components/master.vue'

export default {
    data() {
      return {
        player: 0
      }
    },
    components: {
      DrawingBoard,
      showingBoard,
      master
    },
    methods: {
      draw() {
        this.player = 1
      },
      guess() {
        this.player = 2
      },
      master() {
        this.player = 3
      },
      replay() {
        this.player = 0
        location.reload()
      }
    }
}
</script>

<style lang="less">
body {
  background: #fff;
}
</style>
