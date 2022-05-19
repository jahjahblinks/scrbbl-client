<template>
  <div class="column is-6">
    <video class="input_video" width="100%" height="100%"></video>
    <div class="card whiteboard-wrapper">
      <canvas
        v-if="iDraw"
        class="whiteboard"
        ref="canvas"
        height="600"
        width="800"
        :draggable="false"
        @mousemove="emitLine"
        @touchmove="getTouchPosition"
        @mouseleave="leaveCanvas"
      ></canvas>
      <canvas
        v-else
        class="whiteboard"
        ref="canvas"
        height="600"
        width="800"
        :draggable="false"
      ></canvas>
      <canvas
        v-if="iDraw"
        class="overlay"
        height="600"
        width="800"
        style="position: absolute; left: 0; top: 0; z-index: -100;"
        :draggable="false"
      ></canvas>
      <footer class="card whiteboard-footer" v-if="iDraw">
        <div class="card-content">
          <div class="columns is-multiline is-mobile">
            <div class="column" v-for="color in colors" :key="color">
              <div
                class="color"
                :class="{ active: activeColor == color }"
                :style="{ background: `${color}` }"
                @click="activeColor = color"
              ></div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <a href="#" class="card-footer-item" @click.prevent="clearBoard"
            >Clear</a
          >
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
console.log("imports");
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
export default {
  name: "Whiteboard",
  data() {
    return {
      colors: [
        "#000",
        "#654321",
        "#95a5a6",
        "#f1c40f",
        "#f39c12",
        "#c0392b",
        "#3498db",
        "#2ecc71",
      ],
      activeColor: "#000",
      prevPos: { x: null, y: null },
      ctx: null,
      draw: false,
      size: null, //default value for drawing line size
    };
  },
  computed: {
    inputVideo() {
      return this.$refs.input_video;
    },
  },
  props: ["iDraw", "started"],
  methods: {
    initBoard() {
      this.ctx = this.$refs.canvas.getContext("2d");
      this.ctx.lineJoin = "round";
      this.size = 5;

      const videoElement = document.getElementsByClassName('input_video')[0];
      videoElement.style.display = "none";

      const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }});

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      hands.onResults(this.onResults);

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await hands.send({image: videoElement});
        },
        width: 1280,
        height: 720
      });
      camera.start();
    },
    onResults(results) {
      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          let scaledPos = { x: 800 - parseInt(1600*(landmarks[8].x - 0.25), 10), y: parseInt(1200*(landmarks[8].y-0.25), 10)};
          let canvas = document.getElementsByClassName("overlay")[0];
          let ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath();
          ctx.strokeStyle = "#000";
          ctx.arc(scaledPos.x, scaledPos.y, 25, 0, 2 * Math.PI);
          ctx.stroke();
          
          if(landmarks[8].x > 0.75 || landmarks[8].x < 0.25 || landmarks[8].y > 0.75 || landmarks[8].y < 0.25){
            this.prevPos.x = null;
            this.prevPos.y = null;
            break;
          }
          if(Math.sqrt((landmarks[8].x - landmarks[4].x)**2 + (landmarks[8].y - landmarks[4].y)**2) > 0.05){
            this.prevPos.x = null;
            this.prevPos.y = null;
            break;
          }

          
          if (this.prevPos.x != null && this.prevPos.y != null && this.started) {
            let coords = { prevPos: this.prevPos, currPos: scaledPos };
            let paintObj = { color: this.activeColor, coords };
            this.$socket.emit("paint", paintObj);
            this.drawLine(paintObj);
          }
          // New previous pos
          this.prevPos.x = scaledPos.x;
          this.prevPos.y = scaledPos.y;
          console.log(scaledPos.x + " " + scaledPos.y);
        }
      }
      else{
        this.prevPos.x = null;
        this.prevPos.y = null;
        let canvas = document.getElementsByClassName("overlay")[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    clearBoard() {
      this.$socket.emit("clear");
    },
    increaseLineSize() //Increase drawing line size by 5
    {
      this.ctx.lineWidth += 25;

      newLineSize = this.size + 25;
      this.size = newLineSize;
      
        //this.ctx.lineWidth(this.size);
    },
    decreaseLineSize() //Decrease drawing line size by 5
    {
      this.ctx.lineWidth -= 25; 

      newLineSize = this.size - 25;
      if(newLineSize > 0) {
        this.size = newLineSize;
      }
        //this.ctx.lineWidth(this.size);
    },
    resetLineSize() //Decrease drawing line size by 5
    {
      this.ctx.lineWidth = 5; 
      this.size = 5;
    },
    getUpdatedLineSize() {
      return this.size;
    },
    drawLine(line) {
      let CTX = this.ctx;
      let { color, coords } = line;
      //var lineWidth = this.size;
      //CTX.lineWidth = lineWidth; //Dynamic line size
      if (coords) {
        CTX.strokeStyle = color;
        CTX.beginPath();
        CTX.moveTo(coords.prevPos.x, coords.prevPos.y);
        CTX.lineTo(coords.currPos.x, coords.currPos.y);
        CTX.closePath();
        CTX.stroke();
      }
    },
    emitLine(e) {
      if (this.draw && this.iDraw) {
        let pos = this.getCanvasPosition(this.$refs.canvas, e);

        if (this.prevPos.x != null && this.prevPos.y != null && this.started) {
          let coords = { prevPos: this.prevPos, currPos: pos };
          let paintObj = { color: this.activeColor, coords };
          this.$socket.emit("paint", paintObj);
          this.drawLine(paintObj);
        }
        // New previous pos
        this.prevPos.x = pos.x;
        this.prevPos.y = pos.y;
      }
    },
    emitLineByHand(coords){
      console.log("emitLineByHand in WhiteBoard.vue getting called");
      if(this.draw && this.iDraw){
        let pos = coords;

        if (this.prevPos.x != null && this.prevPos.y != null && this.started) {
          let coords = { prevPos: this.prevPos, currPos: pos };
          let paintObj = { color: this.activeColor, coords };
          this.$socket.emit("paint", paintObj);
          this.drawLine(paintObj);
        }
        // New previous pos
        this.prevPos.x = pos.x;
        this.prevPos.y = pos.y;
      }
    },
    enableDrawing() {
      this.draw = true;
    },
    disableDrawing() {
      this.draw = false;
      this.prevPos.x = null;
      this.prevPos.y = null;
    },
    leaveCanvas() {
      this.prevPos.x = null;
      this.prevPos.y = null;
    },
    getTouchPosition(e) {
      if (this.iDraw) {
        e.preventDefault();
        e.stopPropagation();
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        this.emitLine(mouseEvent);
      }
    },
    getCanvasPosition(canvas, evt) {
      var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY,
      };
    },
    addEvents() {
      //window.addEventListener("keydown", this.increaseLineSize); //debugging
      window.addEventListener("mousedown", this.enableDrawing);
      window.addEventListener("touchstart", this.enableDrawing);
      window.addEventListener("mouseup", this.disableDrawing);
      window.addEventListener("touchend", this.disableDrawing);
    },
    removeEvents() {
      //window.addEventListener("keydown", this.increaseLineSize); //debugging
      window.removeEventListener("mousedown", this.enableDrawing);
      window.removeEventListener("touchstart", this.enableDrawing);
      window.removeEventListener("mouseup", this.disableDrawing);
      window.removeEventListener("touchend", this.disableDrawing);
    },
  },
  watch: {
    iDraw(value) {
      if (value) {
        this.addEvents();
      } else {
        this.removeEvents();
      }
    },
  },
  sockets: {
    increase_pen_size() {
      this.increaseLineSize();
      //newLineSize = this.size + 5;
      //if(newLineSize < 55)
      //  this.size = newLineSize;
      //  this.increaseLineSize();
    },
    decrease_pen_size() {
     this.decreaseLineSize();
     //newLineSize = this.size - 5;
     //if(newLineSize > 0)
     //  this.size = newLineSize;
     //  this.decreaseLineSize();
    },
    reset_pen_size() {
      this.resetLineSize();
    },
    paint(coords) {
      if (coords) {
        this.drawLine(coords);
      }
    },
    handCoords(coords){
      if(coords){
        this.emitLineByHand(coords);
      }
    },
    getPainting(lines) {
      for (let line of lines) {
        this.drawLine(line);
      }
    },
    clear() {
      this.ctx.clearRect(
        0,
        0,
        this.$refs.canvas.width,
        this.$refs.canvas.height
      );
    },
  },
  mounted() {
    this.initBoard();
    if (this.iDraw) {
      this.addEvents();
    }
  },
  destroyed() {
    this.removeEvents();
  },
};
</script>
<style lang="scss">
.whiteboard-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.whiteboard {
  width: 100%;
  height: 100%;
  flex: 1;
  // background: palegoldenrod;
  @media screen and (min-width: 768px) {
    min-height: 590px;
  }
}

.whiteboard-footer {
  /* display: flex;
  flex-direction: column;
  padding: 1rem; */
}

.color {
  padding-bottom: 100%;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid lightgray;
  &.active {
    border: 1px solid #000;
  }
}
</style>
