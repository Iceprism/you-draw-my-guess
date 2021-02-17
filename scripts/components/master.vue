<template>
  <canvas
    id="canvas"
    width="600"
    height="400"
    style="border: 1px solid #999"
  ></canvas>
  <div id="keyword-box"></div>
  <button id="btn">清空画布</button>
  <canvas
    id="showing"
    width="600"
    height="400"
    style="border: 1px solid #999"
  ></canvas>
  <p>
    提示：
    <span id="idea"></span>
      <div>
            <span>大家的答案：</span>
  <span id="player"></span>
  <p></p>
  <span>剩余时间： </span>
  <span id="times">{{times}}s</span>
  </div>
  </p>
  <div id="answer-box">
    <span>控制台命令: </span>
    <input id="answer" type="text" />
    <button id="submit">提交</button>
  </div>

  <span>返回结果: </span>
  <span id="keyword"></span>
  <p>换新人作画的时候 等待多点2次，因为加了直接看的限制</p>
  <button id="waitK">等待</button>
  <button id="close">隐藏</button>
  <button id="L10s">10s</button>
  <button id="Tend">结束</button>
  <button id="newWord">新词</button>
  <button id="Tisi">提示</button>
  <button id="onloadE">所有人刷新</button>
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
    let splitkey;
    let reday = 0;
    const ws = new WebSocket("ws://XXXXXX.tpddns.cn:4545");
    let draw = new Draw("canvas");
    let btn = document.getElementById("btn");

    const canvas = document.getElementById("showing");
    const cxt = canvas.getContext("2d");
    let moveToSwitch = 1;
    ws.onmessage = (msg) => {
      let msgcell = msg.data.split("@");
      if (msgcell[0] == "cell") {
        document.getElementById("keyword").innerHTML =
          "*隐藏了*真的忘记了就私聊奶嘴吧";
        this.timer = setInterval(() => {
          this.times--;
          if (this.times === 0) {
            clearInterval(this.timer), (this.times = 240);
          }
        }, 1000);
      } else if (msgcell[0] == "player") {
        let players = msgcell[1];
        document.getElementById("player").innerHTML = `${players}`;
      }
      if (msgcell[1] == "Last") {
        document.getElementById("keyword").innerHTML =
          "！！最后倒计时10s！！！";
      }
      if (msgcell[0] == "time" && msgcell[1] == "end") {
        document.getElementById("keyword").innerHTML = "结束了";
        /* alert("本轮结束，辛苦了！请刷新网页！"); */
        this.timer = setInterval(clearInterval(this.timer), (this.times = 240));
      }
      if (reday > 2) {
        msg.data.split(":")[0] == "keyword"
          ? (document.getElementById("keyword").innerHTML = msg.data.split(
              ":"
            )[1])
          : false;
      }
      let pathObj = msg.data.split(".");
      cxt.strokeStyle = "#000";
      let msgRight = msg.data.split("@");
      if (moveToSwitch && msg.data != "stop" && msg.data != "clear") {
        cxt.beginPath();
        cxt.moveTo(pathObj[0], pathObj[1]);
        moveToSwitch = 0;
      } else if (!moveToSwitch && msg.data == "stop") {
        cxt.beginPath();
        cxt.moveTo(pathObj[0], pathObj[1]);
        moveToSwitch = 1;
      } else if (msg.data == "clear") {
        cxt.clearRect(0, 0, 1000, 1000);
      } else if (msg.data == "答对了！！") {
        alert("恭喜你答对了！！");
      } else if (msgRight[0] == "idea") {
        let idea = msgRight[1];
        console.log("???");
        document.getElementById("idea").innerHTML = `${idea}`;
      }
      reday++;
      cxt.lineTo(pathObj[2], pathObj[3]);
      cxt.stroke();
    };

    ws.onopen = () => {
      draw.init(ws, btn);
      let submitBtn = document.getElementById("submit");
      submitBtn.onclick = () => {
        let keyword = document.getElementById("answer").value;
        ws.send(keyword);
        splitkey = keyword.split(":");
        if (splitkey[0] == "nw") {
          const http = new XMLHttpRequest();
          http.open(
            "GET",
            "http://XXXXXX.iceprism.cn/draw/addpoint.php?id=" +
              "start" +
              "&result=" +
              `${splitkey[1]}`
          );
          http.send();
          http.onload = () => console.log(http.responseText);
        }
      };
      let waitK = document.getElementById("waitK");
      waitK.onclick = () => {
        ws.send("wait");
      };
      let closeE = document.getElementById("close");
      closeE.onclick = () => {
        /*         let id = "testK";
        let result = "KKK";
        const http = new XMLHttpRequest()
        http.open("GET", "http://localhost/draw/addpoint.php?id="+`${id}`+"&result="+`${result}`)
        http.send()
        http.onload = () => console.log(http.responseText) */

        ws.send("cell@cell");
      };
      let L10s = document.getElementById("L10s");
      L10s.onclick = () => {
        ws.send("time@Last");
      };
      let Tend = document.getElementById("Tend");
      Tend.onclick = () => {
        ws.send("time@end");
        ws.send("idea@本轮结束！不用刷新网站哦");
        const http = new XMLHttpRequest();
        http.open(
          "GET",
          "http://XXXXXX.iceprism.cn/draw/addpoint.php?id=" +
            "end" +
            "&result=" +
            `${splitkey[1]}`
        );
        http.send();
        http.onload = () => console.log(http.responseText);
      };
      let newWord = document.getElementById("newWord");
      newWord.onclick = () => {
        document.getElementById("answer").value = "nw:";
      };
      let Tisi = document.getElementById("Tisi");
      Tisi.onclick = () => {
        document.getElementById("answer").value = "idea@";
      };
      let onloadE = document.getElementById("onloadE");
      onloadE.onclick = () => {
        ws.send("load@load");
      };
    };
  },
};
</script>

<style lang="less">
#showing {
  background: lightblue;
}
#answer-box {
  margin: 10px 0;
}

#canvas {
  background: pink;
  cursor: default;
}
#keyword-box {
  margin: 10px 0;
}
</style>


