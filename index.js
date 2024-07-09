
var op = -1;

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
        updateScore();
        updateTimer();
        placeSquare();
        timer = setInterval(updateTimer, 1000);
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
    updateScore();
    placeSquare();
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

function updateTimer() {
    timeLeft--;
    document.getElementById("timer").innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timer);
        endGame();
    }
}

function endGame() {
    document.getElementById("jogo").style.display = "none";
    document.getElementById("final-score").innerText = "Your score is: " + score;
    document.getElementById("game-over").style.display = "flex";
}

function restartGame() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("menu").style.display = "inline";
}