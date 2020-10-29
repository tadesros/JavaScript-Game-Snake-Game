//Variable Declarations
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//Get width and height from canvas element
var width = canvas.width;
var height = canvas.height;

//Variables for grid work out block sizes
var blockSize = 10;
var widthInBlocks = width/blockSize;
var heightInBlocks = height/blockSize;

//define the score
var score = 0;


/********************************** */
/********Draw Border*************** */
/********************************* */
var drawBorder = function(){
   ctx.fillStyle = "Gray";
   ctx.fillRect(0,0,width,blockSize);
   ctx.fillRect(0,height-blockSize,width,blockSize);
   ctx.fillRect(0,0,blockSize,height);
   ctx.fillRect(width-blockSize,0,blockSize,height);
};
/********************************** */
/********Display the Score********* */
/********************************* */
var drawScore = function(){
  ctx.font = "20px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: "+ score,blockSize,blockSize);
};
/********************************** */
/*****Game Over      ************** */
/********************************* */
var gameOver = function(){
 //Cancels the setInterval animation
  clearInterval(intervalId);
 //Show the game over information
  ctx.font = "60px Coourier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over",width/2,height/2);
};
/********************************** */
/***** Draw Circle ************** */
/********************************* */
var circle = function(x,y,radius,fillCircle){

  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI *2,false);

  if(fillCircle){

      ctx.fill();
  }else{
    ctx.stroke();
  }
};

//Constructor for the block
var Block = function (col,row){
   this.col = col;
   this.row = row;
};

//Add methods to block
Block.prototype.drawSquare = function(color){

 var x = this.col * blockSize;
 var y = this.row * blockSize;
 ctx.fillStyle = color;
 ctx.fillRect(x,y,blockSize,blockSize);
};
//Add methods drawCircle 
Block.prototype.drawCircle = function(color){

 var centerX = this.col * blockSize + blockSize/2;
 var centerY = this.row * blockSize + blockSize/2;

 ctx.fillStyle = color;
 circle(centerX,centerY,blockSize/2,true);

};
//Check if two block objects are equal
Block.prototype.equal = function(otherBlock)
{
  return this.col === otherBlock.col && this.row === otherBlock.row;
};

//Snake object Constructor
var Snake = function() {
  
  this.segments = [  
   new Block(7,5),
   new Block(6,5),
   new Block(5,5)
  ];

  this.direction = "right";
  this.nextDirection = "right";
};

//Draw method
Snake.prototype.draw = function(){

  for(var i =0; i<this.segments.length;i++){
      this.segments[i].drawSquare("Blue");
  }
};
//Move prototype
Snake.prototype.move = function(){
  
  var head = this.segments[0];
  var newHead;

  this.direction = this.nextDirection;

  if(this.direction==="right"){
      newHead = new Block(head.col + 1, head.row);
  }else if(this.direction==="down")  {
      newHead = new Block(head.col,head.row+1);
  }else if(this.direction ==="left"){
      newHead = new Block(head.col - 1,head.row);
  }else if(this.direction ==="up"){
      newHead = new Block(head.col,head.row-1);
  }
//Check if snake hit itself
if(this.checkCollision(newHead)){
  gameOver();
  return;
}
//Didnn't collide
this.segments.unshift(newHead);
//Check if hit apple
if(newHead.equal(apple.position)){
  score++;
  apple.move();
}else{
   this.segments.pop();
}
};
//Check Collision method
Snake.prototype.checkCollision = function(head){

  var leftCollision = (head.col ===0);
  var topCollision = (head.row ===0);
  var rightCollision = (head.col === widthInBlocks -1);
  var bottomCollision = (head.row === heightInBlocks - 1);

  var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
  
  var selfCollision = false;

  for(var i = 0; i < this.segments.length; i++)
  {
     if(head.equal(this.segments[i])){
       selfCollision = true;
     }

  }
return wallCollision || selfCollision;
};

//Snake Prototype - set direction
Snake.prototype.setDirection = function (newDirection){

//invalid movement
if(this.direction ==="up" && newDirection === "down")
{
  return;
} else if (this.direction === "right" && newDirection ==="left"){
   return;
}else if(this.direction === "down" && newDirection ==="up"){
   return;
}else if(this.direction === "left" && newDirection ==="right"){
   return;
}

this.nextDirection = newDirection;

};

//Apple Object Constructor
var Apple = function() {

   this.position = new Block(10,10);

};

Apple.prototype.draw = function(){

  this.position.drawCircle("LimeGreen");

};

Apple.prototype.move = function(){

   var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;

   var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;

   this.position = new Block(randomCol,randomRow);

};


//Create the snake and apple objects
var snake = new Snake();
var apple = new Apple();

//Call the set interval function
var intervalId = setInterval(function(){

//Clear the screen
ctx.clearRect(0,0,width,height);
//Draw the score
drawScore();
//Move Snake
snake.move();
//draw snake
snake.draw();
//draw apple
apple.draw();
//draw border
drawBorder();
},100);

//convert keycodes to directions
var directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};


//Click Event on the body
$("body").keydown(function(event){

  var newDirection = directions[event.keyCode];

  if(newDirection !== undefined) {
     snake.setDirection(newDirection);
  }
});
















