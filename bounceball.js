"using strict";

//Create a canvas and draw on it
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//printing red square on the canvas
// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// //printing a green circle
// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI*2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

// //using stroke() instead of fill() to only color the outer stroke not the whole figure
// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = "rgba(0, 0, 225, 0.5)";
// ctx.stroke();
// ctx.closePath();


//Move the ball
//Defining a drawing loop

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;    //taken to make the ball appear that it is moving after every frame has been drawn
var dy = -2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
//Setting up the brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for(var c=0; c<brickColumnCount; c++)
{
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++)
    {
        bricks[c][r] = {x:0, y:0, status:1};
    }
}

function drawBall() 
{
    //drawing code
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//move the ball
function draw()
{
    //Clearing the canvas before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    //Bounce off the walls
    //Simple collision detection
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius)  //bouncing off left to right
    {
        dx = -dx;
    }

    if( y + dy < ballRadius)  //bouncing off the top and bottom edges
    {
        dy = -dy;
    }
    else if (y + dy > canvas.height-ballRadius)
    {
        if(x > paddleX && x < paddleX + paddleWidth)
        {
            dy = -dy;
        }
        else
        {
           lives--;
           if(!lives)
           {
               alert("GAME OVER");
               document.location.reload();
               //clearInterval(interval);
           }
           else
           {
               x = canvas.width / 2;
               y = canvas.height - 30;
               dx = 2;
               dy = -2;
               paddleX = (canvas.width-paddleWidth) / 2;
           }
        }
        
    }
    x += dx;  //so that ball will be painted in the new position on every update
    y += dy; 

    //paddle moving logic
    if(rightPressed)
    {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width)
        {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed)
    {
        paddleX -= 7;
        if (paddleX < 0)
        {
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);
}

//Paddle and keyboard control
//Defining a paddle to hit the ball


//to draw the paddle
function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//Allowing the user to control the paddle
var rightPressed = false;
var leftPressed = false;

//Keyboard and mouse event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e)
{
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width)
    {
        paddleX = relativeX - paddleWidth/2;
    }
}




function keyDownHandler(e)
{
    if(e.key == "Right" || e.key == "ArrowRight")
    {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft")
    {
        leftPressed = true;
    }
}

function keyUpHandler(e)
{
    if(e.key == "Right" || e.key == "ArrowRight")
    {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft")
    { 
        leftPressed = false;
    }
    
}


//Build the brick field
//Brick drawing logic
function drawBricks() 
{
    for(var c = 0; c < brickColumnCount; c++)
    {
        for(var r = 0; r < brickRowCount; r++)
        {
            if(bricks[c][r].status == 1)
            {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();

            }
            
        }
    }
}

//Collision detection function
function collisionDetection()
{
    for(var c = 0; c < brickColumnCount; c++)
    {
        for(var r = 0; r < brickRowCount; r++)
        {
            var b = bricks[c][r];
            if(b.status == 1) 
            {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight)
                {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount)
                    {
                        alert("YOU WIN, CONGRATULATIONS!!");
                        document.location.reload();
                        //clearInterval(interval);  //Needed for chrome to end game
                    }
                }
            }
            
        }
    }
}
//Counting the score
function drawScore()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

//Giving lives to the player
function drawLives()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}
//var interval = setInterval(draw, 10);
draw();




