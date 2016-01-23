// board is double array
// snake is a list w/head and tail

// initialize board
var board = [];     // top left is 0, 0, bottom right is max, max
var length = 10;  // default values for length and width
var width = 10;   // will be determined by HTML
board.length = length;
for (var i = 0; i < length; i++) {
  board[i] = [];
  board[i].length = width;
}

// initial values for snake
var snake = [[1, 1]]; // x, y
var dir = 'right';

// idle functions (if there are no food bits)
// go right until right wall is reached, then go down
function idleRight() {
  if (snake[0][0] >= board.length - 1) {  // checks if it is at the right wall
    idleDown();
  } else {
    moveHead('right');
    delTail();
  }
}

// go down until collision
function idleDown() {
  if (snake[0][1] >= board.length - 1) {  // checks if it is at the bottom wall
    idleLeft();
  } else {
    moveHead('down');
    delTail();
  }
}



function moveHead(dir) {
  // move snake's head in given direction
  // 'right', 'left', 'up', and 'down'
  var newHead = snake[0];
  if (dir == 'up') {  // add new head above current one
    newhead[1]--;  // changes y-coordinate by -1 (going UP)
  } else if (dir == 'down') {
    newhead[1]++;
  } else if (dir == 'right') {
    newhead[0]++;
  } else if (dir == 'left') {
    newhead[0]--;
  } else {  // there is an error
    // some error should happen
  }
  snake.unshift(newHead); // add newHead to the beginning of the list
  // don't remove tail here, because sometimes you may not want to (handled elsewhere)
}

function delTail() {  // simple function to remove the tail
  snake.pop();
}
