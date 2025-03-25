class Sensor {

  constructor(car) {
    this.car = car;
    this.rayCount = 10;
    this.raySpread = Math.PI / 2; // initial ray angle - final ray angle
    this.rayLength = 300;
    this.rays = [];
    this.readings = [];
  }
  
  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++) {
      this.readings.push(
        this.#getReadings(this.rays[i], roadBorders, traffic)
      );
    }
  }
  
  #getReadings(ray, roadBorders, traffic) {
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      let touch = Utils.getInstersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      
      if (touch)
        touches.push(touch);
    }

    for (let i = 0; i < traffic.length; i++) {
      let poly = traffic[i].polygons;
      for (let j = 0; j < poly.length; j++) {
        let touch = Utils.getInstersection(
          ray[0],
          ray[1],
          poly[j],
          poly[(j + 1) % poly.length]
        );

        if (touch)
          touches.push(touch); 
      }
    }

    let closestTouch = touches
      .reduce((closest, cur) =>
        (cur.offset < closest.offset) ? cur : closest, touches[0]);
    
    return closestTouch;
  }

  #castRays() {
    let start = { x: this.car.x, y: this.car.y };
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      let rayAngle = Utils.lerp(
        this.raySpread / 2,
        -this.raySpread / 2,
        this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
      ) + this.car.angle;

      let endX = this.car.x - Math.sin(rayAngle) * this.rayLength;
      let endY = this.car.y - Math.cos(rayAngle) * this.rayLength;
      let end = { x: endX, y: endY };
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let curRay = this.rays[i];
      let end = this.readings[i] ?? curRay[1];

      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curRay[0].x, curRay[0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(curRay[1].x, curRay[1].y);
      ctx.stroke();

    }
  }
}