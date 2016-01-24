var dir = 'right';
var moves = [];

// Find a safe route to target using at least numMoves
function monteCarlo(numMoves, target) {
  var moveAttempts = 0;
  console.log('Started monte carlo challenge w/', numMoves, 'moves');
  var snake_cpy = snake.slice(0); // Copy the snake so we can restore it
  moves = [];
  while (true) {
    snake = snake_cpy.slice(0); // Reset array and try again!
    var x = snake[0][0];
    var y = snake[0][1];
    try {
      while (x != target[0] && y != target[1] || moveAttempts < 1024) {  // if no possible solution, gives an infinite loop
        r = Math.floor(Math.random()*4); // Try a new direction until we succeed.
        // TODO: Must do this systematically so that we can tell if it is impossible
        // OR keep a counter? What is the maximum number of moves in a given space?
        // Move counter doesn't account for repeating moves (this is randomized)
        //
        if (r === 0) {
          moves.unshift('right');
          x++;
        } else if (r == 1) {
          moves.unshift('left');
          x--;
        } else if (r == 2) {
          moves.unshift('up');
          y--;
        } else if (r == 3) {
          moves.unshift('down');
          y++;
        }
        if (x < 0 || x >= width) {
          throw collisionError;
        }
        if (y < 0 || y >= height) {
          throw collisionError;
        }
        if (inSnake(x+'_'+y)) {
          throw collisionError;
        }
        snake.unshift([x, y]);
        moveAttempts++;
      }
      console.log(moveAttempts);
      if (snake.length - snake_cpy.length >= numMoves) { // We got out, with enough moves!
        snake = snake_cpy.slice(0); // Restore original snake
        console.log('Finished monte carlo challenge.');
        return; // Movements are stored in var moves.
      }
    } catch (collisionError) {} // If we collide, just try again.
  } // End while(true)
}

function setLevel(_level) {
  level = _level;
  if (level > 4) { // Actual hard limit for levels
    level = 4;
  }
  if (level > maxLevel) {
    level = maxLevel;
  }
  if (level < 0) {
    level = 0;
  }
  if (gameIsStopped) {
    resetGame(); // Game has not started but level was changed, redraw snake.
  }
  console.log(level);
  console.log(levelGauge.innerHTML);
  levelGauge.innerHTML = level;
  downButton.disabled = (level === 0);
  upButton.disabled = (level == maxLevel);
  console.log("Level set to", level);
}

function upLevel() {
  console.log("Up one level");
  level = level + 1;
  if (level > 4) { // Actual hard limit for levels
    level = 4;
  }
  if (level > maxLevel) {
    level = maxLevel;
  }
  console.log(level);
  console.log(levelGuage.innerHTML);
  levelGuage.innerHTML = level;
  upButton.disabled = (level == maxLevel);
  resetGame();
}

function downLevel() {
  console.log("Down one level");
  level = level - 1;
  if (level < 0) {
    level = 0;
  }
  console.log(level);
  levelGuage.innerHTML = level;
  downButton.disabled = (level === 0);
  resetGame();
}

function ai(level) {
  switch (level) {
    case 0:
    return aiLevel0();
    case 1:
    return aiLevel1();
    case 2:
    return aiLevel2();
    case 3:
    return aiLevel3();
    case 4:
    return aiLevel4();
    case 5:
    console.log('Victory!');
  }
}

function getLoopDirection() {
  // Detect which way the loop goes...
  var turns = 0;
  // We count squares in 3s.
  for (var s = 0; s < snake.length - 2; s++) {
    if (s > 1 && (Math.abs(snake[s+1][0]-snake[0][0]) + Math.abs(snake[s+1][1]-snake[0][1]) == 1)) {
      break; // Found the node that touches the head node and creates the loop, so we exit.
    }
    if (snake[s][0] < snake[s + 1][0]) {
      if (snake[s + 1][1] < snake[s + 2][1]) {
        // 12
        //  3
        turns++; // Clockwise
      } else if (snake[s + 1][1] == snake[s + 2][1]) {
        // 123
        continue;
      } else if (snake[s + 1][1] > snake[s + 2][1]) {
        //  3
        // 12
        turns--; // Counter-clockwise
      }
    } else if (snake[s][0] > snake[s + 1][0]) {
      if (snake[s + 1][1] < snake[s + 2][1]) {
        // 21
        // 3
        turns--; // Counter-clockwise
      } else if (snake[s + 1][1] == snake[s + 2][1]) {
        // 321
        continue;
      } else if (snake[s + 1][1] > snake[s + 2][1]) {
        // 3
        // 21
        turns++; // Clockwise
      }
    } else if (snake[s][1] < snake[s + 1][1]) {
      if (snake[s + 1][0] < snake[s + 2][0]) {
        // 1
        // 23
        turns--; // Counter-clockwise
      } else if (snake[s + 1][0] == snake[s + 2][0]) {
        // 1
        // 2
        // 3
        continue;
      } else if (snake[s + 1][0] > snake[s + 2][0]) {
        //  1
        // 32
        turns++; // Clockwise
      }
    } else if (snake[s][1] > snake[s + 1][1]) {
      if (snake[s + 1][0] < snake[s + 2][0]) {
        // 23
        // 1
        turns++; // Clockwise
      } else if (snake[s + 1][0] == snake[s + 2][0]) {
        // 3
        // 2
        // 1
        continue;
      } else if (snake[s + 1][0] > snake[s + 2][0]) {
        // 32
        //  1
        turns--; // Counter-clockwise
      }
    }
  }
  return turns;
}
// Level 0 is dumb as a rock: It follows left-hand on the wall unless it sees food, and ignores its own tail
function aiLevel0() {
  if (dir == 'right' || dir == 'left') {
    // Going to the right & blocked by wall
    if (snake[0][0] == food[0]) { // Snake above/below food
      if (snake[0][1] < food[1]) {
        dir = 'down';
      } else {
        dir = 'up';
      }
      // Going right & blocked by wall
    } else if (dir == 'right' && snake[0][0] == width - 1) {
      // If blocked by wall go up, else go down.
      if (snake[0][1] == height - 1) {
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
    } // Keep on keeping on
  } else if (dir == 'up' || dir == 'down') {
    if (snake[0][1] == food[1]) { // Snake left/right of food
      if (snake[0][0] < food[0]) {
        dir = 'right';
      } else {
        dir = 'left';
      }
      // Going up & blocked by wall
    } else if (dir == 'up' && snake[0][1] === 0) {
      // If blocked by wall go left, else go right.
      if (snake[0][0] == width - 1) {
        dir = 'left';
      } else {
        dir = 'right';
      }
      // Going down & blocked by wall
    } else if (dir == 'down' && snake[0][1] == height - 1) {
      // If blocked by wall go right, else go left.
      if (snake[0][0] === 0) {
        dir = 'right';
      } else {
        dir = 'left';
      }
    } // Keep on keeping on
  }
  moveHead(dir);
}
// Same as level 0, but aware of its tail
function aiLevel1() {
  if (dir == 'right' || dir == 'left') {
    if (snake[0][0] == food[0]) { // Snake above/below food
      if (snake[0][1] < food[1]) {
        dir = 'down';
      } else {
        dir = 'up';
      }
      // Going to the right & blocked by wall | tail
    } else if (dir == 'right' && (snake[0][0] == width - 1 || inSnake((snake[0][0] + 1) + '_' + snake[0][1]))) {
      // If blocked by wall | tail go up, else go down.
      if (snake[0][1] == height - 1 || inSnake(snake[0][0] + '_' + (snake[0][1] + 1))) {
        dir = 'up';
      } else {
        dir = 'down';
      }
      // Going to the left & blocked by wall | tail
    } else if (dir == 'left' && (snake[0][0] === 0 || inSnake((snake[0][0] - 1) + '_' + snake[0][1]))) {
      // If blocked by wall | tail go down, else go up.
      if (snake[0][1] === 0 || inSnake(snake[0][0] + '_' + (snake[0][1] - 1))) {
        dir = 'down';
      } else {
        dir = 'up';
      }
    } // Keep on keeping on
  } else if (dir == 'up' || dir == 'down') {
    if (snake[0][1] == food[1]) { // Snake left/right of food
      if (snake[0][0] < food[0]) {
        dir = 'right';
      } else {
        dir = 'left';
      }
      // Going up & blocked by wall | tail
    } else if (dir == 'up' && (snake[0][1] === 0 || inSnake(snake[0][0] + '_' + (snake[0][1] - 1)))) {
      // If blocked by wall | tail go left, else go right.
      if (snake[0][0] == width - 1 || inSnake((snake[0][0] + 1) + '_' + snake[0][1])) {
        dir = 'left';
      } else {
        dir = 'right';
      }
      // Going down & blocked by wall | tail
    } else if (dir == 'down' && (snake[0][1] == height - 1 || inSnake(snake[0][0] + '_' + (snake[0][1] + 1)))) {
      // If blocked by wall | tail go right, else go left.
      if (snake[0][0] === 0 || inSnake((snake[0][0] - 1) + '_' + snake[0][1])) {
        dir = 'right';
      } else {
        dir = 'left';
      }
    } // Keep on keeping on
  }
  moveHead(dir);
}

// Same as level 1, but will decide to turn left or right on obstruction based on loop formation.
function aiLevel2() {
  if (dir == 'right') {
    // Blocked by wall
    if (snake[0][0] == width - 1) {
      // If at bottom of board, go up
      if (snake[0][1] == height - 1) {
        dir = 'up';
        // If at top of board, go down
      } else if (snake[0][1] === 0) {
        dir = 'down';
      } else {
        for (var j = snake[0][1] + 1; j < height; j++) { // Check along right edge for our own tail (loop)
          if (inSnake((width - 1) + '_' + j)) {
            dir = 'up';
            return moveHead(dir);
          }
        }
        for (var i = width - 1; i >= 0; i--) { // Check along bottom edge for our own tail (loop)
          if (inSnake(i + '_' + (width - 1))) {
            dir = 'up';
            return moveHead(dir);
          }
        }
        dir = 'down';
      }
      // Blocked by tail
    } else if (inSnake((snake[0][0] + 1) + '_' + snake[0][1])) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][1] != height-1) {
          dir = 'up';
        } else {
          dir = 'down';
        }
      } else {
        if (snake[0][1] !== 0) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      }
      return moveHead(dir);
    }
    if (snake[0][0] == food[0]) {
      if (snake[0][1] < food[1]) {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]+1))) {
          dir = 'down';
        }
      } else {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]-1))) {
          dir = 'up';
        }
      }
    }
  } else if (dir == 'left') {
    // Blocked by wall
    if (snake[0][0] === 0) {
      // If at top of board, go down
      if (snake[0][1] === 0) {
        dir = 'down';
        // If at bottom of board, go up
      } else if (snake[0][1] == height-1) {
        dir = 'up';
      } else {
        for (var j = snake[0][1] - 1; j >= 0; j--) { // Check along left edge for our own tail (loop)
          if (inSnake(0 + '_' + j)) {
            dir = 'down';
            return moveHead(dir);
          }
        }
        for (var i = 0; i < width; i++) { // Check along top edge for our own tail (loop)
          if (inSnake(i + '_' + 0)) {
            dir = 'down';
            return moveHead(dir);
          }
        }
        dir = 'up';
      }
      // Blocked by tail
    } else if (inSnake((snake[0][0] - 1) + '_' + snake[0][1])) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][1] !== 0) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      } else {
        if (snake[0][1] != height-1) {
          dir = 'up';
        } else {
          dir = 'down';
        }
      }
      return moveHead(dir);
    }
    // Snake above/below food
    if (snake[0][0] == food[0]) {
      if (snake[0][1] < food[1]) {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]+1))) {
          dir = 'down';
        }
      } else {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]-1))) {
          dir = 'up';
        }
      }
    }
  } else if (dir == 'up') {
    // Blocked by wall
    if (snake[0][1] === 0) {
      // If at right side of board, go left
      if (snake[0][0] == width - 1) {
        dir = 'left';
        // If at left side of board, go right
      } else if (snake[0][0] === 0) {
        dir = 'right';
      } else {
        for (var i = snake[0][0] + 1; i < width; i++) { // Check along top edge for our own tail (loop)
          if (inSnake(i + '_' + 0)) {
            dir = 'left';
            return moveHead(dir);
          }
        }
        for (var j = 0; j < height; j++) { // Check along right edge for our own tail (loop)
          if (inSnake((width - 1) + '_' + j)) {
            dir = 'left';
            return moveHead(dir);
          }
        }
        dir = 'right';
      }
      // Blocked by tail
    } else if (inSnake(snake[0][0] + '_' + (snake[0][1] - 1))) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][0] !== 0) {
          dir = 'left';
        } else {
          dir = 'right';
        }
      } else {
        if (snake[0][0] != width-1) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      }
      return moveHead(dir);
    }
    if (snake[0][1] == food[1]) { // Snake left/right of food
      if (snake[0][0] < food[0]) {
        if (!inSnake((snake[0][0]+1)+'_'+snake[0][1])) {
          dir = 'right';
        }
      } else {
        if (!inSnake((snake[0][0]-1)+'_'+snake[0][1])) {
          dir = 'left';
        }
      }
    }
  } else if (dir == 'down') {
    // Blocked by wall
    if (snake[0][1] == height - 1) {
      // If at left side of board, go right
      if (snake[0][0] === 0) {
        dir = 'right';
        // If at right side of board, go left
      } else if (snake[0][0] == width - 1) {
        dir = 'left';
      } else {
        for (var i = snake[0][0] - 1; i >= 0; i--) { // Check along bottom edge for our own tail (loop)
          if (inSnake(i + '_' + (height-1))) {
            dir = 'right';
            return moveHead(dir);
          }
        }
        for (var j = height - 1; j >= 0; j--) { // Check along left edge for our own tail (loop)
          if (inSnake(0 + '_' + j)) {
            dir = 'right';
            return moveHead(dir);
          }
        }
        dir = 'left';
      }
      // Blocked by tail
    } else if (inSnake(snake[0][0] + '_' + (snake[0][1] + 1))) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][0] !== 0) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      } else {
        if (snake[0][0] != width-1) {
          dir = 'left';
        } else {
          dir = 'right';
        }
      }
      return moveHead(dir);
    }
    if (snake[0][1] == food[1]) { // Snake left/right of food
      if (snake[0][0] < food[0]) {
        if (!inSnake((snake[0][0]+1)+'_'+snake[0][1])) {
          dir = 'right';
        }
      } else {
        if (!inSnake((snake[0][0]-1)+'_'+snake[0][1])) {
          dir = 'left';
        }
      }
    }
  }
  moveHead(dir);
}

// Same as level 2 but will intentionally leave a 1-wide gap at edge before turning to avoid getting trapped.
function aiLevel3() {
  if (dir == 'right') {
    // Close to the right wall
    if (snake[0][0] >= width - 2) {
      // If near the bottom of the board, go up
      if (snake[0][1] >= height - 2) {
        dir = 'up';
        // If near the top of the board, go down
      } else if (snake[0][1] <= 1) {
        dir = 'down';
      } else { // In the middle of the wall
        for (var j = snake[0][1] + 1; j < height; j++) { // Check along right edge for our own tail (loop)
          if (inSnake((width - 1) + '_' + j)) {
            dir = 'up';
            return moveHead(dir);
          }
        }
        for (var i = width - 1; i >= 0; i--) { // Check along bottom edge for our own tail (loop)
          if (inSnake(i + '_' + (width - 1))) {
            dir = 'up';
            return moveHead(dir);
          }
        }
        for (var j = height; j >= height/2; j--) { // Check halfway along left edge for our own tail (loop)
          if (inSnake(0 + '_' + j)) {
            dir = 'up';
            return moveHead(dir);
          }
        }
        dir = 'down';
      }
    }
    // Blocked by tail
    if (inSnake((snake[0][0] + 1) + '_' + snake[0][1])) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][1] !== 0) {
          dir = 'up';
        } else {
          dir = 'down';
        }
      } else {
        if (snake[0][1] != height-1) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      }
      return moveHead(dir);
    }
    // Food is where snake is | slightly ahead.
    if (snake[0][0] == food[0] || snake[0][0]+1 == food[0]) {
      if (snake[0][1] < food[1]) { // food is below snake
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]+1))) { // checks for collision
          dir = 'down';
        }
      } else if (snake[0][1] == food[1]) {
        if (!inSnake((snake[0][0]+1)+'_'+snake[0][1])) {
          dir = 'right';
        }
      } else if (snake[0][1] > food[1]) {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]-1))) {
          dir = 'up';
        }
      }
    }
  } else if (dir == 'left') {
    // Close to the left wall
    if (snake[0][0] <= 1) {
      // If near the top of the board, go down
      if (snake[0][1] <= 1) {
        dir = 'down';
        // If near the bottom of the board, go up
      } else if (snake[0][1] >= height-2) {
        dir = 'up';
      } else {
        for (var j = snake[0][1]-1; j >= 0; j--) { // Check along left edge for our own tail (loop)
          if (inSnake(0 + '_' + j)) {
            dir = 'down';
            return moveHead(dir);
          }
        }
        for (var i = 0; i < width; i++) { // Check along top edge for our own tail (loop)
          if (inSnake(i + '_' + 0)) {
            dir = 'down';
            return moveHead(dir);
          }
        }
        for (var j = 0; j < height/2; j++) { // Check halfway along right edge for our own tail (loop)
          if (inSnake((width-1) + '_' + j)) {
            dir = 'down';
            return moveHead(dir);
          }
        }
        dir = 'up';
      }
    }
    // Blocked by tail
    if (inSnake((snake[0][0] - 1) + '_' + snake[0][1])) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][1] !== 0) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      } else {
        if (snake[0][1] != height-1) {
          dir = 'up';
        } else {
          dir = 'down';
        }
      }
      return moveHead(dir);
    }
    // Food is where we are | slightly ahead.
    if (snake[0][0] == food[0] || snake[0][0]-1 == food[0]) {
      if (snake[0][1] < food[1]) {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]+1))) {
          dir = 'down';
        }
      } else if (snake[0][1] == food[1]) {
        if (!inSnake((snake[0][0]-1)+'_'+snake[0][1])) {
          dir = 'left';
        }
      } else if (snake[0][1] > food[1]) {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]-1))) {
          dir = 'up';
        }
      }
    }
  } else if (dir == 'up') {
    // Close to the top wall
    if (snake[0][1] <= 1) {
      // If near the right side of the board, go left
      if (snake[0][0] >= width - 2) {
        dir = 'left';
        // If near the left side of the board, go right
      } else if (snake[0][0] <= 1) {
        dir = 'right';
      } else {
        for (var i = snake[0][0] + 1; i < width; i++) { // Check along top edge for our own tail (loop)
          if (inSnake(i + '_' + 0)) {
            dir = 'left';
            return moveHead(dir);
          }
        }
        for (var j = 0; j < height; j++) { // Check along right edge for our own tail (loop)
          if (inSnake((width - 1) + '_' + j)) {
            dir = 'left';
            return moveHead(dir);
          }
        }
        for (var i = width-1; i >= width/2; i--) { // Check halfway along bottom edge for our own tail (loop)
          if (inSnake(i + '_' + (height-1))) {
            dir = 'left';
            return moveHead(dir);
          }
        }
        dir = 'right';
      }
    }
    // Blocked by tail
    if (inSnake(snake[0][0] + '_' + (snake[0][1] - 1))) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][0] !== 0) {
          dir = 'left';
        } else {
          dir = 'right';
        }
      } else {
        if (snake[0][0] != width-1) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      }
      return moveHead(dir);
    }
    // Food is where we are | slightly ahead.
    if (snake[0][1] == food[1] || snake[0][1]-1 == food[1]) {
      if (snake[0][0] < food[0]) {
        if (!inSnake((snake[0][0]+1)+'_'+snake[0][1])) {
          dir = 'right';
        }
      } else if (snake[0][0] == food[0]) {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]-1))) {
          dir = 'up';
        }
      } else if (snake[0][0] > food[0]) {
        if (!inSnake((snake[0][0]-1)+'_'+snake[0][1])) {
          dir = 'left';
        }
      }
    }
  } else if (dir == 'down') {
    // Near the bottom wall
    if (snake[0][1] >= height - 2) {
      // If near the left side of the board, go right
      if (snake[0][0] <= 1) {
        dir = 'right';
        // If near the right side of the board, go left
      } else if (snake[0][0] >= width - 2) {
        dir = 'left';
      } else {
        for (var i = snake[0][0] - 1; i >= 0; i--) { // Check along bottom edge for our own tail (loop)
          if (inSnake(i + '_' + (height-1))) {
            dir = 'right';
            return moveHead(dir);
          }
        }
        for (var j = height - 1; j >= 0; j--) { // Check along left edge for our own tail (loop)
          if (inSnake(0 + '_' + j)) {
            dir = 'right';
            return moveHead(dir);
          }
        }
        for (var i = 0; i < width/2; i++) { // Check halfway along top edge for our own tail (loop)
          if (inSnake(i + '_' + 0)) {
            dir = 'right';
            return moveHead(dir);
          }
        }
        dir = 'left';
      }
    }
    // Blocked by tail
    if (inSnake(snake[0][0] + '_' + (snake[0][1] + 1))) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][0] !== 0) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      } else {
        if (snake[0][0] != width-1) {
          dir = 'left';
        } else {
          dir = 'right';
        }
      }
      return moveHead(dir);
    }
    // Food is where we are | slightly ahead.
    if (snake[0][1] == food[1] || snake[0][1]+1 == food[1]) {
      if (snake[0][0] < food[0]) {
        if (!inSnake((snake[0][0]+1)+'_'+snake[0][1])) {
          dir = 'right';
        }
      } else if (snake[0][0] == food[0]) {
        if (!inSnake(snake[0][0]+'_'+(snake[0][1]+1))) {
          dir = 'down';
        }
      } else if (snake[0][0] > food[0]) {
        if (!inSnake((snake[0][0]-1)+'_'+snake[0][1])) {
          dir = 'left';
        }
      }
    }
  }
  moveHead(dir);
}

// Same idea as level 2 but more conservative
function aiLevel4() {
  if (moves.length > 0) { // Moves are generated by monteCarlo() if we are stuck.
    dir = moves.pop();
    return moveHead(dir);
  }
  if (dir == 'right') {
    // Blocked by wall
    if (snake[0][0] == width - 1) {
      // If at bottom of board, go up
      if (snake[0][1] == height - 1) {
        dir = 'up';
        return moveHead(dir);
        // If at top of board, go down
      } else if (snake[0][1] === 0) {
        dir = 'down';
        return moveHead(dir);
      } else {
        var goUp = 0;
        var segmentUp = -1;
        var goDown = 0;
        var segmentDown = -1;
        for (var j = snake[0][1] - 1; j >= 1; j--) { // Check along right edge for our own tail (loop up)
          if ((segmentUp = getSnakeIndex((width - 1) + '_' + j)) != -1) {
            if (goUp + segmentUp <= snake.length) { // this segment will disappear before we reach it
              break;
            }
          }
          goUp++;
        }
        if (segmentUp == -1 || goUp + segmentUp > snake.length) {
          for (var i = width - 1; i >= 0; i--) { // Check along top edge for our own tail (loop up)
            if ((segmentUp = getSnakeIndex(i + '_' + 0)) != -1) {
              if (goUp + segmentUp <= snake.length) { // this segment will not disappear before we reach it
                break;
              }
            }
            goUp++;
          }
        }
        for (var j = snake[0][1] + 1; j < height - 1; j++) { // Check along right edge for our own tail (loop down)
          if ((segmentDown = getSnakeIndex((width - 1) + '_' + j)) != -1) {
            if (goDown + segmentDown <= snake.length) { // this segment will disappear before we reach it
              break;
            }
          }
          goDown++;
        }
        if (segmentDown == -1 || goDown + segmentDown > snake.length) {
          for (var i = width - 1; i >= 0; i--) { // Check along bottom edge for our own tail (loop)
            if ((segmentDown = getSnakeIndex(i + '_' + (height - 1))) != -1) {
              if (goDown + segmentDown <= snake.length) { // this segment will not disappear before we reach it
                break;
              }
            }
            goDown++;
          }
        }
        console.log('688', goUp, goDown, segmentUp, segmentDown);
        if (segmentDown == -1 || goDown + segmentDown > snake.length) {
          // No conflicting segments
        } else {
          // goDown should now contain *negative* the number of needed steps in that direction
          // goDown is 10 (free steps). segmentDown is 7, snake.length is 20.
          // goDown = -(20 - 10 - 7)
          goDown = -(snake.length-segmentDown-goDown);
        }
        if (segmentUp == -1 || goUp + segmentUp > snake.length) {
          // No conflicting segments
        } else {
          // goUp should now contain the number of needed steps in that direction
          goUp = -(snake.length-segmentUp-goUp);
        }
        if (goUp > goDown) {
          dir = 'up';
        } else {
          dir = 'down';
        }
        if (goDown < goUp && goUp < 0) {
          monteCarlo(-goUp, snake[segmentUp]);
        } else if (goUp < goDown && goDown < 0) {
          monteCarlo(-goDown, snake[segmentDown]);
        }
        return moveHead(dir);
      }
      // Blocked by tail
    } else if (inSnake((snake[0][0] + 1) + '_' + snake[0][1])) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][1] != height-1) {
          dir = 'up';
        } else {
          dir = 'down';
        }
      } else {
        if (snake[0][1] !== 0) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      }
      return moveHead(dir);
    }
    if (snake[0][0] == food[0]) { // Snake above/below food
      if (snake[0][1] < food[1]) {
        for (var j=snake[0][1]+1; j<food[1]; j++) {
          if (inSnake(snake[0][0]+'_'+j)) {
            return moveHead(dir);
          }
        }
        dir = 'down';
      } else {
        for (var j=food[1]+1; j<snake[0][1]; j++) {
          if (inSnake(snake[0][0]+'_'+j)) {
            return moveHead(dir);
          }
        }
        dir = 'up';
      }
    }
    return moveHead(dir);
  } else if (dir == 'left') {
    // Blocked by wall
    if (snake[0][0] === 0) {
      // If at top of board, go down
      if (snake[0][1] === 0) {
        dir = 'down';
        return moveHead(dir);
        // If at bottom of board, go up
      } else if (snake[0][1] == height-1) {
        dir = 'up';
        return moveHead(dir);
      } else {
        var goUp = 0;
        var segmentUp = -1;
        var goDown = 0;
        var segmentDown = -1;
        for (var j = snake[0][1] - 1; j >= 1; j--) { // Check along left edge for our own tail (loop)
          if ((segmentUp = getSnakeIndex(0 + '_' + j)) != -1) {
            if (goUp + segmentUp <= snake.length) { // This segment will not disappear before we reach it.
              break;
            }
          }
          goUp++;
        }
        if (segmentUp == -1 || goUp + segmentUp > snake.length) {
          for (var i = 0; i < width; i++) { // Check along top edge for our own tail (loop)
            if ((segmentUp = getSnakeIndex(i + '_' + 0)) != -1) {
              if (goUp + segmentUp <= snake.length) { // This segment will not disappear before we reach it.
                break;
              }
            }
            goUp++;
          }
        }
        for (var j = snake[0][1] + 1; j < height-1; j++) { // Check along left edge for our own tail (loop)
          if ((segmentDown = getSnakeIndex(0 + '_' + j)) != -1) {
            if (goDown + segmentDown <= snake.length) { // This segment will not disappear before we reach it.
              break;
            }
          }
          goDown++;
        }
        if (segmentDown == -1 || goDown + segmentDown > snake.length) {
          for (var i = 0; i < width; i++) { // Check along bottom edge for our own tail (loop)
            if ((segmentDown = getSnakeIndex(i + '_' + height-1)) != -1) {
              if (goDown + segmentDown <= snake.length) { // This segment will not disappear before we reach it.
                break;
              }
            }
            goDown++;
          }
        }
        console.log('793', goUp, goDown, segmentUp, segmentDown);
        if (segmentDown == -1 || goDown + segmentDown > snake.length) {
          // No conflicting segments
        } else {
          // goDown should now contain *negative* the number of needed steps in that direction
          // goDown is 10 (free steps). segmentDown is 7, snake.length is 20.
          // goDown = -(20 - 10 - 7)
          goDown = -(snake.length-segmentDown-goDown);
        }
        if (segmentUp == -1 || goUp + segmentUp > snake.length) {
          // No conflicting segments
        } else {
          // goUp should now contain the number of needed steps in that direction
          goUp = -(snake.length-segmentUp-goUp);
        }
        if (goUp > goDown) {
          dir = 'up';
        } else {
          dir = 'down';
        }
        if (goDown < goUp && goUp < 0) {
          monteCarlo(-goUp, snake[segmentUp]);
        } else if (goUp < goDown && goDown < 0) {
          monteCarlo(-goDown, snake[segmentDown]);
        }
        return moveHead(dir);
      }
      // Blocked by tail
    } else if (inSnake((snake[0][0] - 1) + '_' + snake[0][1])) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][1] !== 0) {
          dir = 'down';
        } else {
          dir = 'up';
        }
      } else {
        if (snake[0][1] != height-1) {
          dir = 'up';
        } else {
          dir = 'down';
        }
      }
      return moveHead(dir);
    }
    if (snake[0][0] == food[0]) { // Snake above/below food
      if (snake[0][1] < food[1]) {
        for (var j=snake[0][1]+1; j<food[1]; j++) {
          if (inSnake(snake[0][0]+'_'+j)) {
            return moveHead(dir);
          }
        }
        dir = 'down';
      } else {
        for (var j=food[1]+1; j<snake[0][1]; j++) {
          if (inSnake(snake[0][0]+'_'+j)) {
            return moveHead(dir);
          }
        }
        dir = 'up';
      }
    }
    return moveHead(dir);
  } else if (dir == 'up') {
    // Blocked by wall
    if (snake[0][1] === 0) {
      // If at right side of board, go left
      if (snake[0][0] == width - 1) {
        dir = 'left';
        return moveHead(dir);
        // If at left side of board, go right
      } else if (snake[0][0] === 0) {
        dir = 'right';
        return moveHead(dir);
      } else {
        var goRight = 0;
        var segmentRight = -1;
        var goLeft = 0;
        var segmentLeft = -1;
        for (var i = snake[0][0] + 1; i < width-1; i++) { // Check along top edge for our own tail (loop)
          if ((segmentRight = getSnakeIndex(i + '_' + 0)) != -1) {
            if (goRight + segmentRight <= snake.length) {
              break;
            }
          }
          goRight++;
        }
        if (segmentRight == -1 || goRight + segmentRight > snake.length) {
          for (var j = 0; j < height; j++) { // Check along right edge for our own tail (loop)
            if ((segmentRight = getSnakeIndex((width - 1) + '_' + j)) != -1) {
              if (goRight + segmentRight <= snake.length) {
                break;
              }
            }
            goRight++;
          }
        }
        for (var i = snake[0][0] - 1; i >= 1; i--) { // Check along top edge for our own tail (loop)
          if ((segmentLeft = getSnakeIndex(i + '_' + 0)) != -1) {
            if (goLeft + segmentLeft <= snake.length) {
              break;
            }
          }
          goLeft++;
        }
        if (segmentLeft == -1 || goLeft + segmentLeft > snake.length) {
          for (var j = 0; j < height; j++) { // Check along left edge for our own tail (loop)
            if ((segmentLeft = getSnakeIndex(0 + '_' + j)) != -1) {
              if (goLeft + segmentLeft <= snake.length) {
                break;
              }
            }
            goLeft++;
          }
        }
        console.log('899', goRight, goLeft, segmentRight, segmentLeft);
        if (segmentRight == -1 || goRight + segmentRight > snake.length) {
          // No conflicting segments
        } else {
          // goRight should now contain *negative* the number of needed steps in that direction
          goRight = -(snake.length-segmentRight-goRight);
        }
        if (segmentLeft == -1 || goLeft + segmentLeft > snake.length) {
          // No conflicting segments
        } else {
          // goLeft should now contain the number of needed steps in that direction
          goLeft = -(snake.length-segmentLeft-goLeft);
        }
        if (goRight > goLeft) {
          dir = 'right';
        } else {
          dir = 'left';
        }
        if (goRight < goLeft && goLeft < 0) {
          monteCarlo(-goLeft, snake[segmentLeft]);
        } else if (goLeft < goRight && goRight < 0) {
          monteCarlo(-goRight, snake[segmentRight]);
        }
        return moveHead(dir);
      }
      // Blocked by tail
    } else if (inSnake(snake[0][0] + '_' + (snake[0][1] - 1))) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][0] !== 0) {
          dir = 'left';
        } else {
          dir = 'right';
        }
      } else {
        if (snake[0][0] != width-1) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      }
      return moveHead(dir);
    }
    if (snake[0][1] == food[1]) { // Snake left/right of food
      if (snake[0][0] < food[0]) {
        for (var i=snake[0][0]+1; i<food[0]; i++) {
          if (inSnake(i+'_'+snake[0][1])) {
            return moveHead(dir);
          }
        }
        dir = 'right';
      } else {
        for (var i=food[0]+1; i<snake[0][0]; i++) {
          if (inSnake(i+'_'+snake[0][1])) {
            return moveHead(dir);
          }
        }
        dir = 'left';
      }
    }
    return moveHead(dir);
  } else if (dir == 'down') {
    // Blocked by wall
    if (snake[0][1] == height - 1) {
      // If at left side of board, go right
      if (snake[0][0] === 0) {
        dir = 'right';
        return moveHead(dir);
        // If at right side of board, go left
      } else if (snake[0][0] == width - 1) {
        dir = 'left';
        return moveHead(dir);
      } else {
        var goRight = 0;
        var segmentRight = -1;
        var goLeft = 0;
        var segmentLeft = -1;
        for (var i = snake[0][0] + 1; i < width-1; i++) { // Check along bottom edge for our own tail (loop)
          if ((segmentRight = getSnakeIndex(i + '_' + (height-1))) != -1) {
            if (goRight + segmentRight <= snake.length) {
              break;
            }
          }
          goRight++;
        }
        if (segmentRight == -1 || goRight + segmentRight > snake.length) {
          for (var j = height - 1; j >= 0; j--) { // Check along right edge for our own tail (loop)
            if ((segmentRight = getSnakeIndex((width-1) + '_' + j)) != -1) {
              if (goRight + segmentRight <= snake.length) {
                break;
              }
            }
            goRight++;
          }
        }
        for (var i = snake[0][0] - 1; i >= 1; i--) { // Check along bottom edge for our own tail (loop)
          if ((segmentLeft = getSnakeIndex(i + '_' + (height-1))) != -1) {
            if (goLeft + segmentLeft <= snake.length) {
              break;
            }
          }
          goLeft++;
        }
        if (segmentLeft == -1 || goLeft + segmentLeft > snake.length) {
          for (var j = height - 1; j >= 0; j--) { // Check along left edge for our own tail (loop)
            if ((segmentLeft = getSnakeIndex(0 + '_' + j)) != -1) {
              if (goLeft + segmentLeft <= snake.length) {
                break;
              }
            }
            goLeft++;
          }
        }
        console.log('980', goRight, goLeft, segmentRight, segmentLeft);
        if (segmentRight == -1 || goRight + segmentRight > snake.length) {
          // No conflicting segments
        } else {
          // goRight should now contain *negative* the number of needed steps in that direction
          goRight = -(snake.length-segmentRight-goRight);
        }
        if (segmentLeft == -1 || goLeft + segmentLeft > snake.length) {
          // No conflicting segments
        } else {
          // goLeft should now contain the number of needed steps in that direction
          goLeft = -(snake.length-segmentLeft-goLeft);
        }
        if (goRight > goLeft) {
          dir = 'right';
        } else {
          dir = 'left';
        }
        if (goRight < goLeft && goLeft < 0) {
          monteCarlo(-goLeft, snake[segmentLeft]);
        } else if (goLeft < goRight && goRight < 0) {
          monteCarlo(-goRight, snake[segmentRight]);
        }
        return moveHead(dir);
      }
      // Blocked by tail
    } else if (inSnake(snake[0][0] + '_' + (snake[0][1] + 1))) {
      if (getLoopDirection() < 0) { // Loop direction Counter-clockwise
        if (snake[0][0] !== 0) {
          dir = 'right';
        } else {
          dir = 'left';
        }
      } else {
        if (snake[0][0] != width-1) {
          dir = 'left';
        } else {
          dir = 'right';
        }
      }
      return moveHead(dir);
    }
    if (snake[0][1] == food[1]) { // Snake left/right of food
      if (snake[0][0] < food[0]) {
        for (var i=snake[0][0]+1; i<food[0]; i++) {
          if (inSnake(i+'_'+snake[0][1])) {
            return moveHead(dir);
          }
        }
        dir = 'right';
      } else {
        for (var i=food[0]+1; i<snake[0][0]; i++) {
          if (inSnake(i+'_'+snake[0][1])) {
            return moveHead(dir);
          }
        }
        dir = 'left';
      }
    }
  }
  moveHead(dir);
}
