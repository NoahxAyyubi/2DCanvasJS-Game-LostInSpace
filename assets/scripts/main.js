class Game {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height / this.baseHeight;
        this.player = new Player(this);
        this.background = new BackGround(this);
        this.message1;
        this.message2;
        this.minSpeed = 3;
        this.maxSpeed = 10;
        this.touchStartX;
        this.lastTouch;
        this.audio = new Audio();
        this.speed;
        this.gravity = 0.08;
        this.obstacles = [];
        this.numberOfObstacles = 20;
        this.remainingAsteroids = this.obstacles.length;
     
        this.gameOver = false;
        this.time = 0;
        // this.eventTimer = 0;
        // this.eventInterval = 100;
        // this.eventUpdate = false;
        this.playerName = playerName;
      this.audio.playBackgroundMusic();

        this.resize(window.innerWidth, window.innerHeight);

        // Define the event listener functions
        
        this.handleMouseDown = this.handleMouseDown.bind(this);
        //this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleResize = this.handleResize.bind(this);

        // Add event listeners
       
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        //window.addEventListener("keydown", this.handleKeyDown);
        this.canvas.addEventListener("touchstart", this.handleTouchStart,{ passive: false });
        this.canvas.addEventListener("touchmove", this.handleTouchMove,{ passive: false });
        window.addEventListener("resize", this.handleResize);
        // Add event listener for the reset button
        const resetButton = document.getElementById('resetButton');
        resetButton.addEventListener('click', () => {
            this.resetGame();
        });
    }
    handleResize() {
        this.resize(window.innerWidth, window.innerHeight);
    }
    handleMouseDown(e) {
        this.player.flap();
    }

    // handleKeyDown(e) {
    //     if (e.key === " " || e.key === "Enter") {
    //         e.preventDefault();
    //         this.player.flap();
    //     } else if (e.key === "Shift" && this.player.energy > 3) {
    //         this.player.startCharge();
    //     } else if (e.key === "d" || e.key === "D") {
    //         this.debug = !this.debug; // Toggle debug mode
    //     } else if (e.key === "r" || e.key === "R") {
    //         this.resetGame();
    //     }
    //}

  handleTouchStart(e) {
    e.preventDefault();
        this.player.flap();
        this.touchStartX = e.changedTouches[0].pageX;
    }

  handleTouchMove(e) {
    e.preventDefault();
        this.lastTouch = e.changedTouches[0].pageX;
        if (e.changedTouches[0].pageX - this.touchStartX > 35) {
            if (this.player.energy > 3) {
                this.player.startCharge();
            }
        }
    }

    resetGame() {
        this.clearGameState();
        this.setupEventListeners();
        this.resize(window.innerWidth, window.innerHeight);
    }

    clearGameState() {
        window.removeEventListener("resize", this.handleResize);
        this.canvas.removeEventListener("mousedown", this.handleMouseDown);
        window.removeEventListener("keydown", this.handleKeyDown);
        this.canvas.removeEventListener("touchstart", this.handleTouchStart);
        this.canvas.removeEventListener("touchmove", this.handleTouchMove);
    }

    setupEventListeners() {
        window.addEventListener("resize", this.handleResize);
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        //window.addEventListener("keydown", this.handleKeyDown);
        this.canvas.addEventListener("touchstart", this.handleTouchStart,{ passive: false });
        this.canvas.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    }


  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.fillStyle = "red";
    this.ctx.font = `20px Nasalization`;
    this.ctx.textAlign = `right`;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ratio = this.height / this.baseHeight;
    this.time = 0;
    this.startTime = null;
    
    this.speed = this.minSpeed;
    console.log(`game speed`, this.speed);
    this.gameOver = false;
    this.background.resize();
    this.player.resize();
    this.audio.playBackgroundMusic();
    this.audio.playStopWinningSound();
   //this.audio.playStopLosingSound();
    this.createObstacles();
    this.obstacles.forEach((obstacle) => {
        obstacle.resize(); 
 });

    // Call function to scale reset button on resize
  }


    render() {
      if (!this.startTime) this.startTime = performance.now(); // Set start time if not already set
      // Update the time based on the actual elapsed time
      if (!this.gameOver)this.time = performance.now() - this.startTime;
    //this.handlePeriodicEvents(deltaTime);
    //if (!this.gameOver) this.time += deltaTime;
    this.background.update();
    this.background.draw();
    this.drawStatusText();
    this.player.update();
    this.player.draw();
    this.obstacles.forEach((obstacle) => {
      obstacle.update();
      obstacle.draw();
    });
  }

  createObstacles() {
    this.obstacles = [];
    const firstX = this.baseHeight * this.ratio;
    const obstacleSpacing = 600 * this.ratio;
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
    }
  }

  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return distance <= sumOfRadii;
  }

  formatTimer() {
    return (this.time * 0.001).toFixed(1);
  }

  // handlePeriodicEvents(deltaTime) {
  //   if (this.eventTimer < this.eventInterval) {
  //     this.eventTimer += deltaTime;
  //     this.eventUpdate = false;
  //   } else {
  //     this.eventTimer = this.eventTimer % this.eventInterval;
  //     this.eventUpdate = true;
  //   }
  // }

  
  drawStatusText() {
    this.ctx.save();
  
    this.ctx.fillText(
      `Asteroids Left : ` +
        this.obstacles.length,
      this.width - 10,
      30
    );
    this.ctx.textAlign = `left`;
  
    this.ctx.fillText(`Timer : ` + this.formatTimer(), 10, 30);
  
    if (this.gameOver) {
      if (this.player.collided) {
    
        this.message1 = `Getting Rusty`;
        this.message2 = `Collision Time : ` + this.formatTimer() + ` seconds!`;
      } else if (this.obstacles.length <= 0) {
        
        this.audio.winning.play();
        this.message1 = "Mission accomplished!";
        this.message2 =
          `Can you do it faster than: ` + this.formatTimer() + ` seconds?`;
        // if (this.message1 ==="Mission accomplished!") { 
         
         
        // }
       
      }
  
      this.ctx.textAlign = `center`;
      this.ctx.font = `30px Nasalization`;
      this.ctx.fillStyle = "white";
  
      // Draw message1 (Mission status or player status)
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 -75
      );
      this.ctx.fillStyle = "red";
    
      if (this.playerName) {
        this.ctx.fillText(
          `Pilot ${this.playerName}!`,
          this.width * 0.5,
          this.height * 0.5 - 43
        );
      }
      // Draw message2 (Additional details or instructions)
      this.ctx.fillStyle = "white";
      this.ctx.fillText(
        this.message2,
        this.width * 0.5,
        this.height * 0.5 - 15
      );
  
      // Draw "Press 'R' to try again!" message
      this.ctx.fillText(
        `Press 'RESET' to try again!`,
        this.width * 0.5,
        this.height * 0.5 +15
      );
      this.ctx.fillStyle = "purple";
      this.ctx.font = `25px Nasalization`;
      this.ctx.fillText(
        `Take a Screenshot!`,
        this.width * 0.5,
        this.height * 0.5 +40
      );
    }
  
    // Draw player's energy bar
    for (let i = 0; i < this.player.energy; i++) {
      if (i < 3) {
        this.ctx.fillStyle = "orange";
      } else if (i < 33) {
        this.ctx.fillStyle = "blue";
      } else {
        this.ctx.fillStyle = "green"; // Change this to a valid CSS color name or hex code
      }
      this.ctx.fillRect(10 + i * 5, 50, 2 * this.ratio, 25 * this.ratio);
    }
  
    this.ctx.restore();
  }
 
}

window.addEventListener("load", function () {
  const startGameBtn = document.getElementById("startGame");
  const rotateScreenPrompt = document.getElementById("rotateScreenPrompt");
  const gamePrompt = document.getElementById("gamePrompt");
  const resetButton = document.getElementById('resetButton');
  const startbackgroundMusic = document.getElementById("backgroundMusic");
  startbackgroundMusic.load(); 
  function checkOrientationAndStartGame() {
      if (window.innerWidth > window.innerHeight) {
          // Device is in landscape mode
          rotateScreenPrompt.style.display = "none";
          startGame();
      } else {
          // Device is in portrait mode
          rotateScreenPrompt.style.display = "flex";

          // Listen for orientation change events
          window.addEventListener("orientationchange", handleOrientationChange);
      }
  }

  function handleOrientationChange() {
      if (window.innerWidth > window.innerHeight) {
          // Device rotated to landscape mode
          rotateScreenPrompt.style.display = "none";
          startGame();
          
          // // Lock orientation to landscape
          // if (screen.orientation && screen.orientation.lock) {
          //     screen.orientation.lock("landscape").catch(function(error) {
          //         console.error("Orientation lock failed: ", error);
          //    });
         // }
      }
  }

  function startGame() {
    try {
        gameIntro.pause();
        startbackgroundMusic.play().catch(function(error) {
            console.error("Background music playback failed: ", error);
        });
    } catch (error) {
        console.error("Error starting game music: ", error);
    }

    gamePrompt.style.display = "none";
    resetButton.style.display = "block";
    playerName = playerNameInput.value;

    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render();
        requestAnimationFrame(gameLoop);
    }

    startGameBtn.disabled = true;
    requestAnimationFrame(gameLoop);

    // Lock orientation to landscape
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(function(error) {
            console.error("Orientation lock failed: ", error);
        });
    }
}

  window.addEventListener("resize", handleOrientationChange);
  startGameBtn.addEventListener("click", checkOrientationAndStartGame);
});

  //let lastTime = 0;
  //let animationFrameId; // Variable to store animation frame ID

  // function animate(timeStamp) {
  //   const deltaTime = timeStamp - lastTime;
  //   lastTime = timeStamp;
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   game.render(deltaTime);
  //   animationFrameId = requestAnimationFrame(animate);
  // }
