class Audio {
    constructor() {
        this.gameIntro= document.getElementById("gameIntro");
        this.losing = document.getElementById("losing");
        this.winning = document.getElementById("winning");
        this.blastSound = document.getElementById("blastSound");
        this.blastSound2 = document.getElementById("blastSound2");
        this.explosionSound = document.getElementById("crash");
        this.backgroundMusic = document.getElementById("backgroundMusic");
        
    }
    playBackgroundMusic() {
        if (!this.gameOver) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play();
            this.backgroundMusic.loop = true;
        } 
    }
    playStopBackgroundMusic() {
        if (!this.gameOver) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.pause();
        } 
    }
    playBlastSound() {
        this.blastSound.currentTime = 0; // Reset audio to the start
        this.blastSound.play();
    }
    playBlastSound2() {
        this.blastSound2.currentTime = 0; // Reset audio to the start
        this.blastSound2.play();
    }
    playExplosionSound() {
        this.explosionSound.currentTime = 0; // Reset audio to the start
        this.explosionSound.play();
    }
    playGameIntroSound() {
        this.gameIntro.currentTime = 0; // Reset audio to the start
        this.gameIntro.play();
    }
    playWinningSound() {
        this.winning.currentTime = 0; // Reset audio to the start
        this.winning.play();
    }
    playLosingSound() {
        this.losing.currentTime = 0; // Reset audio to the start
        this.losing.play();
    }
    playStopLosingSound() {
        
            this.losing.currentTime = 0;
            this.losing.pause();
        } 
    
    playStopWinningSound() {
        if (this.gameOver) {
            this.losing.currentTime = 0;
            this.losing.pause();
        } 
    }
}