const CELL_SIZE = 20;
const CANVAS_SIZE = 500;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
const MOVE_INTERVAL = 150;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    lifes: 3,
  };
}
let snake1 = initSnake("purple");
let apple = [
  {
    position: initPosition(),
  },
  {
    position: initPosition(),
  },
];

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
  let scoreCanvas = document.getElementById("score1Board");
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "18px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 20, scoreCanvas.scrollHeight / 2);
}
let lifesNow = snake1.lifes;
function lifes(ctx, x, y) {
  let heart = document.getElementById("lifes");
  for (let i = 0; i < lifesNow; i++) {
    ctx.drawImage(heart, 10 + x * i, y, CELL_SIZE, CELL_SIZE);
  }
}
function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");
    let img = document.getElementById("iconApple");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color);
    for (let i = 1; i < snake1.body.length; i++) {
      drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }
    for (let i = 0; i < apple.length; i++) {
      ctx.drawImage(
        img,
        apple[i].position.x * CELL_SIZE,
        apple[i].position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
    lifes(ctx, 20, 10);
    drawScore(snake1);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eat(snake, apple) {
  for (let i = 0; i < apple.length; i++) {
    if (
      snake.head.x == apple[i].position.x &&
      snake.head.y == apple[i].position.y
    ) {
      apple[i].position = initPosition();
      snake.score++;
      snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apple);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apple);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apple);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apple);
}

function checkCollision(snakes) {
  let isCollide = false;
  //this
  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (
          snakes[i].head.x == snakes[j].body[k].x &&
          snakes[i].head.y == snakes[j].body[k].y
        ) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    document.getElementById("gameover").play();
    snake1 = initSnake("purple");
    lifesNow -= 1;
    console.log(lifesNow);
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision([snake1])) {
    setTimeout(function () {
      move(snake);
    }, MOVE_INTERVAL);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}

initGame();
