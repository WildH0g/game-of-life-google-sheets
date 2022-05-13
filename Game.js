// jshint esversion: 9
// jshint laxbreak: true
if (false) require('google-apps-script');

const GameOfLife = (function () {
  const _render = new WeakMap();
  const _grid = new WeakMap();
  const _numIterations = new WeakMap();
  const _frameMs = new WeakMap();

  const _pause = ms => Utilities.sleep(ms);

  const _validateInt = (num, name) => {
    if (undefined === num) return;
    if (isNaN(parseInt(num))) throw new Error(`${name} must be a number!`);
    return parseInt(num);
  };

  const _validateCallback = (callback, name) => {
    if ('function' === typeof callback) return callback;
    throw new Error(`${name} must be a function!`);
  };

  class GameOfLife {
    constructor(renderCallback, options) {
      _render.set(this, _validateCallback(renderCallback, 'renderCallback'));
      _numIterations.set(
        this,
        _validateInt(options.numIterations, 'numIterations') || 5
      );
      _frameMs.set(this, _validateInt(options.frameMs, 'frameMs') || 100);
      delete options.numIterations;
      delete options.frameMs;
      _grid.set(this, new Grid(options));
    }

    render(grid) {
      _render.get(this)(grid);
      return this;
    }

    play() {
      const grid = _grid.get(this);
      grid.init();
      this.render(grid.grid);

      const recurse = async (grid, iterations, current = 0) => {
        _pause(_frameMs.get(this));
        let nextGrid = grid.nextGen();
        if (null === nextGrid) {
          console.log('The grid has reached a stable state');
          return;
        }
        this.render(nextGrid.grid);
        if (current < iterations) recurse(nextGrid, iterations, current + 1);
      };

      recurse(grid, _numIterations.get(this));

      return this;
    }
  }

  return GameOfLife;
})();
