class Game {
  constructor() {
    this.player = null;
    this.obstaclesArr = []; //will store instances of the class Obstacle
  }
  start() {
    this.player = new Player();

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
        this.detectCollision(obstacleInstance); //detect collision between player and current obstacle
        this.removeObstacleIfOutside(obstacleInstance); //check if we need to remove current obstacle
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
      } else if (e.key === "ArrowDown") {
        this.player.moveDown();
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
  removeObstacleIfOutside(obstacleInstance) {
    if (obstacleInstance.positionY < 0) {
      obstacleInstance.obstacleElm.remove(); //remove from the dom
      this.obstaclesArr.shift(); // remove from the array
    }
  }
}

class Player {
  constructor() {
    this.width = 8;
    this.height = 12;
    this.positionX = 0;
    this.positionY = 45;
    this.playerElm = document.getElementById("player");

    this.playerElm.style.width = this.width + "vw";
    this.playerElm.style.height = this.height + "vh";
  }
  moveLeft() {
    this.positionX--;
    this.playerElm.style.left = this.positionX + "vw";
  }
  moveRight() {
    this.positionX++;
    this.playerElm.style.left = this.positionX + "vw";
  }
  moveUp() {
    this.positionY++;
    this.playerElm.style.bottom = this.positionY + "vh";
  }
  moveDown() {
    this.positionY--;
    this.playerElm.style.bottom = this.positionY + "vh";
  }
}

class Obstacle {
  constructor() {
    this.width = Math.random() * 10;
    this.height = Math.random() * 20;
    this.positionY = Math.random() * 90;
    this.positionX = 90;
    this.obstacleElm = null; //will store a dom element

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
}

const game = new Game();
game.start();
