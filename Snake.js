// Variables
var snake = [[2, 0], [1, 0], [0, 0]]; // An array of [x, y] pairs. The head is at [0], tail is at [-1].
// At level 0, the snake has 3 elements. Each level, it gains 1 starting element.
var board; // top left is 0, 0, bottom right is height-1, width-1
var food = [-10, -10];  // if there is no food, use this to avoid null pointers
// Settings
var refreshRate = 250; // How quickly the snake moves. (ms)
var intervalId;
var gameIsStopped = true;
var level = 0;
var maxLevel = 4; // Starting max level
// high scores (both time- and food-based) for each level
//var timeHighScores = [];
//var pelletHighScores = [0, 0, 0, 0, 0];
//var currentTimeScore = 0;
// HTML elements
var refreshButton = document.getElementsByClassName("refresh")[0];
var upButton = document.getElementsByClassName("upButton")[0];
var levelGauge = document.getElementsByClassName("level")[0];
var downButton = document.getElementsByClassName("downButton")[0];
var highscores;
var score = document.getElementsByClassName("score")[0];
var time = document.getElementsByClassName("time")[0];
var startTime = [];
var stopTime = [];
// score.innerHTML = (snake.length - level - 2);

if (document.cookie !== null) {
  cookies = document.cookie.split(';');
  for (var c=0; c<cookies.length; c++) {
    var cookie = cookies[c].split('=');
    if (cookie[0] == 'speed') {
      var speed = parseInt(cookie[1]);
      var speedSlider = document.getElementById('speedSlider');
      speedSlider.value = speed;
      showValue(speedSlider);
    }
  }
}

// Takes a time array as [minutes, seconds, milliseconds] and returns a zero-padded MM:SS.msss
function formatTime(time) {
  return
    time[0]
    + ':'
    + (time[1]<10?'0':'')
    + time[1]
    + '.'
    + (time[2]<1000?'0':'')
    + (time[2]<100?'0':'')
    + (time[2]<10?'0':'')
    + time[2];
}

function getScores() {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://reverse-snake.cloudant.com/highscores/highscores', true); // METHOD, url, async
  req.onload = function() { // Asynchronous callback.
    highscores = JSON.parse(req.responseText)["data"];
    for (var i=0; i<5; i++) {
      document.getElementsByClassName("score"+i)[0].innerHTML = highscores["scores"][i];
      var time = highscores["times"][i];
      var timeString;
      if (time[0] > 0) {
        if (time[1] > 10) {
          timeString = time[0]+":"+time[1];
        } else {
          timeString = time[0]+":0"+time[1];
        }
      } else {
        timeString = ""+time[1];
      }
      document.getElementsByClassName("time"+i)[0].innerHTML = timeString;
      checkHighscore();
    }
  }
  req.send();
}

// Assume our scores are up-to-date, since this should only be called from getScores() above.
function checkHighscore() {
  if (score.innerHTML < highscores["scores"][level]) {
    console.log("New highscore", score.innerHTML);
  }
  if (time.innerHTML < highscores["scores"][level]) {
    console.log("New highscore", score.innerHTML);
  }
  return;
  var req = new XMLHttpRequest();
  req.open('PUT', 'http://reverse-snake.cloudant.com/highscores/highscores', true); // METHOD, url, async
  req.onload = function() { // Asynchronous callback.
    console.log(req.responseText);
  }
  req.send("{\"data\":{\"scores\":"+scores+",\"times\":"+times+"}}");
}

// Clears board & stops AI
function stopGame() {
  console.log("Round ended! Advancing AI to level", level);
  var now = new Date();
  stopTime = [now.getMinutes(), now.getSeconds()];
  maxLevel++;
  upLevel();
  refreshButton.disabled = true;
  resetGame();
}

function resetGame() {
  console.log("Game reset");
  startTime = [];
  stopTime = [];
  followLeftEdge = false;
  moves = [];
  window.clearInterval(intervalId);
  upButton.disabled = (level == maxLevel || level == 4);
  downButton.disabled = (level === 0);
  gameIsStopped = true;
  board = []; // board[x][y]
  board.length = width;
  for (var i = 0; i < width; i++) {
    board[i] = [];
    board[i].length = height;
  }
  food = [-10, -10];
  snake = [];
  for (var i=0; i<level+3; i++) {
    snake.unshift([i, 0]);
  }
  dir = 'right';
  updateBoard();
  if (level == 5) {
    showVictory();
  }
}

function startGame() {
  if (!gameIsStopped) {
    return;
  }
  console.log("Game started");
  var now = new Date();
  startTime = [now.getMinutes(), now.getSeconds()]
  refreshButton.disabled = false;
  upButton.disabled = true;
  downButton.disabled = true;
  // document.cookie = 'speed='+refreshRate+'; maxLevel='+maxLevel;
  gameIsStopped = false;
  intervalId = window.setInterval(ai, refreshRate, level); // calls ai(level) at refreshRate
  ai(level);
}

function changeSpeed(rate) {
  refreshRate = rate; // set to new value
  window.clearInterval(intervalId);
  if (!gameIsStopped) { // ensures only one interval going on at once
    intervalId = window.setInterval(ai, refreshRate, level); // calls ai(level) at refreshRate
    ai(level);
  }
}

function debugSnake() {
  for (var s=0; s<snake.length; s++) {
    console.log(snake[s][0], snake[s][1]);
  }
}

// String is of form x_y to allow compatibility with Board.js
function inSnakeTwice(string) {
  var count = 0;
  for (var s=0; s<snake.length; s++) {
    if (string == snake[s][0]+'_'+snake[s][1]) {
      count++;
    }
  }
  return count==2;
}

// String is of form x_y to allow compatibility with Board.js
function inSnake(string) {
  for (var s=0; s<snake.length; s++) {
    if (string == snake[s][0]+'_'+snake[s][1]) {
      return true;
    }
  }
  return false;
}

// String is of form x_y to allow compatibility with Board.js
function getSnakeIndex(string) {
  for (var s=0; s<snake.length; s++) {
    if (string == snake[s][0]+'_'+snake[s][1]) {
      return s;
    }
  }
  return -1;  // not in snake
}

function moveHead(dir) {
  //pelletHighScores[level] = snake.length - snake.level - 2;
  // move snake's head in given direction
  // 'right', 'left', 'up', and 'down'
  var newHead = snake[0].slice(0); // Clone so we don't move the head by accident.
  if (dir == 'right') {
    if (newHead[0] == width - 1) {
      throw 'cannot move right from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake((newHead[0]+1)+'_'+newHead[1])) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 20*refreshRate);
    }
    newHead[0]++;
  } else if (dir == 'left') {
    if (newHead[0] === 0) {
      throw 'cannot move left from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake((newHead[0]-1)+'_'+newHead[1])) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 20*refreshRate);
    }
    newHead[0]--;
  } else if (dir == 'up') {  // add new head above current one
    if (newHead[1] === 0) {
      throw 'cannot move up from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake(newHead[0]+'_'+(newHead[1]-1))) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 20*refreshRate);
    }
    newHead[1]--;  // changes y-coordinate by -1 (going UP)
  } else if (dir == 'down') {
    if (newHead[1] == height - 1) {
      throw 'cannot move down from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake(newHead[0]+'_'+(newHead[1]+1))) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 20*refreshRate);
    }
    newHead[1]++;
  }
  snake.unshift(newHead); // add newHead to the beginning of the list
  if (snake[0][0] == food[0] && snake[0][1] == food[1]) { // if snake's head is on the food
  food = [-10, -10];
} else {
  snake.pop(); // Remove the tail
}
updateBoard();
}

function placeFood(x, y) {
  startGame();
  if (inSnake(x+'_'+y)) {
    console.log('Invalid food placement: Food collides with snake');
  } else if (x >= width || y >= height || x < 0 || y < 0) {
    console.log('Invalid food placement: Food is off board');
  } else {
    food = [x, y];
    updateBoard();
  }
}
