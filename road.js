class Road {
  constructor(x, width, laneCount) {
    this.width = width;
    this.laneCount = laneCount;
    this.left = x - width / 2;
    this.right = x + width / 2;

    this.infinity = 10000000;
    this.top = -this.infinity;
    this.bottom = this.infinity;

    let topLeft = { x: this.left, y: this.top };
    let topRight = { x: this.right, y: this.top };
    let bottomLeft = { x: this.left, y: this.bottom };
    let bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight]
    ]
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "#777";
    ctx.fillRect(this.left, this.top, this.width, this.bottom - this.top);
    
    for (let i = 1; i < this.laneCount; i++) {
      let x = Utils.lerp(this.left, this.right, i / this.laneCount);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#FFF";
      ctx.setLineDash([30, 50]);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.strokeStyle = "#FFF";
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    this.borders.forEach(border => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }

  getLaneCenter(laneIndex) {
    const laneWidth = this.width / this.laneCount;
    return this.left + laneWidth / 2 + Math.min(laneIndex, this.laneCount - 1) * laneWidth;
  }
}