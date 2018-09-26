var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;
var ctx = canvas.getContext("2d");
let redrawCount = 0;
// boolean to see if game has started yet
let isLive = false;

// Change in x or y
let change = .5;

// Keypressed booleans
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

// Paddle properties
let paddleHeight = 76;
let paddleWidth = 10;


let p1Score = 0;
let p2Score = 0;
let paddle1Y = canvas.height / 2 - paddleHeight / 2;
let paddle2Y = paddle1Y;
// Ball properties
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let dy;
let dx;
initBoard();

// Draws the objects in their starting states
function initBoard() {
    paddle1Y = canvas.height / 2 - paddleHeight / 2;
    paddle2Y = paddle1Y;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    let ranNumb = Math.floor(Math.random() * 4);
    switch (ranNumb) {
        case 0: dy = -change;
            dx = -change;
            break;
        case 1: dy = -change;
            dx = change;
            break;
        case 2: dy = change;
            dx = -change;
            break;
        case 3: dy = change;
            dx = change;
            break;
    }
    draw();
}

// Release key
function keyUpHandler(e) {
    if (e.keyCode == 38) {
        upPressed = false;
    } else if (e.keyCode == 40) {
        downPressed = false;
    } else if (e.keyCode == 87) {
        wPressed = false;
    } else if (e.keyCode == 83) {
        sPressed = false;
    }
}

// Press key
function keyDownHandler(e) {
    if (e.keyCode == 38) {
        upPressed = true;
    } else if (e.keyCode == 40) {
        downPressed = true;
    } else if (e.keyCode == 87) {
        wPressed = true;
    } else if (e.keyCode == 83) {
        sPressed = true;
    }
}

function verticalCollision() {
    if (ballY + dy >= canvas.height || ballY + dy <= 0) {
        dy = -dy;
    }
}

function hitsLeftPaddle() {
    return ballX - ballRadius <= paddleWidth && (ballY >= paddle1Y - 4 && ballY <= paddle1Y + paddleHeight + 4);
}

function hitsRightPaddle() {
    return ballX + ballRadius >= canvas.width - paddleWidth && (ballY >= paddle2Y - 4 && ballY <= paddle2Y + paddleHeight + 4);
}

// Collision with wall or paddle
function leftCollision() {
    if (hitsLeftPaddle()) {
        dx = -dx;
    } else if (ballX + dx < 0) {
        p2Score++;
        initBoard();
    }
    if (p2Score >= 1) {
        alert("Congratulations player 1! YOU WIN!");
        p2Score = 0;
        // document.location.reload();
        window.location = "index.html";
    }
}

// Collision with wall or paddle
function rightCollision() {
    if (hitsRightPaddle()) {
        dx = -dx;
    } else if (ballX + dx > canvas.width) {
        p1Score++;
        initBoard();
    }
    if (p1Score >= 1) {
        alert("Congratulations player 1! YOU WIN!");
        p1Score = 0;
        // document.location.reload();
        window.location = "index.html";
    }
}

function accelerateBall(rate) {
    // Slowly accelerates ball
    if (dx > 0) {
        dx += rate;
    } else {
        dx -= rate;
    }
    if (dy > 0) {
        dy += rate;
    } else {
        dy -= rate;
    }
}

function drawPaddles() {
    //  Draw left paddle
    ctx.beginPath();
    ctx.rect(0, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    // Draw right paddle
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}


function updatePositions() {
    if (upPressed && paddle2Y - 1 > 0) {
        paddle2Y -= 7;
    }
    if (downPressed && paddle2Y + paddleHeight + 1 < canvas.height) {
        paddle2Y += 7;
    }
    if (wPressed && paddle1Y - 1 > 0) {
        paddle1Y -= 7;
    }
    if (sPressed && paddle1Y + paddleHeight + 1 < canvas.height) {
        paddle1Y += 7;
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player 1 Score: " + p1Score, 10, 20);
    ctx.fillText("Player 2 Score: " + p2Score, canvas.width - 145, 20);
}

function draw() {
    // Clear the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();

    // Adjust y values based on keyPresses
    updatePositions();
    // paddle1Y = ballY - paddleHeight / 2;
    // Call any collisions and draw objects
    verticalCollision();
    leftCollision();
    rightCollision();
    drawPaddles();
    if (isLive) {
        drawBall();
    }

    if (redrawCount % 10 === 0) {
        accelerateBall(.000000);
    }
    // Moves the ball
    ballX += dx;
    ballY += dy;

    redrawCount++;

}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let playGame = () => {
    isLive = true;
    setInterval(draw, 10);
    document.getElementById("radios").style.display = "none";
    document.getElementById("playButton").style.display = "none";
}
