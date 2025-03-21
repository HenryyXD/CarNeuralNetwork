class Car {
  constructor(x, y, width, height, carType, maxSpeed = 2.5) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.08;
    this.maxSpeed = maxSpeed;
    this.friction = 0.02;
    this.angle = 0;
    this.angularVelocity = 0.010;
    this.damage = false;

    this.useBrain = carType == carTypes.AI;
    this.controls = new Controls(carType);

    if (carType != carTypes.traffic) {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
  }

  update(roadBorders, traffic) {
    if (!this.damage) {
      this.#move();
      this.#fillPolygons();
      this.damage = this.#detectCollisions(roadBorders, traffic);    
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(
        s => s == null ? 0 : 1 - s.offset
      );

      const outputs = NeuralNetwork.feedForward(offsets, this.brain);

      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }
  
  #detectCollisions(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (Utils.detectPolygonsColision(this.polygons, roadBorders[i]))
        return true;
    }

    for (let i = 0; i < traffic.length; i++) {
      if (Utils.detectPolygonsColision(this.polygons, traffic[i].polygons))
        return true;
    }

    return false;
  }

  #fillPolygons() {
    let rad = Math.hypot(this.width, this.height) / 2;
    let alpha = Math.atan2(this.width, this.height);

    this.polygons = [];

    this.polygons.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad
    });
    
    this.polygons.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad
    });

    this.polygons.push({
      x: this.x + Math.sin(this.angle + alpha) * rad,
      y: this.y + Math.cos(this.angle + alpha) * rad
    });

    this.polygons.push({
      x: this.x + Math.sin(this.angle - alpha) * rad,
      y: this.y + Math.cos(this.angle - alpha) * rad
    });
  }
  
  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }

    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if(this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += this.angularVelocity * flip;
      }

      if (this.controls.right) {
        this.angle -= this.angularVelocity * flip;
      }
    }
    
    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx, color) {
    ctx.beginPath();
    ctx.moveTo(this.polygons[0].x, this.polygons[0].y);
    for (let i = 1; i < this.polygons.length; i++) {
      ctx.lineTo(this.polygons[i].x, this.polygons[i].y);
    }

    if (this.damage)
      ctx.fillStyle = 'red';
    else
      ctx.fillStyle = color;

    ctx.closePath();
    ctx.fill();

    if (this.sensor)
      this.sensor.draw(ctx);
  }
}