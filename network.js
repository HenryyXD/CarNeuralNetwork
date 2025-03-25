class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }

  static mutate(network, amount = 1) {
    network.levels.forEach(level => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = Utils.lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }

      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = Utils.lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
        }
      }
    });
  }
}

class Level {
  constructor(inputLength, outputLength) {
    this.inputs = new Array(inputLength);
    this.outputs = new Array(outputLength);
    this.biases = new Array(outputLength);

    this.weights = [];
    for (let inIdx = 0; inIdx < inputLength; inIdx++) {
      this.weights[inIdx] = new Array(outputLength);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let inIdx = 0; inIdx < level.inputs.length; inIdx++) {
      for (let outIdx = 0; outIdx < level.outputs.length; outIdx++) {
        level.weights[inIdx][outIdx] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++){
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let inIdx = 0; inIdx < level.inputs.length; inIdx++) {
      level.inputs[inIdx] = givenInputs[inIdx];
    }

    for (let outIdx = 0; outIdx < level.outputs.length; outIdx++) {
      let sum = 0;
      for (let inIdx = 0; inIdx < level.inputs.length; inIdx++){
        sum += level.inputs[inIdx] * level.weights[inIdx][outIdx];
      }

      if (sum > level.biases[outIdx]) {
        level.outputs[outIdx] = 1;
      } else {
        level.outputs[outIdx] = 0;
      }
    }

    return level.outputs;
  }

}