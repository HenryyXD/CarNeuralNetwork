const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 700;
const networkCtx = networkCanvas.getContext("2d");


const road = new Road(carCanvas.width / 2, 200, 3);
const car = new Car(road.getLaneCenter(1), carCanvas.height / 2, 30, 50, carTypes.player);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, carTypes.traffic, 0.5)
];

animate();
function animate() {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);
  
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'orange');
  }

  car.draw(carCtx, 'black');

  carCtx.restore();

  Visualizer.drawNetwork(networkCtx, car.brain);
  requestAnimationFrame(animate);
}