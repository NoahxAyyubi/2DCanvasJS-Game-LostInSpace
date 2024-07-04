class Player {
    constructor(game) {
        this.game = game;
        this.x = 50;
        this.y;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.width;
        this.height;
        this.speedY;
        this.flapSpeed;
        this.collisionX;
        this.collisionY;
        this.collisionRadius;
        this.collided = false;
        this.energy = 0;
        this.maxEnergy = 40;
        this.charging;
        this.image = document.getElementById('SpaceShip');
        this.image2 = document.getElementById('blast');
        this.image3 = document.getElementById('blast2');
        this.image4 = document.getElementById('blast3');
        this.frameY = 0; // Frame index for blast animation
        this.frameY2 = 0; // Frame index for blast animation
        this.blastWidth = 32; // Width of each blast frame
        this.blastHeight = 32; // Height of each blast frame
        this.blastFrames = 4; // Number of frames in blast animation
        this.blasting = false;
        this.blasting2 = false;
        this.blastInterval = null; // For first blast animation interval
        this.blastInterval2 = null; // For second blast animation interval

        // Initialize player properties
        this.initialize();
    }

    initialize() {
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -5 * this.game.ratio;
        this.flapSpeed = -5 * this.game.ratio;
        this.collisionRadius = this.width * 0.20;
        this.collisionX = this.x + this.width * 0.55;
        this.collided = false;
        this.energy = 0;
    }

    draw() {
        this.game.ctx.strokeStyle = 'white';
        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (this.game.debug) {

            this.game.ctx.beginPath();
            this.game.ctx.arc(
                this.collisionX + this.collisionRadius,
                this.collisionY,
                this.collisionRadius,
                0,
                Math.PI * 2
            );
            this.game.ctx.stroke();
        }
        if (this.blasting) {
            this.drawBlast();
        } else if (this.blasting2) {
            this.drawSecondBlast();
        }
    }

    update() {
        this.handleEnergy();
        this.y += this.speedY;
        this.collisionY = this.y + this.height * 0.46;
        if (this.y < this.game.height - this.height && !this.charging) {
            this.speedY = this.speedY + this.game.gravity;
        } else {
            this.speedY = 0;
        }
        if (this.y >= this.game.height - this.height) {
            this.y = this.game.height - this.height;
        }
    }

    resize() {
        this.initialize();
    }

    startCharge() {
        this.charging = true;
        this.game.speed = this.game.maxSpeed;
        this.animateBlast2();
        this.game.audio.playBlastSound2();
    }

    stopCharge() {
        this.charging = false;
        this.game.speed = Math.max(this.game.minSpeed, this.game.minSpeed * this.game.ratio);
        
    }

    isTouchingTop() {
        return this.y <= 0;
    }

    // handleEnergy() {
    //     if (this.game.eventUpdate) {
    //         if (this.energy < this.maxEnergy) {
    //             this.energy += .7;
    //         }
    //         if (this.charging) {
    //             this.energy -= 5;
    //         }
    //         if (this.energy <= 0) {
    //             this.energy = 0;
    //             this.stopCharge();
    //         }
    //     }
    // }
    handleEnergy() {
        // Increase energy over time up to maxEnergy
        if (this.energy < this.maxEnergy) {
            this.energy += 0.03;
        }

        // Decrease energy rapidly when charging
        if (this.charging) {
            this.energy -= .3;
        }

        // Ensure energy doesn't drop below zero
        if (this.energy <= 0) {
            this.energy = 0;
            this.stopCharge(); // Stop charging if energy is depleted
        }
    }
    flap() {
        this.stopCharge();
        if (!this.isTouchingTop()) {
            this.speedY = this.flapSpeed;
        }
        this.animateBlast();
        this.game.audio.playBlastSound();
    }

    animateBlast() {
        this.frameY = 0;
        this.blasting = true;

        // Clear previous interval if exists
        if (this.blastInterval) clearInterval(this.blastInterval);

        this.blastInterval = setInterval(() => {
            this.frameY++;
            if (this.frameY >= this.blastFrames) {
                clearInterval(this.blastInterval);
                this.blasting = false; // End blast animation
            }
        }, 100);
    }

    animateBlast2() {
        this.frameY2 = 0;
        this.blasting2 = true;

        // Clear previous interval if exists
        if (this.blastInterval2) clearInterval(this.blastInterval2);

        this.blastInterval2 = setInterval(() => {
            this.frameY2++;
            if (this.frameY2 >= this.blastFrames) {
                clearInterval(this.blastInterval2);
                this.blasting2 = false; // End second blast animation
            }
        }, 100);
    }

    drawBlast() {
        // Draw the blast animation frames
        const blastYOffset = 70* this.game.ratio; // Adjust this offset as needed

        this.game.ctx.drawImage(
            this.image2,
            0, // Adjust x coordinate to move to next frame
            this.frameY * this.blastHeight, // Fixed y coordinate
            this.blastWidth,
            this.blastHeight,
            35,
            this.y + blastYOffset,
            this.blastWidth * this.game.ratio + 5,
            this.blastHeight * this.game.ratio + 5
        );
    }

    drawSecondBlast() {
        // Draw the second blast animation frames
        const blastYOffset2 = 70 * this.game.ratio; // Adjust this offset as needed
        const image4XPosition = this.x + this.width;
        this.game.ctx.drawImage(
            this.image3,
            this.frameY2 * this.blastWidth, // Fixed y coordinate
            0,
            this.blastWidth,
            this.blastHeight,
            35,
            this.y + blastYOffset2,
            this.blastWidth * this.game.ratio,
            this.blastHeight * this.game.ratio
        );
        this.game.ctx.drawImage(
            this.image4,
            this.frameY2 * this.blastWidth, // Fixed y coordinate
            0, // Adjust x coordinate to move to next frame
            this.blastWidth,
            this.blastHeight,
            image4XPosition,
            this.y + blastYOffset2,
            this.blastWidth * this.game.ratio,
            this.blastHeight * this.game.ratio
        );
    }
}
