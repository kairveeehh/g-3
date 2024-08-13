const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const finalScoreElement = document.getElementById('finalScore');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let fruits = [];
let bombs = [];
let gameLoop;
let gameActive = false;

const fruitTypes = [
    { name: 'apple', color: 'red', radius: 30, points: 1 },
    { name: 'orange', color: 'orange', radius: 35, points: 2 },
    { name: 'watermelon', color: 'green', radius: 40, points: 3 },
];

function createFruit() {
    const type = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    return {
        x: Math.random() * canvas.width,
        y: canvas.height + type.radius,
        dy: -Math.random() * 3 - 2,
        ...type
    };
}

function createBomb() {
    return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        dy: -Math.random() * 3 - 2,
        radius: 20,
        color: 'black'
    };
}

function update() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.02) {
        fruits.push(createFruit());
    }

    if (Math.random() < 0.005) {
        bombs.push(createBomb());
    }

    fruits = fruits.filter(fruit => {
        fruit.y += fruit.dy;
        drawFruit(fruit);
        return fruit.y + fruit.radius > 0;
    });

    bombs = bombs.filter(bomb => {
        bomb.y += bomb.dy;
        drawBomb(bomb);
        return bomb.y + bomb.radius > 0;
    });

    gameLoop = requestAnimationFrame(update);
}

function drawFruit(fruit) {
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
    ctx.fillStyle = fruit.color;
    ctx.fill();
    ctx.closePath();
}

function drawBomb(bomb) {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fillStyle = bomb.color;
    ctx.fill();
    ctx.closePath();
}

function sliceObject(objects, x, y) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        const dx = x - obj.x;
        const dy = y - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < obj.radius) {
            objects.splice(i, 1);
            return obj;
        }
    }
    return null;
}

function gameOver() {
    gameActive = false;
    cancelAnimationFrame(gameLoop);
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

canvas.addEventListener('mousemove', (event) => {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const slicedFruit = sliceObject(fruits, mouseX, mouseY);
    if (slicedFruit) {
        score += slicedFruit.points;
        scoreElement.textContent = score;
    }

    const slicedBomb = sliceObject(bombs, mouseX, mouseY);
    if (slicedBomb) {
        gameOver();
    }
});

function startGame() {
    score = 0;
    fruits = [];
    bombs = [];
    scoreElement.textContent = score;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameActive = true;
    update();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);