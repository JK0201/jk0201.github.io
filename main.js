const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 300;

let animation;
let gameTimer = 0;
let cactusArr = [];
let birdArr = [];
let cloudArr = [];
let groundArr = [];
let gameLevel = 1;
let jump = false;
let duck = false;
let airTime = false;
let jumpSpeed;
let groundLength;
let gameStart = false;
let gameOver = false;
let obstacleTimeOut;
let cloudTimeOut;
let score;

let dinoImg = new Image();
dinoImg.src = './dinosaur.png';

let dinoImg2 = new Image();
dinoImg2.src = './dinosaur2.png';

let dinoDuck = new Image();
dinoDuck.src = './dinoduck.png';

let dinoDuck2 = new Image();
dinoDuck2.src = './dinoduck2.png';

let cactusImg = new Image();
cactusImg.src = './cactus.png';

let birdImg = new Image();
birdImg.src = './bird.png';

let birdImg2 = new Image();
birdImg2.src = './bird2.png';

let cloudImg = new Image();
cloudImg.src = './cloud.png';

let groundImg = new Image();
groundImg.src = './ground.png';

// let themeMusic = new Audio('./theme.mp3');
let jumpEffect = new Audio('./jump.mp3');
// let deadEffect = new Audio('./dead.mp3');

let dino = {
  x: 10,
  y: 200,
  width: 25,
  height: 30,
  draw(dino, num) {
    // ctx.fillStyle = 'green';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(dino, this.x - 7, this.y - num, this.width + 25, this.height + 20);
  },
};

let scoreBoard = {
  draw(level, score) {
    ctx.font = '20px DotGothic16';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL', 55, 30);
    ctx.fillText('SCORE', 445, 30);
    ctx.font = '20px DotGothic16';
    ctx.fillText(level < 5 ? level : 'MAX', 55, 55);
    ctx.fillText(score, 445, 55);
  },
};

class Cactus {
  constructor(num) {
    this.x = 500;
    this.y = 210 - num;
    this.width = 20;
    this.height = 30 + num;
  }
  draw() {
    // ctx.fillStyle = 'red';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(cactusImg, this.x - 15, this.y - 5, this.width + 30, this.height + 10);
  }
}

class Bird {
  constructor(num) {
    this.x = 500;
    this.y = 180 + num;
    this.width = 40;
    this.height = 5;
  }
  draw(bird) {
    // ctx.fillStyle = 'red';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(bird, this.x - 25, this.y - 30, this.width + 50, this.height + 50);
  }
}

class Cloud {
  constructor(num) {
    this.x = 500;
    this.y = 60 + num;
    this.width = 100 - num * 1.5;
    this.height = 20;
  }

  draw() {
    // ctx.fillStyle = 'green';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(cloudImg, this.x, this.y, this.width, this.height);
  }
}

class Ground {
  constructor() {
    this.x = 0;
    this.y = 230;
    this.width = 700;
    this.height = 40;
  }
  draw() {
    // ctx.fillStyle = 'gray';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(groundImg, this.x, this.y, this.width, this.height);
  }
}

function frameHandler() {
  animation = requestAnimationFrame(frameHandler);
  if (!gameStart) {
    cancelAnimationFrame(animation);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameTimer === 0) {
    let ground = new Ground();
    groundArr.push(ground);
  }

  if (groundLength < 500) {
    let ground = new Ground();
    ground.x = 500;
    groundArr.push(ground);
  }

  gameTimer++;

  if (gameTimer % 500 === 0) {
    if (gameLevel >= 5) {
      return;
    } else {
      gameLevel += 0.1;
    }
  }

  groundArr.forEach((item, idx, arr) => {
    groundLength = item.x + item.width;
    item.x -= gameLevel;
    if (groundLength < 0) {
      arr.splice(idx, 1);
    }
    item.draw();
  });

  cactusArr.forEach((item, idx, arr) => {
    if (item.x < 0) {
      arr.splice(idx, 1);
    }
    item.x -= gameLevel;
    cactusCollision(dino, item);
    item.draw();
  });

  birdArr.forEach((item, idx, arr) => {
    if (item.x < -15) {
      arr.splice(idx, 1);
    }
    item.x -= gameLevel * 1.1;
    birdCollision(dino, item);
    if (Math.round(gameTimer / 25) % 2 === 0) {
      item.draw(birdImg);
    } else {
      item.draw(birdImg2);
    }
  });

  cloudArr.forEach((item, idx, arr) => {
    if (item.x < -100) {
      arr.splice(idx, 1);
    }
    item.x -= gameLevel / 2;
    item.draw();
  });

  if (jump) {
    airTime = true;
    if (dino.y <= 200) {
      jumpSpeed = gameLevel + 1;
    }
    if (dino.y <= 135) {
      jumpSpeed = 1;
    }
    dino.y -= jumpSpeed;
  } else {
    if (dino.y < 200) {
      jumpSpeed = gameLevel;
      dino.y += jumpSpeed;
    } else {
      airTime = false;
    }
  }

  if (dino.y < 125) {
    jump = false;
  }

  if (duck) {
    dino.y = 210;
  }

  if (!duck && !airTime) {
    dino.y = 200;
  }

  //Score Board
  score = Math.round(gameTimer / 10);
  let level = Math.floor(gameLevel);
  scoreBoard.draw(level, score);

  if (!duck) {
    if (Math.round(gameTimer / 25) % 2 === 0) {
      dino.draw(dinoImg, 0);
    } else {
      dino.draw(dinoImg2, 0);
    }
  } else {
    if (Math.round(gameTimer / 25) % 2 === 0) {
      dino.draw(dinoDuck, 13.3);
    } else {
      dino.draw(dinoDuck2, 13.3);
    }
  }
}

window.addEventListener('load', function (e) {
  frameHandler();
  ctx.fillText('D I N O  R U N', canvas.width / 2, canvas.height / 2 - 12);
  ctx.font = '15px DotGothic16';
  ctx.fillText('Press "Enter" to start', canvas.width / 2, canvas.height / 2 + 12);
});

document.addEventListener('keyup', function (e) {
  if (!gameStart && e.code === 'Enter') {
    gameStart = true;
    createObstacle();
    createCloud();
    frameHandler();
    // themeMusic.play();
  }
});

document.addEventListener('keydown', function (e) {
  if (gameStart && !gameOver && !airTime && !duck) {
    if (e.code === 'Space') {
      jump = true;
      jumpEffect.play();
    }
  }
});

document.addEventListener('keyup', function (e) {
  if (gameOver) {
    if (e.code === 'Enter') {
      window.location.reload();
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (gameStart && !gameOver && !airTime && !duck) {
    if (e.code === 'ArrowDown') {
      duck = true;
    }
  }
});

document.addEventListener('keyup', function (e) {
  if (gameStart && !gameOver && duck) {
    if (e.code === 'ArrowDown') {
      duck = false;
    }
  }
});

function cactusCollision(dino, cactus) {
  let x = cactus.x - (dino.x + dino.width);
  let y = cactus.y - (dino.y + dino.height);
  let xCoor = x < 0;
  let yCoor = y < 0;
  collision(xCoor, yCoor);
}

function birdCollision(dino, bird) {
  let x = bird.x - (dino.x + dino.width);
  let y = dino.y - (bird.y + bird.height);
  let xCoor = x < 0;
  let yCoor = y < 0 && y > -45;
  collision(xCoor, yCoor);
}

function collision(xCoor, yCoor) {
  if (xCoor && yCoor) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText('G A M E  O V E R', canvas.width / 2, canvas.height / 2 - 12);
    ctx.font = '15px DotGothic16';
    ctx.fillText('Press "Enter" to restart', canvas.width / 2, canvas.height / 2 + 12);
    cancelAnimationFrame(animation);
    clearTimeout(obstacleTimeOut);
    clearTimeout(cloudTimeOut);
    gameOver = true;
    // themeMusic.pause();
    // deadEffect.play();
  }
}

function randomInterval(max, min) {
  let randomInterval = (Math.random() * (max - 1800)) / gameLevel + min / gameLevel;
  return randomInterval;
}

function createObstacle() {
  let interval = randomInterval(5000, 1800);
  let randomObstacle = Math.floor(Math.random() * 2.4);
  if (randomObstacle > 0) {
    let cactusNum = gameLevel >= 3 ? Math.floor(Math.random() * 2.4) : Math.floor(Math.random() * 1.4);
    for (let i = 0; i <= cactusNum; i++) {
      let cactus = new Cactus(5 * Math.round(Math.random() * 2));
      cactus.x += 15 * i;
      cactusArr.push(cactus);
    }
  }

  if (gameLevel >= 2 && gameLevel < 3 && randomObstacle === 0) {
    let bird = new Bird(20);
    birdArr.push(bird);
  } else if (gameLevel >= 3 && randomObstacle === 0) {
    let bird = new Bird(20 * Math.floor(Math.random() * 2.4));
    birdArr.push(bird);
  }
  obstacleTimeOut = setTimeout(createObstacle, interval);
}

function createCloud() {
  let interval = randomInterval(5500, 1800);
  let cloud = new Cloud(2 * Math.round(Math.random() * 15));
  cloudArr.push(cloud);
  cloudTimeOut = setTimeout(createCloud, interval);
}
