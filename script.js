const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

let score = 0;
let lives = 3;

const flipperWidth = 140;
const flipperHeight = 15;

let leftPressed = false;
let rightPressed = false;

const ball = {
    x: 225,
    y: 100,
    radius: 10,
    vx: 4,
    vy: 2
};

const bumpers = [
    { x: 120, y: 180, r: 25 },
    { x: 320, y: 230, r: 25 },
    { x: 220, y: 360, r: 30 },
    { x: 150, y: 450, r: 20 },
    { x: 300, y: 520, r: 20 }
];

document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "a") leftPressed = true;
    if (e.key.toLowerCase() === "d") rightPressed = true;
});

document.addEventListener("keyup", e => {
    if (e.key.toLowerCase() === "a") leftPressed = false;
    if (e.key.toLowerCase() === "d") rightPressed = false;
});

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = 100;
    ball.vx = Math.random() > 0.5 ? 4 : -4;
    ball.vy = 2;
}

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,0,0,canvas.height
        );

    gradient.addColorStop(0,"#000814");
    gradient.addColorStop(1,"#001d3d");

    ctx.fillStyle = gradient;
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function drawBall() {

    ctx.shadowColor = "white";
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "white";
    ctx.fill();

    ctx.shadowBlur = 0;
}

function drawBumpers() {

    bumpers.forEach(b => {

        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 20;

        ctx.beginPath();
        ctx.arc(
            b.x,
            b.y,
            b.r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#00ffff";
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.shadowBlur = 0;
    });
}

function drawFlippers() {

    ctx.fillStyle = "#ff4444";

    ctx.fillRect(
        80,
        leftPressed ? 590 : 620,
        flipperWidth,
        flipperHeight
    );

    ctx.fillStyle = "#44ff44";

    ctx.fillRect(
        230,
        rightPressed ? 590 : 620,
        flipperWidth,
        flipperHeight
    );
}

function updateBall() {

    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vy += 0.08;

    if (
        ball.x <= ball.radius ||
        ball.x >= canvas.width - ball.radius
    ) {
        ball.vx *= -1;
    }

    if (ball.y <= ball.radius) {
        ball.vy *= -1;
    }

    bumpers.forEach(b => {

        const dx = ball.x - b.x;
        const dy = ball.y - b.y;

        const dist =
            Math.sqrt(dx * dx + dy * dy);

        if (
            dist <
            ball.radius + b.r
        ) {

            ball.vx =
                (dx / dist) * 8;

            ball.vy =
                (dy / dist) * 8;

            score += 250;

            scoreElement.textContent =
                score;
        }
    });

    // Flipper esquerdo
    if (
        ball.x > 80 &&
        ball.x < 220 &&
        ball.y > 580 &&
        ball.y < 640
    ) {
        ball.vy = -10;
        ball.vx -= 2;
    }

    // Flipper direito
    if (
        ball.x > 230 &&
        ball.x < 370 &&
        ball.y > 580 &&
        ball.y < 640
    ) {
        ball.vy = -10;
        ball.vx += 2;
    }

    // Limitar velocidade
    ball.vx =
        Math.max(
            -12,
            Math.min(12, ball.vx)
        );

    ball.vy =
        Math.max(
            -12,
            Math.min(12, ball.vy)
        );

    // Perde vida
    if (
        ball.y >
        canvas.height + 20
    ) {

        lives--;

        if (lives <= 0) {

            alert(
                "GAME OVER\nPontuação: " +
                score
            );

            score = 0;
            lives = 3;

            scoreElement.textContent = 0;
        }

        resetBall();
    }
}

function drawLives() {

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    ctx.fillText(
        "Vidas: " + lives,
        20,
        30
    );
}

function draw() {

    drawBackground();

    updateBall();

    drawBumpers();
    drawFlippers();
    drawBall();
    drawLives();

    requestAnimationFrame(draw);
}

resetBall();
draw();
