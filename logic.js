const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileSize = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let highScore = localStorage.getItem("highScore") || 0;
let snakeSpeed = localStorage.getItem("snakeSpeed") || 100;
let score = 0;
let snakeSpeedInterval;

//add click event listeners for buttons
document.getElementById("speed").value = snakeSpeed;
document.getElementById("startGame").addEventListener("click", function () {
  startGame();
});
document
  .getElementById("showInstructions")
  .addEventListener("click", function () {
    showInstructions();
  });
document.getElementById("backToMenu").addEventListener("click", function () {
  backToMenu();
});
document
  .getElementById("pauseStartGame")
  .addEventListener("click", function () {
    startGame();
  });
document
  .getElementById("pauseBackToMenu")
  .addEventListener("click", function () {
    backToMenu();
  });

function draw() {
  // Clear the canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  ctx.fillStyle = "lime";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * tileSize,
      segment.y * tileSize,
      tileSize,
      tileSize
    );
    ctx.beginPath();
    ctx.arc(
      segment.x * tileSize + tileSize / 2,
      segment.y * tileSize + tileSize / 2,
      tileSize / 4,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "green";
    ctx.fill();
  });

  // Draw the food
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x * tileSize + tileSize / 2,
    food.y * tileSize + tileSize / 2,
    tileSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();

  // Draw the score
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);

  // Draw the Highest score
  ctx.fillStyle = "white";
  ctx.fillText("Highest score: " + highScore, 10, canvas.height - 20);
}

function update() {
  // Move the snake
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // Check if snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } else {
    snake.pop();
  }

  // Check for collisions
  if (validateCollisions(head)) {
    updateHighScore();
    resetGame();
    openMenu();
  }
}

function validateCollisions(head) {
  return (
    head.x < 0 ||
    head.x >= gridSize ||
    head.y < 0 ||
    head.y >= gridSize ||
    snake.some(
      (segment, index) =>
        index !== 0 && segment.x === head.x && segment.y === head.y
    )
  );
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  if (snakeSpeedInterval) clearInterval(snakeSpeedInterval);
}

function gameLoop() {
  update();
  draw();
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
}

function startGame() {
  document.getElementById("menu").style.display = "none";
  if (document.getElementById("gamePaused").style.display !== "none")
    document.getElementById("gamePaused").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  snakeSpeed = parseInt(document.getElementById("speed").value);
  localStorage.setItem("snakeSpeed", snakeSpeed);
  snakeSpeedInterval = setInterval(gameLoop, snakeSpeed);
}

function openMenu() {
  document.getElementById("menu").style.display = "flex";
  document.getElementById("menu").style["flex-direction"] = "column";
  document.getElementById("gameContainer").style.display = "none";
}

function showInstructions() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("instructions").style.display = "block";
}

function backToMenu() {
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("instructions").style.display = "none";
  document.getElementById("gamePaused").style.display = "none";
  resetGame();
  openMenu();
}

function pauseGame() {
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("gamePaused").style.display = "flex";
  document.getElementById("gamePaused").style["flex-direction"] = "column";

  if (snakeSpeedInterval) clearInterval(snakeSpeedInterval);
}

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
    case "Escape":
    case " ":
      if (document.getElementById("gameContainer").style.display === "block")
        pauseGame();
      break;
    case "Enter":
      if (
        document.getElementById("gamePaused").style.display === "flex" ||
        document.getElementById("menu").style.display === "flex" ||
        document.getElementById("menu").style.display === ""
      )
        startGame();
      break;
  }
});
