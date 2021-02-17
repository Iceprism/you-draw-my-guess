<template>
<div>
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
  <span>剩余时间： </span>
  <span style="color:#ff601f" id="times">{{times}}s</span>
  </div>
  </p>
  <div id="answer-box">
    <span>Answer: </span>
    <input id="answer" type="text" placeholder="你的答案" />
    <input
      id="name"
      type="text"
      style="width: 260px"
      placeholder="你的群ID（建议简称，游戏全程不要改变）"
    />
    <p>
      计算题：
      <span id="Jisuan"></span>
      <input type="text" id="delay" placeholder="等于多少：" />
      <button id="submit">提交</button>
    </p>
  </div>
  <span>大家的答案：</span>
  <span style="color:blue" id="player"></span>
  <p style="color:#F93A">哪怕答题结束后也不要刷新网页！重新进入要很久</p>
</div>

</template>

<script>
var name, idea, keyword;

function JisuanFunction() {
  let JisuanA = Math.round(Math.random() * 10 + 11);
  let JisuanB = Math.round(Math.random() * 10);
  document.getElementById("Jisuan").innerHTML = `${JisuanA}-${JisuanB}=`;
  let JisuanE = JisuanA - JisuanB;
  return JisuanE; // 该函数返回 p1 和 p2 的乘积
}

("use strict");

export default {
  data() {
    return {
      times: 240,
    };
  },
  ready() {
    let showunanwer = 0;
    let resultN = JisuanFunction();
    const ws = new WebSocket("ws://XXXXXX.tpddns.cn:4545");
    const canvas = document.getElementById("showing");
    const cxt = canvas.getContext("2d");
    let moveToSwitch = 1;
    ws.onmessage = (msg) => {
      let pathObj = msg.data.split(".");
      cxt.strokeStyle = "#000";
      let msgRight = msg.data.split("@");
      /* console.log(msgRight[0]); */
      if (moveToSwitch && msg.data != "stop" && msg.data != "clear") {
        cxt.beginPath();
        cxt.moveTo(pathObj[0], pathObj[1]);
        moveToSwitch = 0;
      } else if (!moveToSwitch && msg.data == "stop") {
        cxt.beginPath();
        cxt.moveTo(pathObj[0], pathObj[1]);
        moveToSwitch = 1;
      } else if (moveToSwitch && msg.data == "clear") {
        cxt.clearRect(0, 0, 1000, 1000);
      } else if (msg.data == "clear") {
        cxt.clearRect(0, 0, 1000, 1000);
      }
      if (msgRight[0] == "idea") {
        idea = msgRight[1];
        console.log("???");
        document.getElementById("idea").innerHTML = `${idea}`;
      }
      if (msgRight[0] == "time" && msgRight[1] == "end") {
        document.getElementById("idea").innerHTML = "结束了";
        alert("本轮结束，辛苦了！");
        this.timer = setInterval(clearInterval(this.timer), (this.times = 240));
      }
      if (msgRight[0] == "player") {
        let players = msgRight[1];
        document.getElementById("player").innerHTML = `${players}`;
      }
      if (msgRight[1] == "一下奶嘴") {
        document.getElementById(
          "idea"
        ).innerHTML = `游戏准备开始，请不要刷新界面`;
      }

      if (msgRight[1] == "load") {
        this.player = 2;
        location.reload();
      }
      if (msgRight[0] == name && msgRight[1] == "right") {
        alert(
          "ID为：" +
            name +
            "\r恭喜你答对了！！\r不用刷新网页哦！现在可以去群里吐槽一下"
        );
        showunanwer = 0;
        ws.send("player" + "@ID:" + name + "猜对了！！");
        const http = new XMLHttpRequest();
        http.open(
          "GET",
          "http://XXXXXX.iceprism.cn/draw/addpoint.php?id=" +
            `${name}` +
            "&result=" +
            `${keyword}`
        );
        http.send();
        http.onload = () => console.log(http.responseText);
      }
      if (showunanwer == 1) {
        ws.send("player" + "@ID为 " + name + " ：" + keyword);
        showunanwer = 0;
      }
      if (msgRight[0] == "cell") {
        document.getElementById("idea").innerHTML = "开始计时！";
        this.timer = setInterval(() => {
          this.times--;
          if (this.times === 0) {
            clearInterval(this.timer), (this.times = 240);
          }
        }, 1000);
      }
      cxt.lineTo(pathObj[2], pathObj[3]);
      cxt.stroke();
    };

    ws.onopen = () => {
      let submitBtn = document.getElementById("submit");
      submitBtn.onclick = () => {
        let InputRes = document.getElementById("delay").value;
        console.log(InputRes + "*" + resultN);
        if (InputRes == resultN) {
          name = document.getElementById("name").value;
          keyword = document.getElementById("answer").value;

          showunanwer = 1;
          ws.send(keyword + ":" + name);
          /* document.getElementById("name").value = ""; */
          document.getElementById("answer").value = "";
          document.getElementById("delay").value = "";
          document.getElementById("delay").placeholder = "等于多少：";
          resultN = JisuanFunction();
          document.getElementById("answer").placeholder =
            "回答错误哦，请再试试";
        } else {
          document.getElementById("delay").value = "";
          document.getElementById("delay").placeholder = "计算错误，请重试";
        }
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
</style>