// board is double array
// snake is a list w/head and tail

snake = [[1, 0], [0, 0]]; // x, y
dir = 'right';
var board = [];     // top left is 0, 0, bottom right is height-1, width-1
var food = [-1, -1];
var refreshRate = 500; // How quickly the snake moves. (ms)
var intervalId;

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

function aiLevel0() {
  moveHead(dir);
  if (dir == 'right' || dir == 'left') {
    if (snake[0][0] == food[0]) {   // is the snake above or below the food?
      if (snake[0][1] < food[1]) {
        dir = 'down';
      } else {
        dir = 'up';
      }
    } else if ((snake[0][0] == width - 1) && dir == 'right') { // is the snake at the right wall
  		dir = 'down';
  	} else if ((snake[0][0] === 0) && dir == 'left') {  // is the snake at the left wall?
  		dir = 'up';
  	}
  } else if (dir == 'up' || dir == 'down') {
    if (snake[0][1] == food[1]) {   // is the snake to the right or left of the food?
      if (snake[0][0] < food[0]) {
        dir = 'right';
      } else {
        dir = 'left';
      }
    } else if ((snake[0][1] === 0) && dir == 'up') { // is the snake at the top wall
  		dir = 'right';
    } else if (snake[0][1] == height - 1 && dir == 'down') {  // is the snake at the bottom wall?
  		dir = 'left';
  	} // else dir is unchanged
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
  }
//  if (newHead[0] < 0 || newHead[0] >= width || newHead[1] < 0 || newHead[1] >= height) {

//  }
  snake.unshift(newHead); // add newHead to the beginning of the list
  console.log(snake);
  updateBoard();
  if (snake[0] == food) { // if snake's head is on the food
    food = [-1, -1];
  } else {
    delTail();
  }
}

function delTail() {  // simple function to remove the tail
  console.log(snake.pop());
  updateBoard();
}

function placeFood(x, y) {
  initSnake();
  for (var s=0; s<snake.length; s++) {
		if (x == snake[s][0] && y == snake[s][1]) {
      console.log("Invalid food placement: Food collides with snake");
			return;
		}
	}
	if (food != [-1, -1]) { // already food
		console.log("Invalid food placement: There is already food");
	} else if (x >= width || y >= height || x < 0 || y < 0) { // off of board
		console.log("Invalid food placement: Food is off board");
	} else {
		food = [x, y];
		console.log("Food placed at "+x+" "+y);
    updateBoard();
	}
}
