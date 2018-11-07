const SPACE = 32;
const LEFT = 37;
const RIGHT = 39;

const container = document.getElementById('container');
const platform = document.getElementById('platform');
const JUMP_X = Math.round(container.clientWidth / 20);
const JUMP_Y = Math.round(container.clientHeight / 30);

const MIN_LEFT = 0;
const MAX_RIGHT = container.clientWidth - JUMP_X;

const VELOCITY = 2;

platform.style.width = `${JUMP_X}px`;

let raf;

const platformPosition = {
  x: 0
}

let missiles = [];

let enemies = [{ x: 0, y: 20}]

document.addEventListener('keydown', (event) => {
  switch (event.keyCode) {
    case LEFT:
      platformPosition.x = platformPosition.x - JUMP_X <= 0 ? 0 : platformPosition.x - JUMP_X;
      break;
    case RIGHT:
      platformPosition.x = platformPosition.x + JUMP_X + platform.clientWidth >= MAX_RIGHT? MAX_RIGHT : platformPosition.x + JUMP_X;
      console.log(platformPosition.x + JUMP_X + platform.clientWidth);
      break;
    case SPACE:
      fireMissile();
      break;

  }
});


raf = requestAnimationFrame(() => {
  drawGrid();
  generateEnemies();
  runGame();
})

function runGame() {
  updatePlatform();
  drawMissiles();
  drawEnemy();
  checkEnemyCollistion();
  raf = requestAnimationFrame(() => { runGame() });
}

function updatePlatform() {
  platform.style.left = `${platformPosition.x}px`;
}

function fireMissile() {
  const placement = platformPosition.x + (JUMP_X / 2);
  missiles.push({ x: placement, y: 0 })
}

function drawMissiles() {
  clreaElement('missile');
  // clear missiles;
  missiles = missiles.filter(missile => detectBorderColistion(missile));
  missiles.forEach(missile => {
    const div = document.createElement('div');
    div.className = 'missile';
    div.style.height = `${10}px`;
    div.style.left = `${missile.x}px`;
    div.style.top = `${platform.offsetTop - missile.y - 10}px`;
    container.appendChild(div);
    // and update position
    missile.y = missile.y + VELOCITY || 0;
  });
}

function drawEnemy() {
  clreaElement('enemy');
  enemies.forEach(enemy => {
    const div = document.createElement('div');
    div.className = 'enemy';
    div.style.left = `${enemy.x}px`;
    div.style.top = `${enemy.y}px`;
    div.style.width = `${JUMP_X - 10}px`
    div.style.height = `${JUMP_X - 10}px`
    container.appendChild(div);
  });
}

function generateEnemies() {
  const ENEMY_COUNT = 100;
  for(let i = 0; i< ENEMY_COUNT; i++) {
    enemies.push({ x: Math.floor(Math.random() * 20) * JUMP_X, y: Math.floor(Math.random() * 20) * JUMP_Y })
  }
}

function clreaElement(elementClass) {
  const elements = container.getElementsByClassName(elementClass)
  while(elements.length) {
    elements.item(elements.length - 1).remove();
  }
}

function detectBorderColistion(missile) {
  return !(platform.offsetTop - missile.y) <= 0
}

function checkEnemyCollistion() {
  missiles.forEach((missile) => {
    enemies.forEach((enemy) => {
      if (missile.y >= enemy.y) {
        console.log('HEY!')
        cancelAnimationFrame(raf);
      }
    })
  })
}

function drawGrid() {
  for(var i = 1; i < 20; i++) {
    const div = document.createElement('div');
    div.style.position = 'absolute'
    div.style.left = `${JUMP_X * i}px`;
    div.style.width = '1px';
    div.style.height = '100%';
    div.style.background = 'black'
    container.appendChild(div);
  }
}