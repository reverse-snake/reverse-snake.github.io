// Contains functions and variables used in the initiation of the game and game state.

var refreshButton = document.getElementsByClassName("refresh")[0];
var upButton = document.getElementsByClassName("upButton")[0];
var levelGauge = document.getElementsByClassName("level")[0];
var downButton = document.getElementsByClassName("downButton")[0];

var refreshRate = 250; // How quickly the snake moves. (ms)
var intervalId; // Used to repeatedly call ai(level) and to stop calling same.
var gameIsStopped = true;
var highscores;

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
  return (
    time[0]
    + ':'
    + (time[1]<10?'0':'')
    + time[1]
    + '.'
    + (time[2]<100?'0':'')
    + (time[2]<10?'0':'')
    + time[2]);
}

function getScores() {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://reverse-snake.cloudant.com/highscores/highscores', true); // METHOD, url, async
  req.onload = function() { // Asynchronous callback.
    highscores = JSON.parse(req.responseText);
    for (var i=0; i<5; i++) {
      document.getElementsByClassName("score"+i)[0].innerHTML = highscores["data"]["scores"][i];
      var time = highscores["data"]["times"][i];
      document.getElementsByClassName("time"+i)[0].innerHTML = formatTime(time);
    }
  }
  req.send();
}

getScores();

// Assume our scores are up-to-date. It should be possible to check for conflict by reading the response. I'll deal with this some other time.
function checkHighscore(kind, value, level) {
  if (kind == 'SCORE') {
    if (value < highscores["data"]["scores"][level]) {
      console.log("New highscore for level "+level+": "+value);
      highscores["data"]["scores"][level] = value;
      return true;
    }
  } else if (kind == 'TIME') {
    var newHighscore = false;
    if (value[0] < highscores["data"]["times"][level][0]) {
      newHighscore = true;
    } else if (value[0] == highscores["data"]["times"][level][0]) {
      if (value[1] < highscores["data"]["times"][level][1]) {
        newHighscore = true;
      } else if (value[1] == highscores["data"]["times"][level][1]) {
        if (value[2] < highscores["data"]["times"][level][2]) {
          newHighscore = true;
        }
      }
    }
    if (newHighscore) {
      console.log("New best time for level "+level+": "+formatTime(value));
      highscores["data"]["times"][level] = value;
      return true;
    }
  }
  return false;
}

function uploadHighscores() {
  var req = new XMLHttpRequest();
  req.open('PUT', 'http://reverse-snake.cloudant.com/highscores/highscores', true); // METHOD, url, async
  req.onload = function() { // Asynchronous callback.
    console.log(req.responseText);
  }
  req.setRequestHeader('Content-Type', 'application/json');
  console.log("Sending scores...");
  req.send(highscores);
}

// Clears board & stops AI
function stopGame() {
  console.log("Round ended! Advancing AI to level "+ (level + 1));
  getScores();
  var now = new Date();
  stopTime = [now.getMinutes(), now.getSeconds(), now.getMilliseconds()];
  var time = [0, 0, 0]
  time[0] = (stopTime[0] - startTime[0] + 60) % 60;
  time[1] = (stopTime[1] - startTime[1] + 60) % 60;
  time[2] = (stopTime[2] - startTime[2] + 1000) % 1000;
  console.log("Uploading scores...");
  if (checkHighscore('TIME', time, level) | checkHighscore('SCORE', score, level)) {
    uploadHighscores();
  }
  console.log("Scores uploaded");
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
  startTime = [now.getMinutes(), now.getSeconds(), now.getMilliseconds()];
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
