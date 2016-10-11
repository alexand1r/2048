var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');


var sizeInput = document.getElementById("size");
var changeSize = document.getElementById("change-size");
var newGame = document.getElementById("button-container");
var scoreLabel = document.getElementById("score");
var bestScoreLabel = document.getElementById("best-score");
var undosLabel = document.getElementById("undos");

var score = 0;
var bestScore = localStorage.getItem('scoreArrayBest') ? Number(localStorage.getItem('scoreArrayBest')) : 0;
bestScoreLabel.innerHTML = bestScore;

var size = 4;
var width = canvas.width / size - 6;
var undos;
var states;
var scoreArray = localStorage.getItem('scoreArray') ? localStorage.getItem('scoreArray').split(',').map(Number) : [];

var cells = [];
var fontSize;
var canLeft = true;
var canRight = true;
var canUp = true;
var canDown = true;
var end = false;
var str = '';
var strPosition = 0;

startGame();


newGame.onclick = function () {
  canvasClean();
  startGame();
  end = false;
  canvas.style.opacity = "1";
  score = 0;
  scoreLabel.innerHTML = score;
  canLeft = true;
  canRight = true;
  canUp = true;
  canDown = true;
    let id="the-important-button";
    var e = document.getElementById(id);
    e.style.display = 'none';

}

changeSize.onclick = function () {
  if (sizeInput.value >= 2 && sizeInput.value <= 20) {
    size = sizeInput.value;
    width = canvas.width / size - 6;
    console.log(sizeInput.value);
    canvasClean();
    startGame();
    end = false;
    canvas.style.opacity = "1";
    score = 0;
    scoreLabel.innerHTML = score;
    if(score > bestScore)
      bestScore = score;
    canLeft = true;
    canRight = true;
    canUp = true;
    canDown = true;
      let id="the-important-button";
      var e = document.getElementById(id);
      e.style.display = 'none';

  }
}
function showButton() {
    let id="the-important-button";
    var e = document.getElementById(id);
    if (e.style.display !== 'none') {
        e.style.display = 'none';
    }
    else {
        e.style.display = 'block';
    }
}

function  tryNewGame () {
    canvasClean();
    startGame();
    end = false;
    canvas.style.opacity = "1";
    score = 0;
    scoreLabel.innerHTML = score;
    canLeft = true;
    canRight = true;
    canUp = true;
    canDown = true;
   showButton();

}

function cell(row, coll) {
  this.value = 0;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

function createCells() {
  for (var i = 0; i < size; i++) {
    cells[i] = [];
    for (var j = 0; j < size; j++) {
      cells[i][j] = new cell(i, j);
    }
  }
}

function initUndos() {
  undos = 6;
  undosLabel.innerText = undos;
  states = [];
}

function saveState() {
  if (undos == 0)
    return;
  var state = [];
  for (var i = 0; i < size; i++) {
    state[i] = [];
    for (var j = 0; j < size; j++) {
      state[i][j] = cells[i][j].value;
    }
  }
  while (states.length >= undos) {
    states.shift();
  }
  states.push({ score: score, values: state });
}

function undo() {
  if (undos == 0 || states.length == 0)
    return;
  var state = states.pop();
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      cells[i][j].value = state.values[i][j];
    }
  }
  score = state.score;
  undos--;
  undosLabel.innerText = undos;
  canvasClean();
  drawAllCells();
}

function drawCell(cell) {
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, width, width);

  switch (cell.value){
    case 0 : ctx.fillStyle = "rgba(238, 228, 218, 0.35)"; break;
    case 2 : ctx.fillStyle = "#eee4da"; break;
    case 4 : ctx.fillStyle = "#ede0c8"; break;
    case 8 : ctx.fillStyle = "#f2b179"; break;
    case 16 : ctx.fillStyle = "#f59563"; break;
    case 32 : ctx.fillStyle = "#f67c5f"; break;
    case 64 : ctx.fillStyle = "#f65e3b"; break;
    case 128 : ctx.fillStyle = "#edcf72"; break;
    case 256 : ctx.fillStyle = "#edcc61"; break;
    case 512 : ctx.fillStyle = "#edc850"; break;
    case 1024 : ctx.fillStyle = "#edc53f"; break;
    case 2048 : ctx.fillStyle = "#edc22e"; break;
    case 4096 : ctx.fillStyle = "#edc11f"; break;
    default : ctx.fillStyle = "#ff0080";
  }

  ctx.fill();

  if (cell.value) {
    fontSize = width/2 - 6;
    ctx.font = "bold " + fontSize + "px Arial";
    if (cell.value == 2 || cell.value == 4)
      ctx.fillStyle = '#776e65';
    else
      ctx.fillStyle = 'white';
    ctx.textAlign = "center";
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
  }
}

function canvasClean() {
  ctx.clearRect(0, 0, 500, 500);
}

window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1){
      e.preventDefault();
    }
}, false);

document.onkeydown = function (event) {
  if (!end) {
    if (event.keyCode == 38 || event.keyCode == 87) moveUp();
    else if (event.keyCode == 39 || event.keyCode == 68) moveRight();
    else if (event.keyCode == 40 || event.keyCode == 83) moveDown();
    else if (event.keyCode == 37 || event.keyCode == 65) moveLeft();
    else if (event.keyCode == 90) undo();
    scoreLabel.innerHTML = score;
    bestScoreLabel.innerHTML = bestScore;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (cells[i][j].value == 2048) {
                end = true;
                strPosition = (width / 2) * size + 10;
                str = 'You Win';
                finishGame();
            }
        }
    }
  }
}

function startGame() {
  createCells();
  drawAllCells();
  pasteNewCell();
  pasteNewCell();
  initUndos();
}

function finishGame() {
    scoreArray.push(score);
    scoreArray.sort((a, b) => b - a);
    console.log(scoreArray);
    let sessionArray = scoreArray;
    localStorage.setItem('scoreArray', sessionArray);
    let best = sessionArray.shift();
    localStorage.setItem('scoreArrayBest', best);
    scoreArray.unshift(best);
    console.log(scoreArray);
    canvas.style.opacity = "0.4";
    if (end) {
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        ctx.fillText(str, strPosition, strPosition - size * 30);
        for (let score = 0; score < scoreArray.length; score++) {
            if (score == 0 && scoreArray[0]) {
                ctx.fillText('Best  ' + scoreArray[score], strPosition, strPosition - size * 9);
            }
            if (score == 1 && scoreArray[1]) {
                ctx.fillText('Second  ' + scoreArray[score], strPosition, strPosition + size * 7);
            }
            if (score == 2 && scoreArray[2]) {
                ctx.fillText('Third  ' + scoreArray[score], strPosition, strPosition + size * 23);
            }
        }

    }
}

function drawAllCells() {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      drawCell(cells[i][j]);
    }
  }
}

function pasteNewCell() {
  var countFree = 0;
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (!cells[i][j].value) {
        countFree++;
      }
    }
  }
  if (!countFree){
    if((canDown==false && canRight==false) || (canDown==false && canLeft==false)||(canUp==false && canLeft==false)||(canUp==false &&canRight==false)) {
      end = true;
      strPosition = (width / 2) * size + 10;
      str = 'Game Over';
        showButton();
      finishGame();
    }
    return;
  }

  while (true) {
    canvasClean();
    var row = Math.floor(Math.random() * size);
    var coll = Math.floor(Math.random() * size);
    if (!cells[row][coll].value) {
      cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
      drawAllCells();
      return;
    }
  }
}

function moveRight () {
    saveState();

    for (var i = 0; i < size; i++) {
        for (var j = size - 2; j >= 0; j--) {
            if (cells[i][j].value) {
                var coll = j;
                while (coll + 1 < size) {
                    if (!cells[i][coll + 1].value) {
                        cells[i][coll + 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll++;
                        canRight = true;
                        canLeft=true;
                        canUp=true;
                        canDown=true;
                    }
                    else if (cells[i][coll].value == cells[i][coll + 1].value) {
                        cells[i][coll + 1].value *= 2;
                        score += cells[i][coll + 1].value;
                        if (score >= bestScore)
                            bestScore = score;
                        cells[i][coll].value = 0;
                        canRight = true;
                        canLeft=true;
                        canUp=true;
                        canDown=true;
                        break;
                    }
                    else {
                        canRight = false;
                        break;
                    }

                }
            }
        }
    }
    pasteNewCell();
}

function moveLeft() {
    saveState();


    for (var i = 0; i < size; i++) {
        for (var j = 1; j < size; j++) {
            if (cells[i][j].value) {
                var coll = j;
                while (coll - 1 >= 0) {
                    if (!cells[i][coll - 1].value) {
                        cells[i][coll - 1].value = cells[i][coll].value;
                        cells[i][coll].value = 0;
                        coll--;
                        canLeft = true;
                        canRight = true;
                        canUp = true;
                        canDown = true;
                    }
                    else if (cells[i][coll].value == cells[i][coll - 1].value) {
                        cells[i][coll - 1].value *= 2;
                        score += cells[i][coll - 1].value;
                        if (score >= bestScore)
                            bestScore = score;
                        cells[i][coll].value = 0;
                        canLeft = true;
                        canRight = true;
                        canUp = true;
                        canDown = true;
                        break;
                    }
                    else {
                        canLeft = false;
                        break;
                    }

                }
            }
        }
    }
    pasteNewCell();
}

function moveUp() {
    saveState();

    for (var j = 0; j < size; j++) {
        for (var i = 1; i < size; i++) {
            if (cells[i][j].value) {
                var row = i;
                while (row > 0) {
                    if (!cells[row - 1][j].value) {
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row--;
                        canUp = true;
                        canLeft = true;
                        canRight = true;
                        canDown = true;
                    }
                    else if (cells[row][j].value == cells[row - 1][j].value) {
                        cells[row - 1][j].value *= 2;
                        score += cells[row - 1][j].value;
                        if (score >= bestScore)
                            bestScore = score;
                        cells[row][j].value = 0;
                        canUp = true;
                        canLeft = true;
                        canRight = true;
                        canDown = true;
                        break;
                    }
                    else {
                        canUp = false;
                        break;
                    }

                }
            }
        }
    }
    pasteNewCell();
}

function moveDown() {


    saveState();
    for (var j = 0; j < size; j++) {
        for (var i = size - 2; i >= 0; i--) {
            if (cells[i][j].value) {
                var row = i;
                while (row + 1 < size) {
                    if (!cells[row + 1][j].value) {
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
                        canDown = true;
                        canLeft = true;
                        canRight = true;
                        canUp = true;
                    }
                    else if (cells[row][j].value == cells[row + 1][j].value) {
                        cells[row + 1][j].value *= 2;
                        score += cells[row + 1][j].value;
                        if (score >= bestScore)
                            bestScore = score;
                        cells[row][j].value = 0;
                        canDown = true;
                        canLeft = true;
                        canRight = true;
                        canUp = true;
                        break;
                    }
                    else{
                        canDown = false;
                        break;
                    }

                }
            }
        }
    }
    pasteNewCell();
}
