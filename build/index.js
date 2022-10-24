"use strict";
(() => {
  // src/SerpinskyTriangle.ts
  var SerpinskyTriangle = class {
    constructor(canvas2) {
      this.canvas = canvas2;
      const context = canvas2.getContext("2d");
      if (!context)
        throw new Error("Unsupported context 2d");
      this._ctx = context;
    }
    _ctx;
    _triangleDots = [];
    _currentPosition = { x: 0, y: 0 };
    setCurrentPosition(position) {
      this._currentPosition = position;
    }
    drawCurrentPosition() {
      this.drawDot(this._currentPosition);
    }
    drawDot(point) {
      this._ctx.fillStyle = "#45a7fe";
      this._ctx.fillRect(point.x, point.y, 2, 2);
    }
    drawTriangle() {
      this._ctx.beginPath();
      this._ctx.moveTo(this._triangleDots[0].x, this._triangleDots[0].y);
      this._triangleDots.forEach((dot) => this._ctx.lineTo(dot.x, dot.y));
      this._ctx.closePath();
      this._ctx.stroke();
    }
    drawRandomCircle() {
      const nextDot = this._triangleDots[Math.floor(Math.random() * 3)];
      const currentPosition = this._currentPosition;
      this._currentPosition = {
        x: currentPosition.x + (nextDot.x - currentPosition.x) / 2,
        y: currentPosition.y + (nextDot.y - currentPosition.y) / 2
      };
      this.drawCurrentPosition();
    }
    setupTriangleDots(dots2) {
      this._triangleDots = dots2;
    }
    drawCircle(position, radius) {
      this._ctx.beginPath();
      this._ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
      this._ctx.fillStyle = "red";
      this._ctx.fill();
    }
    clear() {
      this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };

  // src/index.ts
  var canvas = document.getElementById("canvas");
  var instruction = document.getElementById("instruction");
  var resetButton = document.getElementById("reset-button");
  var serpinskyTriangle = new SerpinskyTriangle(canvas);
  var animationId;
  var state = 0 /* TriangleSelection */;
  var dots = [];
  function getWorldPosition(point) {
    const hk = canvas.height / canvas.clientHeight;
    const wk = canvas.width / canvas.clientWidth;
    return {
      x: point.x * wk,
      y: point.y * hk
    };
  }
  function onCanvasClick(e) {
    let point = getWorldPosition(getPointFromEvent(e));
    console.log(getPointFromEvent(e), point);
    switch (state) {
      case 0 /* TriangleSelection */:
        dots.push(point);
        serpinskyTriangle.drawCircle(point, 5);
        if (dots.length < 3) {
          return;
        }
        state = 1 /* PointSelection */;
        serpinskyTriangle.setupTriangleDots(dots);
        serpinskyTriangle.drawTriangle();
        instruction.textContent = "Select first dot for start drawing" /* SelectFirstDot */;
        break;
      case 1 /* PointSelection */:
        serpinskyTriangle.setCurrentPosition(point);
        serpinskyTriangle.drawCurrentPosition();
        animate();
        state = 2 /* Animation */;
        break;
    }
  }
  canvas.addEventListener("click", onCanvasClick);
  canvas.addEventListener("touchend", onCanvasClick);
  resetButton.addEventListener("click", () => {
    dots = [];
    cancelAnimationFrame(animationId);
    animationId = 0;
    serpinskyTriangle.clear();
    state = 0 /* TriangleSelection */;
  });
  function getPointFromEvent(e) {
    const pointSource = e instanceof MouseEvent ? e : e.touches[0];
    const element = e.target;
    const rect = element.getBoundingClientRect();
    return {
      x: pointSource.clientX - rect.left,
      y: pointSource.clientY - rect.top
    };
  }
  instruction.textContent = "Click in 3 sides to draw triangle" /* DrawTriangle */;
  function animate() {
    serpinskyTriangle.drawRandomCircle();
    serpinskyTriangle.drawTriangle();
    animationId = requestAnimationFrame(animate);
  }
})();
