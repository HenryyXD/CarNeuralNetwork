class DrawText {
  static #texts;
  static #textSize;

  static setup () {
    this.#texts = new Map();
    this.#textSize = 20;
  }

  static draw(ctx) {
    ctx.save();
    ctx.font = `${this.#textSize}px consolas`;
    ctx.fillStyle = "black";
    let index = 0;
    this.#texts.forEach((text, key) => {
      ctx.fillText(key + ": " + text, 10, (++index) * this.#textSize);
    });
  }

  static add(text, id) {
    this.#texts.set(id, text);
  }
}