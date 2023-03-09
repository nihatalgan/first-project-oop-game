// let bgm = new Audio("./audio/bgm.mp3");
// bgm.play();

let shooting = new Audio("./audio/pistol.mp3");
// if (e.key === " ") {
//   shoot();
//   shooting.play();
// }

class Game {
  constructor() {
    this.player = null;
    this.obstaclesArr = []; //will store instances of the class Obstacle
    this.bulletsArr = [];
  }
  start() {
    this.player = new Player();
    this.score = new Score();
    this.attachEventListeners();

    //create new obstacles
    setInterval(() => {
      const myObstacle = new Obstacle();
      this.obstaclesArr.push(myObstacle);
    }, 2500);

    //move all obstacles
    setInterval(() => {
      this.obstaclesArr.forEach((obstacleInstance) => {
        obstacleInstance.moveLeft(); //move
        this.removeObstacleIfOutside(obstacleInstance); //check if we need to remove current obstacle
        this.detectCollision(obstacleInstance); //detect collision between player and current obstacle
      });
    }, 100);
    setInterval(() => {
      this.bulletsArr.forEach((bulletInstance) => {
        this.removeBulletIfOutside(bulletInstance); //check if we need to remove current bullet
        this.detectbulletCollision(bulletInstance); //detect collision between an obstacle and a bullet
      });
    }, 100);
  }
  attachEventListeners() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.player.moveLeft();
      } else if (e.key === "ArrowRight") {
        this.player.moveRight();
      } else if (e.key === "ArrowUp") {
        this.player.moveUp();
        this.myBullet.moveUp();
      } else if (e.key === "ArrowDown") {
        this.player.moveDown();
        this.myBullet.moveDown();
      } else if (e.key === " ") {
        const myBullet = new Bullet(
          this.player.positionX + this.player.width,
          this.player.positionY + this.player.height / 2 - 1
        );
        shooting.play();
        this.bulletsArr.push(myBullet);
        setInterval(() => {
          myBullet.shoot();
        }, 50);
      }
    });
  }

  detectCollision(obstacleInstance) {
    if (
      this.player.positionX <
        obstacleInstance.positionX + obstacleInstance.width &&
      this.player.positionX + this.player.width > obstacleInstance.positionX &&
      this.player.positionY <
        obstacleInstance.positionY + obstacleInstance.height &&
      this.player.height + this.player.positionY > obstacleInstance.positionY
    ) {
      //console.log("game over my fren!");
      window.location.href = "./gameover.html";
    }
  }

  detectbulletCollision(bulletInstance, bulletIndex) {
    this.obstaclesArr.forEach((obstacleInstance, obstacleIndex) => {
      if (
        bulletInstance.positionX <
          obstacleInstance.positionX + obstacleInstance.width &&
        bulletInstance.positionX + bulletInstance.width >
          obstacleInstance.positionX &&
        bulletInstance.positionY <
          obstacleInstance.positionY + obstacleInstance.height &&
        bulletInstance.height + bulletInstance.positionY >
          obstacleInstance.positionY
      ) {
        bulletInstance.bulletElm.remove(); //remove from the dom
        this.bulletsArr.splice(bulletIndex, 1); // remove from the array
        this.score.hitScore();
        obstacleInstance.beingHit();
        if (obstacleInstance.strength < 0) {
          obstacleInstance.obstacleElm.remove(); //remove from the dom
          this.obstaclesArr.splice(obstacleIndex, 1); // remove from the array

          localStorage.setItem("maxscore", this.score.scr);
        }
      }
    });
  }

  removeObstacleIfOutside(obstacleInstance) {
    if (obstacleInstance.positionX < 0) {
      obstacleInstance.obstacleElm.remove(); //remove from the dom
      this.obstaclesArr.shift(); // remove from the array
    }
  }
  removeBulletIfOutside(bulletInstance) {
    if (bulletInstance.positionX > 100) {
      bulletInstance.bulletElm.remove(); //remove from the dom
      this.bulletsArr.shift(); // remove from the array
    }
  }
}

class Bullet {
  constructor(plyX, plyY) {
    this.width = 6;
    this.height = 4;
    this.positionX = plyX;
    this.positionY = plyY;
    this.damage = 10;
    this.bulletElm = null;
    this.createBulletDomElement();
  }
  createBulletDomElement() {
    // step1: create the element
    this.bulletElm = document.createElement("div");

    // step2: add content (ex. innerText) and/or modify attributes
    this.bulletElm.className = "bullet";
    this.bulletElm.style.width = this.width + "vw";
    this.bulletElm.style.height = this.height + "vh";
    this.bulletElm.style.bottom = this.positionY + "vh";
    this.bulletElm.style.left = this.positionX + "vw";

    //step3: append to the dom
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.bulletElm);
  }
  shoot() {
    this.positionX++;
    this.bulletElm.style.left = this.positionX + "vw";
    this.bulletElm.style.bottom = this.positionY + "vh";
  }
  moveUp() {
    if (this.positionY < 100 - this.height) {
      this.positionY++;
    }
    this.bulletElm.style.bottom = this.positionY + "vh";
  }
  moveDown() {
    if (this.positionY > 0) {
      this.positionY--;
    }
    this.bulletElm.style.bottom = this.positionY + "vh";
  }
}

class Obstacle {
  constructor() {
    this.width = Math.random() * (10 - 3) + 3;
    this.height = Math.random() * (15 - 3) + 3;
    this.positionY = Math.random() * 90;
    this.positionX = 90;
    this.obstacleElm = null; //will store a dom element
    this.strength = this.width * this.height;
    this.createDomElement();
  }
  createDomElement() {
    // step1: create the element
    this.obstacleElm = document.createElement("div");

    // step2: add content (ex. innerText) and/or modify attributes
    this.obstacleElm.className = "obstacle";
    this.obstacleElm.style.width = this.width + "vw";
    this.obstacleElm.style.height = this.height + "vh";
    this.obstacleElm.style.bottom = this.positionY + "vh";
    this.obstacleElm.style.left = this.positionX + "vw";

    //step3: append to the dom
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.obstacleElm);
  }
  moveLeft() {
    this.positionX--;
    this.obstacleElm.style.left = this.positionX + "vw";
  }
  beingHit() {
    this.strength -= 20;
  }
}

class Player {
  constructor() {
    this.width = 15;
    this.height = 20;
    this.positionX = 0;
    this.positionY = 45;
    this.playerElm = document.getElementById("player");

    this.playerElm.style.width = this.width + "vw";
    this.playerElm.style.height = this.height + "vh";
  }
  moveLeft() {
    if (this.positionX > 0) {
      this.positionX--;
    }
    this.playerElm.style.left = this.positionX + "vw";
  }
  moveRight() {
    if (this.positionX < 100 - this.width) {
      this.positionX++;
    }
    this.playerElm.style.left = this.positionX + "vw";
  }
  moveUp() {
    if (this.positionY < 100 - this.height) {
      this.positionY++;
    }
    this.playerElm.style.bottom = this.positionY + "vh";
  }
  moveDown() {
    if (this.positionY > 0) {
      this.positionY--;
    }
    this.playerElm.style.bottom = this.positionY + "vh";
  }
}

class Score {
  constructor() {
    this.width = 10;
    this.height = 3;
    this.positionX = 85;
    this.positionY = 90;
    this.scr = 0;
    this.createScoreDomElement();
  }
  createScoreDomElement() {
    // step1: create the element
    this.scoreElm = document.createElement("div");

    // step2: add content (ex. innerText) and/or modify attributes
    this.scoreElm.className = "score";
    this.scoreElm.style.width = this.width + "vw";
    this.scoreElm.style.height = this.height + "vh";
    this.scoreElm.style.bottom = this.positionY + "vh";
    this.scoreElm.style.left = this.positionX + "vw";
    this.scoreElm.style.fontSize = "x-large";
    this.scoreElm.innerHTML = "SCORE: " + this.scr;

    //step3: append to the dom
    const boardElm = document.getElementById("board");
    boardElm.appendChild(this.scoreElm);
  }
  hitScore() {
    this.scr += 10;
    this.scoreElm.innerHTML = "SCORE: " + this.scr;
  }
}

const game = new Game();
game.start();
