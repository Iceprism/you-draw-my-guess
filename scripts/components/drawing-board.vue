<template>
<div>
  <canvas
    id="canvas"
    width="600"
    height="400"
    style="border: 1px solid #999"
  ></canvas>
  <p>
    <span style="font-size: 12px"
      >P.S.:尽量画在画布中央，远离画布边界0.5cm</span
    >
    <button id="btn">清空画布</button>
  </p>

  <div id="keyword-box">
    <span>题目(请记住，开始绘画会隐藏): </span>
    <span style="color:red" id="keyword"></span>
  </div>

  <span>大家的答案：</span>
  <span id="player"></span>
  <div>
    <span>剩余时间： </span>
    <span style="color:#ff601f" id="times">{{ times }}s</span>
  </div>
  <p></p>
</div>
</template>

<script>
"use strict";

class Draw {
  constructor(el) {
    this.el = el;
    this.canvas = document.getElementById(this.el);
    this.cxt = this.canvas.getContext("2d");
    this.stage_info = canvas.getBoundingClientRect();
    this.path = {
      beginX: 0,
      beginY: 0,
      endX: 0,
      endY: 0,
    };
  }

  init(ws, btn) {
    this.canvas.onmousedown = () => {
      this.drawBegin(event, ws);
    };
    this.canvas.onmouseup = () => {
      this.drawEnd();
      ws.send("stop");
    };
    this.clearCanvas(ws, btn);
  }
  drawBegin(e, ws) {
    window.getSelection()
      ? window.getSelection().removeAllRanges()
      : document.selection.empty();
    this.cxt.strokeStyle = "#000";

    this.cxt.beginPath();
    this.cxt.moveTo(
      e.clientX - this.stage_info.left,
      e.clientY - this.stage_info.top
    );

    this.path.beginX = e.clientX - this.stage_info.left;
    this.path.beginY = e.clientY - this.stage_info.top;

    document.onmousemove = () => {
      this.drawing(event, ws);
    };
    // document.onmouseup = this.drawEnd
  }
  drawing(e, ws) {
    this.cxt.lineTo(
      e.clientX - this.stage_info.left,
      e.clientY - this.stage_info.top
    );

    this.path.endX = e.clientX - this.stage_info.left;
    this.path.endY = e.clientY - this.stage_info.top;

    ws.send(
      this.path.beginX +
        "." +
        this.path.beginY +
        "." +
        this.path.endX +
        "." +
        this.path.endY
    );

    this.cxt.stroke();
  }
  drawEnd() {
    document.onmousemove = document.onmouseup = null;
  }
  clearCanvas(ws, btn) {
    btn.onclick = () => {
      this.cxt.clearRect(0, 0, 1000, 1000);
      ws.send("clear");
    };
  }
}

export default {
  data() {
    return {
      times: 240,
    };
  },
  ready() {
    const ws = new WebSocket("ws://XXXXXX.tpddns.cn:4545");
    let reday = 0;
    let draw = new Draw("canvas");
    let btn = document.getElementById("btn");
    ws.onopen = () => {
      draw.init(ws, btn);
    };
    ws.onmessage = (msg) => {
      let msgcell = msg.data.split("@");
      if (reday > 2) {
        msg.data.split(":")[0] == "keyword"
          ? (document.getElementById("keyword").innerHTML = msg.data.split(
              ":"
            )[1])
          : false;
      }

      if (msgcell[0] == "cell") {
        document.getElementById("keyword").innerHTML =
          "*隐藏了*真的忘记了就私聊奶嘴吧";
        this.timer = setInterval(() => {
          this.times--;
          if (this.times === 0) {
            clearInterval(this.timer), (this.times = 240);
          }
        }, 1000);
      }
      if (msgcell[0] == "player") {
        let players = msgcell[1];
        document.getElementById("player").innerHTML = `${players}`;
      }
      if (msgcell[1] == "load") {
        this.player = 1;
        location.reload();
      }
      if (msgcell[1] == "Last") {
        document.getElementById("keyword").innerHTML =
          "！！最后倒计时10s！！！";
      }
      if (msgcell[0] == "time" && msgcell[1] == "end") {
        document.getElementById("keyword").innerHTML =
          "结束了,请清空画布准备下题！";
        alert("本轮结束，辛苦了！");
        this.timer = setInterval(clearInterval(this.timer), (this.times = 240));
      }
      reday++;
    };
  },
};
</script>

<style lang="less">
#canvas {
  background: pink;
  cursor: default;
}
#keyword-box {
  margin: 10px 0;
}
</style>