var dir = 'right';
var level = 0;
var maxLevel = 4;
var upButton = document.getElementsByClassName("upButton")[0];
var levelGauge = document.getElementsByClassName("level")[0];
var downButton = document.getElementsByClassName("downButton")[0];
function setLevel(_level) {
  level = _level;
  if (level > maxLevel) {
    maxLevel = level;
  }
  //if (gameIsStopped) {
  //  stopGame(); // Game has not started but level was changed, redraw snake.
  //}
  // NOTE: Code commented out because it creates an infinite loop
  levelGauge.innerHTML = level;
  downButton.disabled = (level === 0);
  upButton.disabled = (level == maxLevel);
  console.log("Level set to", level);
}
function upLevel() {
  setLevel(level + 1);
}
function downLevel() {
  setLevel(level - 1);
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
        dir = 'up';
      } else {
        dir = 'down';
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
        dir = 'down';
      } else {
        dir = 'up';
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
        dir = 'left';
      } else {
        dir = 'right';
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
        dir = 'right';
      } else {
        dir = 'left';
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
          // why not use getLoopDirection here?
	        if (inSnake((width - 1) + '_' + j)) {
	          dir = 'up';
	          return moveHead(dir);
	        }
	      }
	      for (var i = width - 1; i >= 0; i--) { // Check along bottom edge for our own tail (loop)
          // why not use getLoopDirection here?
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
	      dir = 'up';
	    } else {
	      dir = 'down';
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
    // Close to a wall
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
        dir = 'down';
      } else {
        dir = 'up';
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
    // Close to a wall
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
        dir = 'left';
      } else {
        dir = 'right';
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
          console.log('571', dir);
          debugSnake();
          dir = 'left';
        }
      }
    }
    console.log('576', dir)
  } else if (dir == 'down') {
    // Near a wall
    if (snake[0][1] >= height - 2) {
      // If near the left side of the board, go right
      if (snake[0][0] <= 1) {
        dir = 'right';
      // If near the right side of the board, go left
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
        dir = 'right';
      } else {
        dir = 'left';
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
  console.log('634', dir);
  moveHead(dir);
}

// Perfect play (or at least very close to it)
function aiLevel4() {
}
