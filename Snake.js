var isMobile = false;
var snake = [[1, 0], [0, 0]]; // An array of [x, y] pairs. The head is at [0], tail is at [-1].
var board; // top left is 0, 0, bottom right is height-1, width-1
var food = [-10, -10];  // if there is no food, use this to avoid null pointers
var refreshRate = 250; // How quickly the snake moves. (ms)
var intervalId;
var gameIsStopped = true;
// high scores (both time- and food-based) for each level
var timeHighScores = [];
var pelletHighScores = [];
var currentTimeScore = 0;

document.cookie = null;
if (document.cookie !== null) {
  console.log(document.cookie);
  cookies = document.cookie.split(';');
  for (var c=0; c<cookies.length; c++) {
    var cookie = cookies[c].split('=');
    console.log(cookie);
    if (cookie[0] == 'speed') {
      var speed = parseInt(cookie[1]);
      var speedSlider = document.getElementById('speedSlider');
      speedSlider.value = speed;
      showValue(speedSlider);
    } else if (cookie[0] == 'highest') {
      maxLevel = cookie[1];
    }
  }
}

// Clears board & stops AI
function stopGame() {
  if ((snake.length - snake.level) > pelletHighScores[level]) {
    pelletHighScores[level] = snake.length - snake.level;
  }
  console.log("Game stopped");
  gameIsStopped = true;
  upLevel();
  board = [];
  board.length = width; // board[x][y]
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
}

// Snake collided with self, start next AI level
function startGame() {
  if (!gameIsStopped) {
    return;
  }
  document.cookie = 'speed='+refreshRate+'; highest='+maxLevel;
  console.log('speed='+refreshRate+'; highest='+maxLevel);
  console.log(document.cookie);
  gameIsStopped = false;
  console.log("Game started");
  console.log("Round ended! Advancing to AI level", level);
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

function moveHead(dir) {
  // move snake's head in given direction
  // 'right', 'left', 'up', and 'down'
  var newHead = snake[0].slice(0); // Clone so we don't move the head by accident.
  if (dir == 'right') {
    if (newHead[0] == width - 1) {
      throw 'cannot move right from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake((newHead[0]+1)+'_'+newHead[1])) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 10*refreshRate
);
    }
    newHead[0]++;
  } else if (dir == 'left') {
    if (newHead[0] === 0) {
      throw 'cannot move left from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake((newHead[0]-1)+'_'+newHead[1])) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 10*refreshRate
);
    }
    newHead[0]--;
  } else if (dir == 'up') {  // add new head above current one
    if (newHead[1] === 0) {
      throw 'cannot move up from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake(newHead[0]+'_'+(newHead[1]-1))) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 10*refreshRate
);
    }
    newHead[1]--;  // changes y-coordinate by -1 (going UP)
  } else if (dir == 'down') {
    if (newHead[1] == height - 1) {
      throw 'cannot move down from ' + newHead[0] + ', ' + newHead[1];
    } else if (inSnake(newHead[0]+'_'+(newHead[1]+1))) {
      window.clearInterval(intervalId);
      window.setTimeout(stopGame, 10*refreshRate
);
    }
    newHead[1]++;
  }
  snake.unshift(newHead); // add newHead to the beginning of the list
  if (snake[0][0] == food[0] && snake[0][1] == food[1]) { // if snake's head is on the food
  food = [-10, -10];
} else {
  delTail();
}
updateBoard();
}

function delTail() {  // simple function to remove the tail
  snake.pop();
}

function placeFood(x, y) {
  startGame();
  if (inSnake(x+'_'+y)) {
    console.log('Invalid food placement: Food collides with snake');
  } else if (x >= width || y >= height || x < 0 || y < 0) { // off of board
    console.log('Invalid food placement: Food is off board');
  } else {
    food = [x, y];
    updateBoard();
  }
}
