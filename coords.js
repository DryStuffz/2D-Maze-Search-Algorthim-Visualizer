class Coords {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.parent = null;
      this.cost = 0; //also F for a Star
      this.g = null; //for aStar
    }
  
    toString() {
      return `(${this.x},${this.y})`;
    }
  
    equals(coord2) {
      if (!(coord2 instanceof Coords)) {
        return false;
      }
      return (coord2.x === this.x && coord2.y === this.y);
    }
  
  }