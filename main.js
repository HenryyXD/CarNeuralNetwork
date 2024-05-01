const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 800;

const ctx = canvas.getContext("2d");
const car = new Car(canvas.height / 2, canvas.width / 2, 30, 50);
car.draw(ctx);

animate();

function animate() {
  canvas.height = window.innerHeight;
  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate);
}