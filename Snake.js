// board is double array
// snake is a list w/head and tail

// initialize board and snake (location and direction)
var boardSize = 100;
var board = [[]];     // top left is 0, 0, bottom right is max, max

var snake = [[1, 1]]; // x, y
var dir = 'right';

function moveHead(dir) {
  // move snake's head in given direction
  // right, left, up, and down
  var newHead = snake[0];
  if (dir == 'up') {
    // add new head above current one
    newhead[1] -= 1;  // changes y-coordinate by -1 (going UP)
    snake.unshift(newHead); // add newHead to the beginning of the list
    // don't remove tail here, because sometimes you may not want to (handled elsewhere)
  } else if (dir == 'down') {
    
  } else if (dir == 'right') {

  } else {  // dir == 'left'

  }
}
