class Obstacle {
  constructor(game, x) {
    this.game = game;
    this.spriteWidth = 120;
    this.spriteHeight = 120;
    this.scaledHeight = this.spriteHeight * this.game.ratio;
    this.scaledWidth = this.spriteWidth * this.game.ratio;
    this.y = Math.random() * (this.game.height - this.scaledHeight);
    this.x = x;
    this.acceleration = 0.005;  // Acceleration factor
   
    this.speed= 1.5; 
    this.speedY = Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;
    this.collisionX;
    this.collisionY;
    this.collisionRadius = this.scaledWidth * 0.3;
    this.markedForDeletion = false;
    this.image = document.getElementById(`asteroids`);
    this.debug = false;
  
    this.frameX = Math.floor(Math.random() * 4)
  }

  update() {
    
    this.speed += this.acceleration
    this.x -= this.speed ;
    this.y += this.speedY;
    //this.x -= this.speedX; // Diagonal speed
    //this.y += this.speedY;
    this.collisionX = this.x + this.scaledWidth * 0.5;
    this.collisionY = this.y + this.scaledHeight * 0.5;
    if (!this.game.gameOver) {
      if (this.y <= 0 || this.y >= this.game.height - this.scaledHeight) {
        this.speedY *= -1;
      }
    } else {
      this.speedY += 0.2;
    }
   

    if (this.isOffScreen()) {
      if (!this.game.gameOver) {
        this.markedForDeletion = true;
        this.game.obstacles = this.game.obstacles.filter(obstacle => !obstacle.markedForDeletion);
      }
    
      if (this.game.obstacles.length <= 0) this.game.gameOver = true;
     
    }
    
    if (this.game.checkCollision(this, this.game.player)&&!this.game.remainingAsteroidsSet) {
      this.game.gameOver = true;
      this.game.player.collided = true;
      this.game.player.stopCharge();}
      this.game.remainingAsteroids = this.game.obstacles.length;
      this.game.remainingAsteroidsSet = true; // Set the flag to true
      this.game.audio.playExplosionSound();
      this.game.audio.playStopBackgroundMusic();
      //this.game.audio.playLosingSound();
      
    }
    
  

  draw() {
    
    this.game.ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.scaledWidth, this.scaledHeight)
    if (this.game.debug) {
      this.game.ctx.beginPath();
      this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
      this.game.ctx.stroke();
    }
  }

  resize() {
    this.scaledHeight = this.spriteHeight * this.game.ratio;
    this.scaledWidth = this.spriteWidth * this.game.ratio;
    this.collided = false;
  }

  isOffScreen() {
    return this.x < -this.scaledWidth || this.y > this.game;
  }
  

  
}