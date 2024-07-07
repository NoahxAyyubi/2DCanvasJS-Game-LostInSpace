class Audio {
    constructor() {
       // this.gameIntro= document.getElementById("gameIntro");
        this.winning = document.getElementById("winning");
       // this.blastSound = document.getElementById("blastSound");
        this.blastSound2 = document.getElementById("blastSound2");
        this.explosionSound = document.getElementById("crash");
        this.backgroundMusic = document.getElementById("backgroundMusic");

       // this.gameIntro.load();
        this.winning.load();
       // this.blastSound.load();
        this.blastSound2.load();
        this.explosionSound.load();
        this.backgroundMusic.load();
        
    }
    playBackgroundMusic() {
        
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play();
            
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
    // playStopBlastSound() {
    //     this.blastSound.currentTime = 0; // Reset audio to the start
    //     this.blastSound.pause();
    // }
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
        console.log(`winning music`);
    }
    playStopWinningSound() {
        this.winning.currentTime = 0; // Reset audio to the start
        this.winning.pause();
    }
}