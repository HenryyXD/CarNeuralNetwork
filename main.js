const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const carCtx = carCanvas.getContext("2d");

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 700;
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);

const getTrafficMaxSpeed = () => Utils.rndFloat(0.5, 3);
const trafficCount = 2000;
const carMaxSpeed = 5;
const carCount = 1000;
const bestCarPosPercent = 0.7;
const mutationAmount = 0.08;

let initialTimeStamp, traffic, cars, bestCar, bestCarAlive;
start();

function start() {
  initialTimeStamp = performance.now();
  traffic = generateTraffic(trafficCount);
  cars = generateCars(carCount);
  [bestCar, bestCarAlive] = [cars[0], cars[0]];

  if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
      cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
      
      if (i != 0) {
        NeuralNetwork.mutate(cars[i].brain, mutationAmount);
      }
    }
  }

  animate();
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  let canvasTop = bestCarAlive.y - (carCanvas.height * bestCarPosPercent);
  let canvasBottom = bestCarAlive.y + (carCanvas.height * (1 - bestCarPosPercent));
  
  let visibleTraffic = traffic.filter(t => {
    return t.y > canvasTop;
  });

  let visibleCars = cars.filter(c => {
    return c.y > canvasTop;
  });

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, visibleTraffic, canvasBottom);
  }
  
  let lastBestCar = bestCar;
  [bestCar, bestCarAlive] = getBestCars();
  if (lastBestCar !== bestCar)
    save();

  if (cars.every(c => c.damage)) {
    start();
    return;
  }
  
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
  let carColor = bestCarAlive === bestCar ? 'green' : 'blue';
  bestCarAlive.draw(carCtx, carColor, true);
  carCtx.restore();

  networkCtx.lineDashOffset= -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCarAlive.brain);
  requestAnimationFrame(animate);
}

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
    let randomY = Math.random() * -1 * i * 1500 + 1000;
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
    let distanceBonus = cars[i].y * -1 * 150;
    let velocityBonus = cars[i].speed * 1000;
    let survivalBonus = (performance.now() - initialTimeStamp) * 0.01;

    let lowSpeedPenalty = 0;
    if (cars[i].speed < carMaxSpeed * 0.5) {
      lowSpeedPenalty = -50 * (performance.now() - cars[i].lastLowSpeedTime) / 1000;
    } else {
      cars[i].lastLowSpeedTime = performance.now();
    }

    let sum = distanceBonus + velocityBonus + survivalBonus + lowSpeedPenalty;

    if (!cars[i].damage && sum > bestCarAliveTotal) {
      bestCarAlive = cars[i];
      bestCarAliveTotal = sum;
    }
    
    if (sum > bestCarTotal) {
      bestCar = cars[i];
      bestCarTotal = sum;
    }
  }


  return [bestCar, bestCarAlive];
}