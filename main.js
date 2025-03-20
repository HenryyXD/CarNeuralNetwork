const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;
const ctx = canvas.getContext("2d");

DrawText.setup();
const road = new Road(canvas.width / 2, 200, 3);
const car = new Car(road.getLaneCenter(1), canvas.height / 2, 30, 50, carTypes.player);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, carTypes.traffic, 0.5)
];

animate();
function animate() {
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  DrawText.draw(ctx);

  road.draw(ctx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);
  
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, 'orange');
  }

  car.draw(ctx, 'black');

  ctx.restore();
  requestAnimationFrame(animate);
}