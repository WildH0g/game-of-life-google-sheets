// jshint esversion: 9
// jshint laxbreak: true

const onOpen = e =>
  SpreadsheetApp.getUi()
    .createMenu('Game of Life')
    .addItem('Start', 'choosePattern')
    .addToUi();

class Range {
  constructor(grid) {
    if (Range.instance) {
      return Range.instance;
    }

    this.range = SpreadsheetApp.getActive()
      .getActiveSheet()
      .getRange(1, 1, grid.length, grid[0].length);

    Range.instance = this.range;
    return Range.instance;
  }
}

const _render = grid => {
  const alive = '#4A0A77';
  const dead = '#AB51E3';
  grid = grid.map(row => row.map(cell => (cell.isAlive ? alive : dead)));
  const range = new Range(grid);
  range.setBackgrounds(grid);
  SpreadsheetApp.flush();
};

const start = patternName => {
  new GameOfLife(_render, {
    width: 25,
    height: 25,
    patternName: !!patternName ? patternName : undefined,
    frameMs: 200,
    numIterations: 200,
  }).play();
};

const choosePattern = () => {
  const html = HtmlService.createTemplateFromFile('pattern-selector');
  html.patterns - patterns;
  SpreadsheetApp.getUi().showSidebar(html.evaluate());
};
