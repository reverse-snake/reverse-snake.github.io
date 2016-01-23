var dir = 'right';

// Level 0 is dumb as a rock: It follows left-hand on the wall unless it sees food, and ignores its own tail
function aiLevel0() {
  if (dir == 'right' || dir == 'left') {
    // Going to the right & blocked by wall
    if (dir == 'right' && snake[0][0] == width-1) {
      // If blocked by wall go up, else go down.
      if (snake[0][1] == height-1) {
        dir = 'up';
      } else {
        dir = 'down';
      }
    // Going to the left & blocked by wall
    } else if (dir == 'left' && snake[0][0] === 0) {
      // If blocked by wall go down, else go up.
      if (snake[0][1] === 0) {
        dir = 'down';
      } else {
        dir = 'up';
      }
    } else { // Not blocked in given direction, check for food
      if (snake[0][0] == food[0]) { // Snake above/below food
        if (snake[0][1] < food[1]) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      }
    } // Keep on keeping on
  } else if (dir == 'up' || dir == 'down') {
    // Going up & blocked by wall
    if (dir == 'up' && snake[0][1] === 0) {
      // If blocked by wall go left, else go right.
      if (snake[0][0] == width-1) {
        dir = 'left';
      } else {
        dir = 'right';
      }
    // Going down & blocked by wall
    } else if (dir == 'down' && snake[0][1] == height-1) {
      // If blocked by wall go right, else go left.
      if (snake[0][0] === 0) {
        dir = 'right';
      } else {
        dir = 'left';
      }
    } else { // Not blocked in any direction, check for food
      if (snake[0][1] == food[1]) { // Snake left/right of food
        if (snake[0][0] < food[0]) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      }
    }
  }
  moveHead(dir);
}

// Same as level 0, but aware of its tail
function aiLevel1() {
  if (dir == 'right' || dir == 'left') {
    // Going to the right & blocked by wall | tail
    if (dir == 'right' && (snake[0][0] == width-1 || inSnake((snake[0][0]+1)+'_'+snake[0][1]))) {
      // If blocked by wall | tail go up, else go down.
      if (snake[0][1] == height-1 || inSnake(snake[0][0]+'_'+(snake[0][1]+1))) {
        dir = 'up';
      } else {
        dir = 'down';
      }
    // Going to the left & blocked by wall | tail
    } else if (dir == 'left' && (snake[0][0] === 0 || inSnake((snake[0][0]-1)+'_'+snake[0][1]))) {
      // If blocked by wall | tail go down, else go up.
      if (snake[0][1] === 0 || inSnake(snake[0][0]+'_'+(snake[0][1]-1))) {
        dir = 'down';
      } else {
        dir = 'up';
      }
    } else { // Not blocked in given direction, check for food
      if (snake[0][0] == food[0]) { // Snake above/below food
        if (snake[0][1] < food[1]) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      }
    } // Keep on keeping on
  } else if (dir == 'up' || dir == 'down') {
    // Going up & blocked by wall | tail
    if (dir == 'up' && (snake[0][1] === 0 || inSnake(snake[0][0]+'_'+(snake[0][1]-1)))) {
      // If blocked by wall | tail go left, else go right.
      if (snake[0][0] == width-1 || inSnake((snake[0][0]+1)+'_'+snake[0][1])) {
        dir = 'left';
      } else {
        dir = 'right';
      }
    // Going down & blocked by wall | tail
    } else if (dir == 'down' && (snake[0][1] == height-1 || inSnake(snake[0][0]+'_'+(snake[0][1]+1)))) {
      // If blocked by wall | tail go right, else go left.
      if (snake[0][0] === 0 || inSnake((snake[0][0]-1)+'_'+snake[0][1])) {
        dir = 'right';
      } else {
        dir = 'left';
      }
    } else { // Not blocked in any direction, check for food
      if (snake[0][1] == food[1]) { // Snake left/right of food
        if (snake[0][0] < food[0]) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      }
    }
  }
  moveHead(dir);
}

// Prioritizes survival over efficient food grabs. Is careful not to form loops with its own tail.
function aiLevel2() {

}

