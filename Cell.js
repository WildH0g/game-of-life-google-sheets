// jshint esversion: 9
// jshint laxbreak: true

const Cell = (function () {
  const _grid = new WeakMap();
  const _row = new WeakMap();
  const _column = new WeakMap();

  class Cell {
    constructor(grid, row, column, isAlive) {
      _grid.set(this, grid);
      _row.set(this, row);
      _column.set(this, column);
      this.isAlive = isAlive;
    }

    get grid() {
      return _grid.get(this);
    }

    get row() {
      return _row.get(this);
    }

    get column() {
      return _column.get(this);
    }

    get neighborsAlive() {
      const { grid } = this;
      const { width, height } = grid;
      const lastRowIndex = height - 1;
      const lastColIndex = width - 1;
      let numAliveNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (0 === i && 0 === j) continue;
          let rowIndex =
            this.row + i < 0
              ? lastRowIndex
              : this.row + i > lastRowIndex
              ? 0
              : this.row + i;

          let columnIndex =
            this.column + j < 0
              ? lastColIndex
              : this.column + j > lastColIndex
              ? 0
              : this.column + j;

          if (grid.grid[rowIndex][columnIndex].isAlive) numAliveNeighbours++;
        }
      }
      return numAliveNeighbours;
    }

    getNewIsAlive() {
      const isAliveMap = {
        true: numNeighbors => ([2, 3].includes(numNeighbors) ? true : false),
        false: numNeighbors => (3 === numNeighbors ? true : false),
      };
      return isAliveMap[this.isAlive](this.neighborsAlive);
    }
  }

  return Cell;
})();
