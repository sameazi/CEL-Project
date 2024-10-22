const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const questionContainer = document.getElementById('questionContainer');
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
const option3 = document.getElementById('option3');
const livesText = document.getElementById('lives');

let backgroundMusic = new Audio('sounds/background.mp3');
let winMusic = new Audio('sounds/win.mp3');
let loseMusic = new Audio('sounds/lose.mp3');

let miloNeutral = new Image();
let miloHappy = new Image();
let miloSad = new Image();
let monsterImg = new Image();

miloNeutral.src = 'images/milo-neutral.png';
miloHappy.src = 'images/milo-happy.png';
miloSad.src = 'images/milo-sad.png';
monsterImg.src = 'images/monster.png';

let currentMilo = miloNeutral; 

let lives = 3;
let currentLevel = 0;
let gameStarted = false;

let trophyImg = new Image();
let forestBackground = new Image();

trophyImg.src = 'images/trophy.png';
forestBackground.src = 'images/forest.png';

trophyImg.onload = checkAllImagesLoaded;
forestBackground.onload = checkAllImagesLoaded;


let questions = [
    {
        question: "What should you do when you feel sad?",
        options: ["Keep it to yourself", "Talk to a friend or grown-up", "Run away"],
        correct: 1
    },
    {
        question: "How can you calm down when you feel angry?",
        options: ["Yell at someone", "Take deep breaths", "Break something"],
        correct: 1
    },
    {
        question: "What is a good way to take care of your mental health?",
        options: ["Eat healthy and play", "Stay awake all night", "Ignore your feelings"],
        correct: 0
    },
    {
        question: "What can you do if a friend feels sad?",
        options: ["Tell them it's not okay to be sad", "Listen and be kind", "Ignore them"],
        correct: 1
    },
    {
        question: "Why is it important to talk about your feelings?",
        options: ["So others can help you", "To get attention", "It doesn't matter"],
        correct: 0
    },
    {
        question: "How can you help yourself feel better when you are upset?",
        options: ["Do something you love", "Be mean to others", "Stay upset"],
        correct: 0
    },
    {
        question: "What should you do if you're feeling worried?",
        options: ["Talk to a grown-up", "Hide your feelings", "Keep it to yourself"],
        correct: 0
    },
    {
        question: "What can you do to help your mind feel peaceful?",
        options: ["Take a deep breath and relax", "Get angry", "Be mean to others"],
        correct: 0
    }
];

let imagesLoaded = 0;
function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        showStartScreen();
    }
}

miloNeutral.onload = checkAllImagesLoaded;
miloHappy.onload = checkAllImagesLoaded;
miloSad.onload = checkAllImagesLoaded;
monsterImg.onload = checkAllImagesLoaded;

document.head.innerHTML += `<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">`;

function resizeCanvas() {
    const aspectRatio = 2;  
    const scale = Math.min(window.innerWidth / canvas.width, window.innerHeight / (canvas.height * aspectRatio));
    canvas.style.width = `${canvas.width * scale}px`;
    canvas.style.height = `${canvas.height * scale}px`;
}
window.addEventListener('resize', resizeCanvas);  

function startGame() {
    gameStarted = true;
    backgroundMusic.loop = true;
    backgroundMusic.play();
    winMusic.pause();
    loseMusic.pause();
    lives = 3;
    currentLevel = 0;
    currentMilo = miloNeutral;
    livesText.innerText = `Lives: ${lives}`;
    livesText.style.display = 'block';  
    questionContainer.style.display = 'block';  
    drawScene();
    displayQuestion();
}

function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillText("Milo's Mindful Adventure", canvas.width / 2, 150);
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText("Help Milo learn about", canvas.width / 2, 200);
    ctx.fillText("mental health by answering", canvas.width / 2, 230);
    ctx.fillText("questions correctly.", canvas.width / 2, 260);
    ctx.fillText("Click 'Start' to begin.", canvas.width / 2, 290);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = "absolute";
    buttonContainer.style.left = "0";
    buttonContainer.style.right = "0";
    buttonContainer.style.top = `${canvas.offsetTop + 400}px`; 
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.zIndex = "1000";
    
    const startButton = document.createElement('button');
    startButton.innerText = "Start";
    startButton.style.fontFamily = '"Press Start 2P", cursive';
    startButton.style.padding = "15px 30px";
    startButton.style.fontSize = "16px";
    startButton.style.cursor = "pointer";
    startButton.style.backgroundColor = "#4CAF50";
    startButton.style.color = "white";
    startButton.style.border = "none";
    startButton.style.borderRadius = "5px";
    startButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    
    startButton.onmouseover = function() {
        this.style.backgroundColor = "#45a049";
    };
    startButton.onmouseout = function() {
        this.style.backgroundColor = "#4CAF50";
    };
    
    startButton.onclick = function() {
        buttonContainer.remove();
        startGame();
    };
    
    buttonContainer.appendChild(startButton);
    document.body.appendChild(buttonContainer);

    window.addEventListener('resize', function() {
        buttonContainer.style.top = `${canvas.offsetTop + 400}px`;
    });
}

function drawSpeechBubble(x, y, width, height, radius) {
    if (typeof radius === 'undefined') {
        radius = 10;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = 'white'; 
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black'; 
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width - 20, y + height);
    ctx.lineTo(x + width - 40, y + height + 20);
    ctx.lineTo(x + width - 60, y + height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);

    const totalHeight = lines.length * lineHeight;
    
    const bubbleHeight = 80; 
    const startY = y + (bubbleHeight - totalHeight) / 2;

    lines.forEach((line, index) => {
        const lineWidth = ctx.measureText(line).width;
        const lineX = x + (maxWidth - lineWidth) / 2; 
        ctx.fillText(line, lineX, startY + (index * lineHeight));
    });
}
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(forestBackground, 0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(currentMilo, 50, 100, 200, 200);
    ctx.drawImage(monsterImg, 550, 100, 200, 200);

    const bubbleX = 250;
    const bubbleY = 20;
    const bubbleWidth = 400;
    const bubbleHeight = 80;

    drawSpeechBubble(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 10);

    ctx.fillStyle = 'black';
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = "left";

    const textX = bubbleX + 20;
    const textY = bubbleY + 20;
    const textMaxWidth = bubbleWidth - 40;
    const lineHeight = 20;

    drawWrappedText(questions[currentLevel].question, textX, textY, textMaxWidth, lineHeight);
}



function displayQuestion() {
    let question = questions[currentLevel];
    option1.innerText = question.options[0];
    option2.innerText = question.options[1];
    option3.innerText = question.options[2];
    
    questionContainer.style.display = 'block';  
}

function checkAnswer(selectedOption) {
    let question = questions[currentLevel];
    
    if (selectedOption === question.correct) {
        currentMilo = miloHappy;
        document.body.style.backgroundColor = '#4CAF50';  
        setTimeout(() => {
            document.body.style.backgroundColor = '#000';  
            nextLevel();
        }, 1000);
    } else {
        currentMilo = miloSad;
        lives--;
        livesText.innerText = `Lives: ${lives}`;
        document.body.style.backgroundColor = '#F44336';  

        setTimeout(() => {
            document.body.style.backgroundColor = '#000';  
            if (lives <= 0) {
                gameOver();
            } else {
                nextLevel();
            }
        }, 1000);
    }
}

function nextLevel() {
    currentLevel++;
    
    if (currentLevel >= questions.length) {
        showWinScreen();
    } else {
        currentMilo = miloNeutral;
        drawScene();
        displayQuestion();
    }
}

function gameOver() {
    backgroundMusic.pause();
    loseMusic.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillText('Game Over', canvas.width / 2, 200);

    questionContainer.style.display = 'none';
    livesText.style.display = 'none';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = "absolute";
    buttonContainer.style.left = "0";
    buttonContainer.style.right = "0";
    buttonContainer.style.top = `${canvas.offsetTop + 400}px`; 
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.zIndex = "1000";
    
    const playAgainButton = document.createElement('button');
    playAgainButton.innerText = "Play Again";
    playAgainButton.style.fontFamily = '"Press Start 2P", cursive';
    playAgainButton.style.padding = "15px 30px";
    playAgainButton.style.fontSize = "16px";
    playAgainButton.style.cursor = "pointer";
    playAgainButton.style.backgroundColor = "#4CAF50";
    playAgainButton.style.color = "white";
    playAgainButton.style.border = "none";
    playAgainButton.style.borderRadius = "5px";
    playAgainButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    
    playAgainButton.onmouseover = function() {
        this.style.backgroundColor = "#45a049";
    };
    playAgainButton.onmouseout = function() {
        this.style.backgroundColor = "#4CAF50";
    };
    
    playAgainButton.onclick = function() {
        buttonContainer.remove();
        resetGame();
    };
    
    buttonContainer.appendChild(playAgainButton);
    document.body.appendChild(buttonContainer);

    
    window.addEventListener('resize', function() {
        buttonContainer.style.top = `${canvas.offsetTop + 400}px`;
    });
}

function resetGame() {
    currentLevel = 0;
    lives = 3;
    livesText.innerText = `Lives: ${lives}`;
    currentMilo = miloNeutral;
    loseMusic.pause();
    winMusic.pause();
    backgroundMusic.play();
    questionContainer.style.display = 'block';  
    livesText.style.display = 'block';  
    drawScene();
    displayQuestion();
}

function showWinScreen() {
    backgroundMusic.pause();
    winMusic.play();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#87CEEB';  
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const trophyWidth = 200;
    const trophyHeight = 200;
    const trophyX = (canvas.width - trophyWidth) / 2;
    const trophyY = 100;
    ctx.drawImage(trophyImg, trophyX, trophyY, trophyWidth, trophyHeight);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillText('Congratulations!', canvas.width / 2, 50);
    
    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('You\'ve completed Milo\'s Mindful Adventure!', canvas.width / 2, 350);
    ctx.fillText('You\'re now a mental health champion!', canvas.width / 2, 380);

    questionContainer.style.display = 'none';
    livesText.style.display = 'none';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = "absolute";
    buttonContainer.style.left = "0";
    buttonContainer.style.right = "0";
    buttonContainer.style.top = `${canvas.offsetTop + 350}px`;  
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.zIndex = "1000";
    
    const playAgainButton = document.createElement('button');
    playAgainButton.innerText = "Play Again";
    playAgainButton.style.fontFamily = '"Press Start 2P", cursive';
    playAgainButton.style.padding = "15px 30px";
    playAgainButton.style.fontSize = "16px";
    playAgainButton.style.cursor = "pointer";
    playAgainButton.style.backgroundColor = "#4CAF50";
    playAgainButton.style.color = "white";
    playAgainButton.style.border = "none";
    playAgainButton.style.borderRadius = "5px";
    playAgainButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    
    playAgainButton.onmouseover = function() {
        this.style.backgroundColor = "#45a049";
    };
    playAgainButton.onmouseout = function() {
        this.style.backgroundColor = "#4CAF50";
    };
    
    playAgainButton.onclick = function() {
        buttonContainer.remove();
        resetGame();
    };
    
    buttonContainer.appendChild(playAgainButton);
    document.body.appendChild(buttonContainer);

    window.addEventListener('resize', function() {
        buttonContainer.style.top = `${canvas.offsetTop + 350}px`;  
    });
}

option1.addEventListener('click', () => checkAnswer(0));
option2.addEventListener('click', () => checkAnswer(1));
option3.addEventListener('click', () => checkAnswer(2));

resizeCanvas();
