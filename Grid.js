// jshint esversion: 9
// jshint laxbreak: true
if (false) require('google-apps-script');

const Grid = (function () {
  // private methods
  const _make2DArray = options => {
    const { width, height } = options;
    const grid = ','
      .repeat(height - 1)
      .split(',')
      .map(() => ','.repeat(width - 1).split(','));
    return grid;
  };

  const _checkOptions = options => {
    let { width, height, patternName } = options;
    const errorOut = errorMessage => ({ error: true, errorMessage });
    width = parseInt(width);
    height = parseInt(height);
    if (isNaN(width)) return errorOut('width is not a number: ' + width);
    if (isNaN(height)) return errorOut('height is not a number: ' + height);
    if (!!patternName && 'string' !== typeof patternName)
      return errorOut('pattern name must be a string');
    return options;
  };

  const _importPattern = parent => {
    // console.log('importPattern()'); return;
    const { pattern: patternName } = parent;

    const { width, height } = parent;
    const pattern = patterns[patternName];
    const patternWidth = pattern[0].length;
    const patternHeight = pattern.length;
    const widthDiff = width - patternWidth;
    const paddingLeft = Math.floor(widthDiff / 2);
    const paddingRight = widthDiff - paddingLeft;
    const heightDiff = height - patternHeight;
    const paddingTop = Math.floor(heightDiff / 2);
    const paddingBottom = heightDiff - paddingTop;

    pattern.forEach(row => {
      for (let i = 0; i < paddingLeft; i++) row.unshift(0);
      for (let i = 0; i < paddingRight; i++) row.push(0);
    });

    const verticalPadding = new Array(width).fill(0, 0, width);
    for (let i = 0; i < paddingTop; i++) pattern.unshift(verticalPadding);
    for (let i = 0; i < paddingBottom; i++) pattern.push(verticalPadding);

    const patternClass = patterns[patternName].map((row, i) =>
      row.map(
        (cell, j) =>
          (cell = parent.setCell(i, j, new Cell(parent, i, j, Boolean(cell))))
      )
    );
    if (!pattern) return null;
    return {
      ...parent,
      grid: patternClass,
      patternName,
    };
  };

  // private properties
  const _grid = new WeakMap();
  const _options = new WeakMap();
  const _pattern = new WeakMap();
  const _parent = new WeakMap();

  class Grid {
    constructor(options, game) {
      const opts = _checkOptions(options);
      if (opts.error) throw new Error(opts.errorMessage);
      if (opts.patternName) _pattern.set(this, opts.patternName);
      _parent.set(this, game);
      _options.set(this, opts);
      _grid.set(this, _make2DArray(_options.get(this)));
    }

    get width() {
      return _options.get(this).width;
    }

    get height() {
      return _options.get(this).height;
    }

    get pattern() {
      return _pattern.get(this);
    }

    get grid() {
      return _grid.get(this);
    }

    get parent() {
      return _parent.get(this);
    }

    setCell(i, j, cell) {
      _grid.get(this)[i][j] = cell;
    }

    init() {
      if (!!_options.get(this).patternName) return _importPattern(this);
      const grid = _grid.get(this);
      grid.forEach((row, i) =>
        row.forEach((_, j) =>
          // (obj.grid[i][j] = aliveOrDead[Math.floor(Math.random() + 0.5)])
          this.setCell(
            i,
            j,
            new Cell(this, i, j, !!Math.floor(Math.random() + 0.5))
          )
        )
      );
      return this;
    }

    nextGen() {
      const grid = _grid.get(this);

      const nextGrid = new Grid(_options.get(this), this.parent);

      grid.forEach((row, i) =>
        row.forEach((cell, j) => {
          nextGrid.setCell(
            i,
            j,
            new Cell(nextGrid, i, j, cell.getNewIsAlive())
          );
        })
      );

      if (JSON.stringify(grid) === JSON.stringify(nextGrid.grid)) {
        return null;
      }

      return nextGrid;
    }
  }

  return Grid;
})();
