
var op = -1;
var score = 0;
var timeLeft = 30;
var timer;
var squareMoveInterval;
var squareSpeed = 1000; // Default speed for easy mode

function opcoes() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("dificuldades").style.display = "inline";
}

function setDifficulty(difficulty) {
    op = difficulty;
}

function startGame() {
    if (op === -1) {
        window.alert("Ainda não selecionou o modo de jogo");
    } else {
        document.getElementById("dificuldades").style.display = "none";
        document.getElementById("jogo").style.display = "inline";
        score = 0;
        timeLeft = 30;
        document.getElementById('background-music').play();
        updateScore();
        updateTimer();
        updateHighScore();
        placeSquare();
        timer = setInterval(updateTimer, 1000);
        if (op === 0) { // Easy
            squareSpeed = 1000;
        } else if (op === 1) { // Medium
            squareSpeed = 700;
        } else if (op === 2) { // Hard
            squareSpeed = 500;
        } else if (op === 3) { // Special Mode
            squareSpeed = 500;
            squareMoveInterval = setInterval(placeSquare, squareSpeed);
        }
    }
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