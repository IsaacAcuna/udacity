"use strict"
const enemyRows = [ 60, 145, 230, 315 ]; // runner rows
const sprites = [ 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-boy.png' ]; // List of sprites for runners
const names = ['Kris', 'Kerry', 'Amari', 'Robbie', 'Ivory', 'Devyn', 'Peyton', 'Elisha', 'Jackie', 'Maxie', 'Justice', 'Trinidad', 'Reese', 'Riley', 'Frankie', 'Blair', 'Jaime', 'Alva', 'Carey', 'Kendall']; // List of names for runners
let allEnemies = []; // Array to be popuated with runner objects
let enemy;

const Enemy = function(x, y, speed, name, sprite, multiplier) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.name  = name;
    this.sprite = sprite;
    this.multiplier = multiplier;
};

Enemy.prototype.update = function(dt) { // Draw frame
    this.x += this.speed * dt;
    let enemyCol = Math.floor(this.x);
    let enemyRow = Math.floor(this.y);
    let playerCol = Math.floor(player.x);
    let playerRow = Math.floor(player.y);

    if (enemyCol > 500) { // Redraw enemies if they're at the last column
        this.x = randomStart();
        this.speed = randomSpeed(enemy.multiplier); // randomized speed
    }
    
    if ( enemyCol > playerCol - 67 && enemyCol < playerCol && playerRow == enemyRow) { // Collision detection
            resetPlayer(this.name, 0);
    }
};

Enemy.prototype.render = function() { // Draw the enemies
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const Player = function(x, y, speed) { 
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-princess-girl.png';
};

Player.prototype.handleInput = function(key) { // control movement of player on key events
    switch (key) {
        case 'left':
            this.x -= 100;
            break;
        case 'up':
            this.y -= 85;
            break;
        case 'right':
            this.x += 100;
            break;
        case 'down':
            this.y += 85;
            break;
    }
};

Player.prototype.update = function() { // define grid limits 
    if (this.y < 0) { // Water row
        resetPlayer(0, 1);
    }
    if (this.x < 0) { // Left border
        this.x = 0;
    }
    if (this.x > 400) { // Right border
        this.x = 400;
    }
    if (this.y > 400) { // Bottom border
        this.y = 400;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



function randomSpeed(multiplier) {
    return Math.floor((Math.random() * 250) + multiplier);
}

function randomStart() {
  return Math.floor(Math.random() * Math.floor(-50));
}

function getRandom(array) {
    const index = Math.floor(Math.random() * Math.floor(array.length));
    let result = array[index];
    return result;
}

function resetPlayer(name, water) {
    if (name) {
        alert("You've bumped into " + name + ". try again, you can do it!");
    }
    if (water) {
        alert("Congratulations! You've won this round, can you handle more speed?");
        enemy.multiplier = enemy.multiplier + 20; //Increase runner speed
    }
    player.x = 0;
    player.y = 400;
}

let player = new Player(0, 400, 50); // Create player

for (let row of enemyRows) { // Populate runners
    let multiplier = 100;
    let start  = randomStart();
    let speed  = randomSpeed(multiplier);
    let name   = getRandom(names);
    let sprite = getRandom(sprites);
    enemy = new Enemy(start, row, speed, name, sprite, multiplier);
    allEnemies.push(enemy);
}

document.addEventListener('keyup', function(e) { // Event listenrs for d-pad keys
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});