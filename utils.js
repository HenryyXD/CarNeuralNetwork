class Utils {
  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  static mapRange(value, fromLow, fromHigh, toLow, toHigh) {
    let normalized = (value - fromLow) / (fromHigh - fromLow);
    return normalized * (toHigh - toLow) + toLow;
  }

  static getInstersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (B.x - A.x) * (A.y - C.y) + (B.y - A.y) * (C.x - A.x);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
      const t = tTop / bottom;
      const u = uTop / bottom;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
          x: this.lerp(A.x, B.x, t),
          y: this.lerp(A.y, B.y, t),
          offset: t,
        };
      }
    }
  }

  static detectPolygonsColision(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
      for (let j = 0; j < poly2.length; j++) {
        let collision = this.getInstersection(
          poly1[i],
          poly1[(i + 1) % poly1.length],
          poly2[j],
          poly2[(j + 1) % poly2.length]
        );

        if (collision)
          return true;
      }
    }

    return false;
  }
}