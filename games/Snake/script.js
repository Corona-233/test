const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = randomFood();
let score = 0;

function gameLoop() {
    requestAnimationFrame(gameLoop);
  
    if (++frame % 24 !== 0) return;
  
    if (direction.x === 0 && direction.y === 0) {
      draw();
      return;
    }
  
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
  
    // 边界穿越
    head.x = (head.x + tileCount) % tileCount;
    head.y = (head.y + tileCount) % tileCount;
  
    // 撞自己
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      resetGame();
      return;
    }
  
    snake.unshift(head);
  
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = `分数: ${score}`;
      food = randomFood();
    } else {
      snake.pop();
    }
  
    draw();
}

function draw() {
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 画蛇
  ctx.fillStyle = '#0f0';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  });

  // 画食物
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function resetGame() {
  alert(`游戏结束！得分：${score}`);
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = randomFood();
  score = 0;
  scoreEl.textContent = `分数: ${score}`;
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
    case 's':
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
    case 'a':
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
    case 'd':
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

let frame = 0;
gameLoop();
