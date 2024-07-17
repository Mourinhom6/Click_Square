
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
const squareSize = 20 * ascsize[op];
scoreElement.textContent = parseInt(0);
function sessaolog(){
    window.location.href = "bkoficebig.php";
}

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("dificuldades").style.display = "none";
    document.getElementById("jogo").style.display = "flex";
    squareCatcher;
    elapsedTime = 0;
    squares = [];
    let isPaused = false;
    let isMuted = false;
    let ishadowrepeat = false;  //add (to compare between noidea and alltogether)
    let specialSquare = null;
    let catcher= false; //mode in Developement
    let navopen=false;
    let squareInterval;
    let createSquareInterval;
    const squareSize = 20 * ascsize[op];
    scoreElement.textContent = parseInt(0);
    function createSquare() {
        if (!isPaused && squares.length < maxSquares && elapsedTime < gameDuration) {
            const isSpecial = Math.floor(Math.random() * inispecial[op]) === 0;
            if ((op === 3)&&(catcher === false)) {  //mode in Developement
                catcher=true;
                squareCatcher={
                    x: Math.random() * (canvas.width - squareSize),
                    y: Math.random() * (canvas.height - squareSize),
                    speed: ascspeed[op],
                };
            }
            const square = {
                x: Math.random() * (canvas.width - squareSize),
                y: Math.random() * (canvas.height - squareSize),
                direction: Math.random() < 0.083 ? 'horizontal-right' :
                    Math.random() < 0.167 ? 'horizontal-left' :
                    Math.random() < 0.25 ? 'vertical-up' :
                    Math.random() < 0.333 ? 'vertical-down' :
                    Math.random() < 0.5 ? 'diagonal-left-up' :
                    Math.random() < 0.667 ? 'diagonal-left-down' :
                    Math.random() < 0.833 ? 'diagonal-right-down' : 'diagonal-right-up',
                speed: Math.floor((Math.random() * 2) + 1) * ascspeed[op],
            };
            if (isSpecial && !specialSquare) {
                square.color = 'gold';
                square.points = 100 * ascpoints[op];
                specialSquare = square;
            } 
            else {
                square.color = 'black';
                square.points = 20 * ascpoints[op];
            }
            square.draw = function () {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, squareSize, squareSize);
            };   
            function addSquareClickListener(square) {
                if (elapsedTime < gameDuration) {
                    canvas.addEventListener('click', function(event) {
                        if (!isPaused) {
                            const mouseX = event.clientX - canvas.getBoundingClientRect().left;
                            const mouseY = event.clientY - canvas.getBoundingClientRect().top;
                            if (mouseX >= square.x && mouseX <= square.x + squareSize && mouseY >= square.y && mouseY <= square.y + squareSize) {
                                removeSquare(square);
                            }  
                        }
                    });
                }
            }
            if(op != 3){    //bc mode in Developement   //different (to compare between noidea and alltogether)
                addSquareClickListener(square);
            }
            squares.push(square);
        }
    }
    function removeSquare(square) {
        if (elapsedTime < gameDuration) {
            const index = squares.indexOf(square);
            squares.splice(index, 1);
            scoreElement.textContent = parseInt(scoreElement.textContent) + (20 * ascpoints[op]);
            if (square === specialSquare) {
                specialSquare = null;
                elapsedTime-= 5*initime[op];
            }
            if (squares.length === 0) {
                scoreElement.textContent = parseInt(scoreElement.textContent) + (100 * ascpoints[op]);
                elapsedTime-= 5*initime[op];
                for (let i = 0; i < inichose[op]; i++) {
                    createSquare();
                }
            }
        }
    } 
    function drawCatcher() {    //mode in Developement
        ctx.fillStyle = 'blue'; 
        ctx.fillRect(squareCatcher.x, squareCatcher.y, squareSize, squareSize);
    }
    function movecatcher(event) {   //mode in Developement
        if (catcher) { 
            catcher.x = event.clientX - canvas.getBoundingClientRect().left;
            catcher.y = event.clientY - canvas.getBoundingClientRect().top;
            movecatcherBoundaries(); // Ensure the catcher stays within the canvas
        }
    }
    function updateSquarePositions() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateTimer();
        random();
        if (op === 3) { //bc mode in Developement      // Special mode
            movecatcherBoundaries();
            squareCatcher.x += squareCatcher.speed;
            squareCatcher.y += squareCatcher.speed;
        
            for (let i = 0; i < squares.length; i++) {
                const square = squares[i];
                // Check for collision with the special mode catcher
                if (
                    square.x < squareCatcher.x + squareSize &&
                    square.x + squareSize > squareCatcher.x &&
                    square.y < squareCatcher.y + squareSize &&
                    square.y + squareSize > squareCatcher.y
                ) {
                    removeSquare(square);
                }
                draw();
                drawCatcher();
            }
        } 
        else {
            for (let i = 0; i < squares.length; i++) {
                const square = squares[i];
                switch (square.direction) {
                    case 'horizontal-right':
                        square.x += square.speed;
                        if (square.x + squareSize > canvas.width) {
                            square.direction = 'horizontal-left';
                            square.x = canvas.width - squareSize;
                        }
                        break;
                    case 'horizontal-left':
                        square.x -= square.speed;
                        if (square.x < 0) {
                            square.direction = 'horizontal-right';
                            square.x = 0;
                        }
                        break;
                    case 'vertical-down':
                        square.y += square.speed;
                        if (square.y + squareSize > canvas.height) {
                            square.direction = 'vertical-up';
                            square.y = canvas.height - squareSize;
                        }
                        break;
                    case 'vertical-up':
                        square.y -= square.speed;
                        if (square.y < 0) {
                            square.direction = 'vertical-down';
                            square.y = 0;
                        }
                        break;
                    case 'diagonal-right-up':
                        square.x += square.speed;
                        square.y -= square.speed;
                        if (square.x + squareSize > canvas.width) {
                            square.direction = 'diagonal-left-up';
                            square.x = canvas.width - squareSize;
                        }
                        if (square.y < 0) {
                            square.direction = 'diagonal-right-down';
                            square.y = 0;
                        }
                        break;
                    case 'diagonal-right-down':
                        square.x += square.speed;
                        square.y += square.speed;
                        if (square.x + squareSize > canvas.width) {
                            square.direction = 'diagonal-left-down';
                            square.x = canvas.width - squareSize;
                        }
                        if (square.y + squareSize > canvas.height) {
                            square.direction = 'diagonal-right-up';
                            square.y = canvas.height - squareSize;
                        }
                        break;
                    case 'diagonal-left-up':
                        square.x -= square.speed;
                        square.y -= square.speed;
                        if (square.x < 0) {
                            square.direction = 'diagonal-right-up';
                            square.x = 0;
                        }
                        if (square.y < 0) {
                            square.direction = 'diagonal-left-down';
                            square.y = 0;
                        }
                        break;
                    case 'diagonal-left-down':
                        square.x -= square.speed;
                        square.y += square.speed;
                        if (square.x < 0) {
                            square.direction = 'diagonal-right-down';
                            square.x = 0;
                        }
                        if (square.y + squareSize > canvas.height) {
                            square.direction = 'diagonal-left-up';
                            square.y = canvas.height - squareSize;
                        }
                        break;
                    default:
                        break;
                }
                square.draw();
            }
        }
    }
    function movecatcherBoundaries(){   //mode in Developement
        if (squareCatcher.x < 0) {squareCatcher.x = 0;}
        if (squareCatcher.x + squareSize > canvas.width) {squareCatcher.x = canvas.width - squareSize;}
        if (squareCatcher.y < 0) {squareCatcher.y = 0;}
        if (squareCatcher.y + squareSize > canvas.height) {squareCatcher.y = canvas.height - squareSize;}
    }
    function random() { //function responsible for turning the game more random
        var randombcolr = Math.floor((Math.random() * inicolor[op]) + 1); //sets a random probabily of inicolor[op]/nºfps
        if (randombcolr == 2) { //related back color
            canvas.style.backgroundColor = colorsort[Math.floor((Math.random() * colorsort.length) + 1)];
        }
    }
    
    function toggleMute() {
        isMuted = !isMuted;
        music1.muted = isMuted;
        music2.muted = isMuted;
        music3.muted = isMuted;
        music4.muted = isMuted;
        muteButton.src = isMuted ? 'soundicon.png' : 'sound.png';
    }

    function retryGame() {
        // ishadowrepeat=true;
        closeNav(); 

        music1.pause();
        music2.pause();
        music3.pause();
        music4.pause();
        isMuted = true; 
        toggleMute();
        clearInterval(squareInterval);
        clearInterval(createSquareInterval);

        startGame();
        // returnToMenu();
    }
  
    function returnToMenu(){ //!working
        if(openNav){
            closeNav();
        } 
        music1.pause();
        music2.pause();
        music3.pause();
        music4.pause();
        isMuted = true; // Mute the music
        toggleMute();
        clearInterval(squareInterval);
        clearInterval(createSquareInterval);

        document.getElementById("jogo").style.display = "none";
        document.getElementById("dificuldades").style.display = "inline";
        
        // if(ishadowrepeat==true){
        //     startGame();
        // }
    }

    function updateTimer() {
        elapsedTime += 0.02; // Adjust this value based on your frame rate
        const remainingTime = Math.max(0, gameDuration - Math.floor(elapsedTime));
        timerElement.textContent = remainingTime;
        if (remainingTime === 0) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(squareInterval);
        clearInterval(createSquareInterval);
        if(op==3){canvas.removeEventListener('click', movecatcher);}   //mode in Developement
            music1.pause();
            music2.pause();
            music3.pause();
            music4.pause();
            isMuted = true; // Mute the music
            toggleMute();
            openNav();
    }
    function openNav() {
        navopen=true;
        document.getElementById("myNav").style.height = "100%";
        document.getElementById("pontfn").innerHTML = scoreElement.textContent;
    }
    
    function closeNav() {
        navopen=false;
        document.getElementById("myNav").style.height = "0%";
    }
    function pauseGame() {
        isPaused = !isPaused;
        if(isPaused==false){
            isMuted = true;
            muteButton.addEventListener('click', toggleMute);
            squareInterval = setInterval(updateSquarePositions, 20);
            createSquareInterval = setInterval(createSquare, 1000);
        }
        else{
            isMuted = false;
            removeEventListener("click", toggleMute);
            clearInterval(squareInterval);
            clearInterval(createSquareInterval)
        }
        toggleMute();
    }
    
    squareInterval = setInterval(updateSquarePositions, 20);
    createSquareInterval = setInterval(createSquare, 1000);

    if(op==3){canvas.addEventListener('click', movecatcher);} 
    muteButton.addEventListener('click', toggleMute);
    pauseButton.addEventListener('click', pauseGame);
    backMenu.addEventListener('click', returnToMenu);
    tryAgain.addEventListener('click', retryGame);
    leftArrow.addEventListener('click', returnToMenu);
}