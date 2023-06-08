const SPACE_KEY = 65;

let GAME_STATE = ""; // START | END | PAUSE

let spaceship;
let aliens = [];
let bullets = [];
let gameOver = false;
let gameWon = false;
let score = 0;
let fireSound;
let destroySound;
const width = 1340;
const height = 600;
let level = 1;
let bulletFired = false; // Flag to track if a bullet has been fired

function setup() {
  createCanvas(width, height);
  background(0);
}

function draw() {
  background(220);
  if (GAME_STATE === "START") {
    if (aliens.length === 0) {
      // Win Logic
      textAlign(CENTER);
      textSize(40);
      fill(255);
      if (level === 2) {
        text("Congratulations! You completed all levels.", width / 2, height / 2);
        return;
      } else {
        level++;
        GAME_STATE = ""; // Reset game state
        setupLevel(); // Set up the new level
        return;
      }
    }
  }

  if (!gameOver) {
    if (spaceship) {
      spaceship.display();
      spaceship.move();
      if (keyIsDown(SPACE_KEY) && !bulletFired) {
        spaceship.fire();
        bulletFired = true; // Set the flag to true
      }
    }

    for (let alien of aliens) {
      alien.display();
    }

    for (let bullet of bullets) {
      bullet.update();
      bullet.display();

      for (let i = aliens.length - 1; i >= 0; i--) {
        if (bullet.hits(aliens[i])) {
          aliens.splice(i, 1);
          updateOutput();
        }
      }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].toDelete) {
        bullets.splice(i, 1);
      }
    }
  } else {
    // Display "You Lose!" message
    textAlign(CENTER);
    textSize(40);
    fill(255);
    text(spaceship.name + " " + "You Lost! You have run out of ammo.", width / 2, height / 2);
  }
}

class Spaceship {
  constructor(ammunition, spaceshipName) {
    // Initialize properties
    this.x = width / 2;
    this.y = height - 100;
    this.name = spaceshipName;
    this.ammo = ammunition;
    this.speed = 2;
  }
  display() {
    // Show the spaceship on the canvas
    fill(255);
    ellipse(this.x, this.y, 50, 50);
  }
  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x = this.x - this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x = this.x + this.speed;
    }
  }
  fire() {
    // Decrease ammunition, create a new Bullet instance, and play fire sound
    if (this.ammo > 0) {
      this.ammo--;
      bullets.push(new Bullet(this.x, this.y));

      // Fire sound play
      fireSound.play();

      if (this.ammo === 0) {
        gameOver = true;
      }

      updateOutput();
    }
  }
}

class Alien {
  constructor(name, health) {
    // Initialize properties
    this.x = random(width);
    this.y = random(height / 2);
    this.health = health;
    this.name = name;
    this.radius = 30; // Updated radius to 30
  }

  display() {
    // Show the alien's body
    fill(127, 255, 212); // RGB color: Aqua
    ellipse(this.x, this.y, 80, 120); // Adjusted dimensions

    // Show the alien's eyes
    fill(255, 0, 0); // RGB color: Red
    ellipse(this.x - 15, this.y - 25, 15, 15); // Adjusted dimensions
    ellipse(this.x + 15, this.y - 25, 15, 15); // Adjusted dimensions

    // Show the alien's mouth
    fill(0, 0, 0); // RGB color: Black
    rect(this.x - 20, this.y + 20, 40, 8); // Adjusted dimensions
  }
}

class Bullet {
  constructor(x, y) {
    // Initialize properties
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.toDelete = false;
  }
  display() {
    // Show the bullet on the canvas
    fill(255);
    ellipse(this.x, this.y, 10, 10);
  }
  update() {
    this.y = this.y - this.speed;

    if (this.y < 0) {
      this.toDelete = true;
      bulletFired = false; // Reset the flag when the bullet is deleted
    }
  }
  hits(alien) {
    const condition1 = this.x < alien.x + alien.radius;
    const condition2 = this.x + alien.radius > alien.x;
    const condition3 = this.y < alien.y + alien.radius;
    const condition4 = this.y + alien.radius > alien.y;
    if (condition1 && condition2 && condition3 && condition4) {
      destroySound.play();
      score++;
      return true;
    }
    return false;
  }
}

function startGame() {
  let spaceshipName = document.getElementById("spaceshipName").value;
  let ammunition = document.getElementById("ammunition").value;

  if (spaceshipName && ammunition) {
    spaceship = new Spaceship(ammunition, spaceshipName);
    GAME_STATE = "START";
    setupLevel();
  } else {
    alert("Please fill in the spaceship name and ammunition before starting the game.");
  }
}

function updateOutput() {
  if (gameOver) {
    return;
  }

  let output = "Spaceship's ammunition: " + spaceship.ammo + "<br>";
  output += "Level: " + level + "<br>";
  output += "Score: " + score + "<br>";

  document.getElementById("game-output").innerHTML = output;
}

function setupLevel() {
  gameOver = false;
  score = 0;
  bullets = [];
  bulletFired = false; // Reset the bullet fired flag

  aliens = [];
  const alienCount = level * 5;
  for (let i = 0; i < alienCount; i++) {
    aliens.push(new Alien("Alien" + i, level));
  }

  updateOutput();
}

function fireShot() {
  spaceship.fire();
}

function preload() {
  fireSound = loadSound("sounds/AWM Bullet Sound.mp3");
  destroySound = loadSound("sounds/rock-destroy-6409.mp3");
}
