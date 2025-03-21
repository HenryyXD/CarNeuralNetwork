class Visualizer {
  static drawNetwork(ctx, network) {
    const margin = 70;
    const left = margin;
    const top = margin; 
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    for (let i = 0; i < network.levels.length; i++) {
      const levelTop = top + this.#getNodeX(network.levels, i, height - levelHeight, 0);
      Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i != network.levels.length - 1);
    }
  }

  static drawLevel(ctx, level, left, top, width, height, drawInput) { 
    const right = left + width;
    const bottom = top + height;
    const { inputs, outputs, weights, biases } = level;
    
    const connectionWidth = 1;
    const nodeSizeFactor = 0.25;
    const nodeNonLinearScalingFactor = 6;
    const biasesCircleWidthIsNodeRadiusDividedBy = 6;
    const activatedNodeScale = 0.6;
    const biasesNodeScale = 0.8;

    
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(this.#getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(this.#getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = connectionWidth;
        ctx.strokeStyle = Utils.getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }
    
    
    if (drawInput) {
      const nodeRadiusInput = width / (nodeNonLinearScalingFactor * Math.log(inputs.length + 1)) * nodeSizeFactor;
      ctx.lineWidth = nodeRadiusInput / biasesCircleWidthIsNodeRadiusDividedBy;
      for (let i = 0; i < inputs.length; i++) {
        const x = this.#getNodeX(inputs, i, left, right);
        ctx.beginPath();
        ctx.arc(x, bottom, nodeRadiusInput, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, bottom, nodeRadiusInput, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, bottom, nodeRadiusInput * activatedNodeScale, 0, Math.PI * 2);
        ctx.fillStyle = Utils.getRGBA(inputs[i])
        ctx.fill();
      }
    }
    
    const nodeRadiusOutput = width / outputs.length * nodeSizeFactor;
    ctx.lineWidth = nodeRadiusOutput / biasesCircleWidthIsNodeRadiusDividedBy;

    for (let i = 0; i < outputs.length; i++) {
      const x = this.#getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadiusOutput, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadiusOutput * activatedNodeScale, 0, Math.PI * 2);
      ctx.fillStyle = Utils.getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, top, nodeRadiusOutput, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = Utils.getRGBA(biases[i]);
      ctx.arc(x, top, nodeRadiusOutput * biasesNodeScale, 0, Math.PI * 2);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return Utils.lerp(left, right, nodes.length == 1 ? 0.5 : index / (nodes.length - 1));
  }
}