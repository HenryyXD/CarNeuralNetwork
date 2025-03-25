const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 700;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);

const carMaxSpeed = 5;
let getTrafficMaxSpeed = () => Utils.rndFloat(0.5, 3);
const bestCarPosPercent = 0.7;
const carCount = 10000;
const trafficCount = 1000;
const mutationAmount = 0.1;

const traffic = generateTraffic(trafficCount);
const cars = generateCars(carCount);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, mutationAmount);
    }
  }
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateTraffic(n) {
  const traffic = [];
  for (let i = 0; i < n; i++) {
    let lanePos = Utils.rndInt(0, 2);
    let randomY = Math.random() * -1 * i * 1000;
    traffic.push(new Car(road.getLaneCenter(lanePos), randomY, 30, 50, carTypes.traffic, getTrafficMaxSpeed()));
  }

  return traffic;
}

function generateCars(n) {
  const cars = [];
  for (let i = 0; i < n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, carTypes.AI, carMaxSpeed));
  }

  return cars;
}

function getBestCars() {
  let [bestCar, bestCarTotal] = [cars[0], -Infinity];
  let [bestCarAlive, bestCarAliveTotal] = [cars[0], -Infinity];

  for (let i = 0; i < cars.length; i++) {
    let distancePoints = cars[i].y * -1 * 150;
    let velocityPoints = cars[i].speed * 100;
    let sum = distancePoints + velocityPoints;

    if (cars[i].damage) {
      if (sum > bestCarTotal) {
        bestCar = cars[i];
        bestCarTotal = sum;
      }
    } else {
      if (sum > bestCarAliveTotal) {
        bestCarAlive = cars[i];
        bestCarAliveTotal = sum;
      }
    }
  }

  return [bestCar, bestCarAlive];
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  
  let visibleTraffic = traffic.filter(t => {
    return t.y > bestCar.y - (carCanvas.height * bestCarPosPercent);
  });

  let visibleCars = cars.filter(c => {
    return (c.y > bestCar.y - (carCanvas.height * bestCarPosPercent)) && !c.damage;
  });

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, visibleTraffic);
  }
  
  let lastBestCar = bestCar;
  [bestCar, bestCarAlive] = getBestCars();
  if (lastBestCar !== bestCar)
    save();
  
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, - bestCarAlive.y + carCanvas.height * bestCarPosPercent);

  road.draw(carCtx);

  for (let i = 0; i < visibleTraffic.length; i++) {
    visibleTraffic[i].draw(carCtx, 'orange');
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < visibleCars.length; i++) {
    visibleCars[i].draw(carCtx, 'black');
  }
  carCtx.globalAlpha = 1;
  bestCarAlive.draw(carCtx, 'blue', true);
  
  carCtx.restore();

  networkCtx.lineDashOffset= -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCarAlive.brain);
  requestAnimationFrame(animate);
}