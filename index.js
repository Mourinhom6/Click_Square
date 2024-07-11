
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const pauseButton = document.getElementById('pause-button');
const muteButton = document.getElementById('mute-button');
const tryAgain = document.getElementById('try-again-nav');
const backMenu = document.getElementById('back-menu-nav');
const leftArrow = document.getElementById('left-arrow');
var op = -1;
var music1 = new Audio();
var music2 = new Audio();
var music3 = new Audio();
var music4 = new Audio();
music1.src = "palhaço.mp3";
music2.src = "NARUTOShippudenOP6.mp3";
music3.src = "rushE.mp3";
music4.src = "DragonBall.mp3";

var inichose = [4, 6, 8, 4];
var inicolor = [100, 25, 2, 100000];
var inispecial = [20, 15, 10, 10];
var ascspeed = [1, 2, 4, 2];
var ascsize = [2.5, 2, 1, 2];
var initime = [1, 1.5, 2, 3];
var ascpoints = [1, 1.25, 2.5, 5];
var colorsort = ["#ff0000", "#ff4000", "#ff8000", "#ffbf00", "#ffff00", "#bfff00", "#80ff00", "#40ff00", "#00ff00", "#00ff40", "#00ff80", "#00ffbf", "#00ffff", "#00bfff", "#0080ff", "#0040ff", "#0000ff", "#4000ff", "#8000ff", "#bf00ff", "#ff00ff", "#ff00bf", "#ff0080", "#ff0040", "#ff0000"];

var squareCatcher;
const maxSquares = 10;
const gameDuration = 60;
let elapsedTime = 0;
let squares = [];
const squareSize = 20 * 2.5;
const spawnInterval = 1000 / 4;
const gameEndScore = 0;
let score = 0;
let gamePaused = false;
let gameInterval;
let gameTimeout;

function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}
pauseButton.addEventListener('click', togglePause);
tryAgain.addEventListener('click', tryAgainFunction);
backMenu.addEventListener('click', backMenuFunction);
muteButton.addEventListener('click', toggleMute);
leftArrow.addEventListener('click', backMenuFunction);

function opcoes() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("dificuldades").style.display = "block";
}

function setDifficulty(difficulty) {
    op = difficulty;
}

function startGame() {
    if (op === -1) return;
    document.getElementById("dificuldades").style.display = "none";
    document.getElementById("jogo").style.display = "inline";
    score = 0;
    elapsedTime = 30;
    scoreElement.textContent = score;
    timerElement.textContent = gameDuration;
    gameInterval = setInterval(updateGame, 1000 / 60);
    gameTimeout = setTimeout(endGame, gameDuration * 1000);
    squares = [];
    switch (op) {
        case 0:
            music1.play();
            break;
        case 1:
            music2.play();
            break;
        case 2:
            music3.play();
            break;
        case 3:
            music4.play();
            break;
    }
}
function updateGame() {
    if (gamePaused) return;
    elapsedTime += 1 / 60;
    timerElement.textContent = (gameDuration - elapsedTime).toFixed(0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (elapsedTime * 1000 % spawnInterval < 16.67) {
        spawnSquare();
    }

    squares.forEach(square => {
        square.y += inispecial[op];
        ctx.fillStyle = square.color;
        ctx.fillRect(square.x, square.y, square.size, square.size);
        if (square.y > canvas.height) {
            endGame();
        }
    });

    squares = squares.filter(square => square.y <= canvas.height);

    saveSession();
}

function spawnSquare() {
    const x = Math.random() * (canvas.width - squareSize);
    const y = -squareSize;
    const color = colorsort[Math.floor(Math.random() * colorsort.length)];
    squares.push({ x, y, size: squareSize, color });
}

function placeSquare() {
    var square = document.getElementById("square");
    var gameArea = document.getElementById("jogo");
    var maxWidth = gameArea.clientWidth - square.clientWidth;
    var maxHeight = gameArea.clientHeight - square.clientHeight;
    var randomX = Math.floor(Math.random() * maxWidth);
    var randomY = Math.floor(Math.random() * maxHeight);
    square.style.left = randomX + "px";
    square.style.top = randomY + "px";
}

function handleSquareClick() {
    score++;
    document.getElementById('click-sound').play();
    updateScore();
    if (op !== 3) { // If not in special mode, place square on click
        placeSquare();
    }
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

function updateTimer() {
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        if (op === 3) { // Clear the interval if in special mode
            clearInterval(squareMoveInterval);
        }
        endGame();
    }
}

function saveSession() {
    const sessionData = {
        op,
        score,
        elapsedTime,
        squares,
        music1Time: music1.currentTime,
        music2Time: music2.currentTime,
        music3Time: music3.currentTime,
        music4Time: music4.currentTime
    };
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
}

function loadSession() {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    if (sessionData) {
        op = sessionData.op;
        score = sessionData.score;
        elapsedTime = sessionData.elapsedTime;
        squares = sessionData.squares;
        music1.currentTime = sessionData.music1Time;
        music2.currentTime = sessionData.music2Time;
        music3.currentTime = sessionData.music3Time;
        music4.currentTime = sessionData.music4Time;
    }
}

function backMenuFunction() {
    closeNav();
    document.getElementById("jogo").style.display = "none";
    document.getElementById("menu").style.display = "block";
    clearInterval(gameInterval);
    clearTimeout(gameTimeout);
    score = 0;
    elapsedTime = 0;
    gamePaused = false;
    squares = [];
}

function tryAgainFunction() {
    closeNav();
    startGame();
}

function togglePause() {
    gamePaused = !gamePaused;
}

function toggleMute() {
    const isMuted = music1.muted;
    music1.muted = !isMuted;
    music2.muted = !isMuted;
    music3.muted = !isMuted;
    music4.muted = !isMuted;
    muteButton.src = isMuted ? 'sound.png' : 'mute.png';
}

function endGame() {
    clearInterval(gameInterval);
    clearTimeout(gameTimeout);
    openNav();
    document.getElementById("pontfn").textContent = `A sua pontuação total é: ${score}`;
}

function updateHighScore() {
    var highScore = localStorage.getItem('highScore') || 0;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    document.getElementById("high-score").innerText = "High Score: " + highScore;
}
function restartGame() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("menu").style.display = "inline";
}