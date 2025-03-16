const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;
const ctx = canvas.getContext("2d");

DrawText.setup();
const road = new Road(canvas.width / 2, 200, 3);
const car = new Car(road.getLaneCenter(1), canvas.height / 2, 30, 50);

animate();
function animate() {
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);
  DrawText.draw(ctx);

  road.draw(ctx);
  car.update(road.borders);
  car.draw(ctx);

  ctx.restore();
  requestAnimationFrame(animate);
}