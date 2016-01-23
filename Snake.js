// board is double array
// snake is a list w/head and tail

var snake = [[1, 0], [0, 0]]; // x, y
var dir = 'right';
var board = [];     // top left is 0, 0, bottom right is height-1, width-1
var food = [-1, -1];
var refreshRate = 300; // How quickly the snake moves. (ms)
var intervalId = null;

// initialize board and snake, and start snake movement
function initSnake() {
  if (intervalId !== null) {
    return;
  }
  board.length = width; // board[x][y]
  for (var i = 0; i < width; i++) {
    board[i] = [];
    board[i].length = height;
  }
  intervalId = window.setInterval(aiLevel0, refreshRate);
  aiLevel0();
  updateBoard();
}

function speedUp() {
  refreshRate /= 1.5; // 50% faster
  window.clearInterval(intervalId);
  intervalId = window.setInterval(aiLevel0, refreshRate);
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
  var newHead = snake[0];
  if (dir == 'right') {
    if (newHead[0] == width - 1) {
      throw 'cannot move right from' + newHead[0] + ', ' + newHead[1];
    }
    newHead[0]++;
  } else if (dir == 'left') {
    if (newHead[0] === 0) {
      throw 'cannot move left from' + newHead[0] + ', ' + newHead[1];
    }
    newHead[0]--;
  } else if (dir == 'up') {  // add new head above current one
    if (newHead[1] === 0) {
      throw 'cannot move up from ' + newHead[0] + ', ' + newHead[1];
    }
    newHead[1]--;  // changes y-coordinate by -1 (going UP)
  } else if (dir == 'down') {
    if (newHead[1] == height - 1) {
      throw 'cannot move down from ' + newHead[0] + ', ' + newHead[1];
    }
    newHead[1]++;
  }
  console.log("Before unshift:");
  for (var s=0; s<snake.length; s++) {
    console.log(s[0], s[1]);
  }
  snake.unshift(newHead); // add newHead to the beginning of the list
  console.log("After unshift:");
  for (var s=0; s<snake.length; s++) {
    console.log(s[0], s[1]);
  }
  if (snake[0][0] == food[0] && snake[0][1] == food[1]) { // if snake's head is on the food
    food = [-1, -1];
  } else {
    delTail();
  }
  updateBoard();
}

function delTail() {  // simple function to remove the tail
  console.log(snake.pop());
}

function placeFood(x, y) {
  initSnake();
  if (inSnake(x+'_'+y)) {
    console.log('Invalid food placement: Food collides with snake');
    return;
  }
  if (!(food[0] == -1 && food[1] == -1)) { // already food
    console.log('Invalid food placement: There is already food');
  } else if (x >= width || y >= height || x < 0 || y < 0) { // off of board
    console.log('Invalid food placement: Food is off board');
  } else {
    food = [x, y];
    console.log('Food placed at '+x+' '+y);
    updateBoard();
  }
}
