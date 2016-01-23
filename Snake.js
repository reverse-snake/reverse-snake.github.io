// board is double array
// snake is a list w/head and tail

// initialize board and snake, and start snake movement
function init(height, width) {
  var board = [];     // top left is 0, 0, bottom right is max, max
  board.length = height;
  for (var i = 0; i < height; i++) {
    board[i] = [];
    board[i].length = width;
  }
  // initial values for snake
  var snake = [[0, 0]]; // x, y
  var dir = 'right';
  var food = [-1, -1];
  idleRight();
}

// idle functions - snake goes clockwise by default
// go right, checking for food along the way
// go down when right wall is reached; top is ignored
function idleRight() {
  // checks if it is at the right wall or above the food (same x-coords, different y-coords)
  if (snake[0][0] >= width - 1 || (snake[0][0] == food[0] && snake[0][1] != food[1])) {
    idleDown(); // this could miss some food appearance, but that is OK because it is stupid
  } else {
    moveHead('right');
    delTail();
    idleRight();
  }
}

// go down blindly until the bottom wall is reached, then go left
function idleDown() {
  if (snake[0][1] >= height - 1) {  // checks if it is at the bottom wall
    idleLeft();
  } else {
    moveHead('down');
    delTail();
    idleDown();
  }
}

// go to the left blindly until the left wall is reached, then go up
function idleLeft() {
  if (snake[0][0] <= 0) {
    idleUp();
  } else {
    moveHead('left');
    delTail();
    idleDown();
  }
}

// go up, checking for food along the way
// if top side is reached, go right; left side is ignored
function idleUp() {
  // checks if it is at the top wall or to the left of the food (same y-coords, different x-coords)
  if (snake[0][1] <= 0 || (snake[0][1] == food[1] && snake[0][0] != food[0])) {
    idleRight();
  } else {
    moveHead('up');
    delTail();
    idleUp();
  }
}

function moveHead(dir) {
  // move snake's head in given direction
  // 'right', 'left', 'up', and 'down'
  var newHead = snake[0];
  if (dir == 'up') {  // add new head above current one
    newHead[1]--;  // changes y-coordinate by -1 (going UP)
  } else if (dir == 'down') {
    newHead[1]++;
  } else if (dir == 'right') {
    newHead[0]++;
  } else if (dir == 'left') {
    newHead[0]--;
  } else {  // there is an error
    // some error should happen
  }
  snake.unshift(newHead); // add newHead to the beginning of the list
  updateBoard(snake);
  if (snake[0] == food) { // if snake's head is on the food
    food = [-1, -1];
  } else {
    delTail();
  }
}

function delTail() {  // simple function to remove the tail
  snake.pop();
  updateBoard(snake);
}

function placeFood(x, y) {
  newFood = [x, y];
  if (food != [-1, -1]) { // already food
    console.log("Invalid food placement: There is already food");
    return false;
  } else if (x >= width || y >= height || x < 0 || y < 0) { // off of board
    console.log("Invalid food placement: Food is off board");
    return false;
  } else if (snake.includes(newFood)) {   // new food collides with snake
    console.log("Invalid food placement: Food collides with snake");
    return false;
  } else {
    food = newFood;
    return true;
  }
}
