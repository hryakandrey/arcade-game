
// Enemies our player must avoid
// Parameter: x, a horizontal offset; y, a vertical offset; speed, a speed of enemy
'use strict';

var Enemy = function(x, y, speed) {
    // Variables applied to each of our enemies go here
    // The image/sprite for our enemies, level is set to 0 in the start of the game
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.level = 0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Calculate enemy position using dt delta and speed and level parameters
    this.x = this.x + dt*(this.speed + this.level);

    // When enemy reaches the border of game board, recalculate speed and vertical position randomly
    if (this.x > 505) {
      this.x = -101;
      this.y = selectRandom(y);
      this.speed = selectRandom(speed);
    }

    // Handles collision with the Player
    if (this.x >= player.x-80 && this.x <= player.x+80 && this.y >= player.y-50 && this.y <= player.y+50) {
      player.x = start_x;
      player.y = start_y;
      player.score = 0;
      player.gems = 0;
    }

};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player constructor function
// Parameter: x, a horizontal offset; y, a vertical offset
var Player = function(x, y) {
  // The image/sprite for our player, score and number of gems is set to 0 in the start of the game
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.gems = 0;
    this.x = x;
    this.y = y;
};


// Update the player's position, required method for game
Player.prototype.update = function() {
  // When the player reaches water, he gets 1000 points and moves back to starting position
  if (this.y == -20) {
    this.score += 1000;
    this.x = start_x;
    this.y = start_y;
  }

  // Scoring algorithm, every 2000 points gets our player to the new player picture and game lever, making game run faster
  // The game is finished when the player reaches 10000 points
  if (this.score >= 0 && this.score < 2000) {
    this.sprite = 'images/char-boy.png';
    allEnemies.forEach(enemy => enemy.level = 0);
  } else if (this.score >= 2000 && this.score < 4000) {
    this.sprite = 'images/char-cat-girl.png';
    allEnemies.forEach(enemy => enemy.level = 100);
  } else if (this.score >= 4000 && this.score < 6000) {
    this.sprite = 'images/char-horn-girl.png';
    allEnemies.forEach(enemy => enemy.level = 200);
  } else if (this.score >= 6000 && this.score < 8000) {
    this.sprite = 'images/char-pink-girl.png';
    allEnemies.forEach(enemy => enemy.level = 300);
  } else if (this.score >= 8000 && this.score < 10000) {
    this.sprite = 'images/char-princess-girl.png';
    allEnemies.forEach(enemy => enemy.level = 400);
  } else if (this.score >= 10000) {
    this.gems = 0;
    allEnemies.length = 0;
    allGems.length = 0;
  }

};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
  // Draw score and gems counter (in normal game state)
    if (player.score < 10000) {
      ctx.font = '30px courier';
      ctx.fillStyle = 'yellow';
      ctx.fillText(`score: ${this.score}`, 10, 575);
      ctx.fillStyle = 'white';
      ctx.fillText(`gems: ${this.gems}`, 310, 575);
    } else {
      // In case the game is won draw highlighting sprite
      ctx.drawImage(Resources.get('images/Selector.png'), this.x, this.y);
      ctx.fillStyle = 'red';
      ctx.fillText(`CONGRATS! YOU WON!`, 95, 575);
    }
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Cursor keys input handler prototype function for the player
Player.prototype.handleInput = function(keyCode) {
  if (keyCode === 'left' && this.x > 0) {
    this.x = this.x - 101;
  }
  if (keyCode === 'up' && this.y > 0) {
    this.y = this.y - 83;
  }
  if (keyCode === 'right' && this.x < 404) {
    this.x = this.x + 101;
  }
  if (keyCode === 'down' && this.y < 395) {
    this.y = this.y + 83;
  }
};


// Gems constructor function
// Parameter: x, a horizontal offset; y, a vertical offset
var Gem = function(x, y) {
  // The image/sprite for gems
  this.sprite = selectRandom(['images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png']);
  this.x = x;
  this.y = y;
};


// Update the gems' position, required method for game
Gem.prototype.update = function() {
  // Handles situation when gem is collected by the player, adds 500 points, 1 gem to counter, puts gem to a new random position
  if (this.x == player.x && this.y == player.y) {
    player.score += 500;
    player.gems += 1;
    this.x = selectRandom(x);
    this.y = selectRandom(y);
  }
};

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// All enemy objects in an array called allEnemies
// All gems objects in an array called allGems
// The player object in a variable called player
// x, y, the arrays of predifined horizontal and vertical values for placing game objects
// speed, array of predifined speed values
// start_x, start_y, starting point for the player
const allEnemies = [],
allGems = [],
x = [0, 101, 202, 303, 404],
y = [63, 146, 229],
speed = [100, 150, 200, 250, 300, 350, 400],
start_x = 202,
start_y = 395;


// Randomise function which returns randomly selected value from the array
// Parameter: arr, any array to select values from
const selectRandom = arr => arr[Math.floor(Math.random() * arr.length)];

// Add 3 enemy instances with random parameters
for (let i = 0; i < 3; i++) {
    allEnemies.push(new Enemy(selectRandom(x), selectRandom(y), selectRandom(speed)));
}

// Add the player to the game
const player = new Player(start_x, start_y);

// Add 4 gems with random placement
for (let i = 0; i < 4; i++) {
    allGems.push(new Gem(selectRandom(x), selectRandom(y)));
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
