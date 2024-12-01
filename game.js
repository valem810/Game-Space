const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let asteroids;
let bullets;
let score = 0;
let scoreText;
let gameOverText;
let gameOver = false;
let wasdKeys;

function preload() {
    this.load.image('ship', 'https://labs.phaser.io/assets/sprites/thrust_ship2.png');
    this.load.image('asteroid', 'https://labs.phaser.io/assets/sprites/asteroid.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet7.png');
}

function create() {
    // Player setup
    player = this.physics.add.sprite(400, 300, 'ship');
    player.setCollideWorldBounds(true);

    // Input setup
    cursors = this.input.keyboard.createCursorKeys();
    wasdKeys = this.input.keyboard.addKeys('W,A,S,D');

    // Asteroids setup
    asteroids = this.physics.add.group();
    createAsteroids(this);

    // Bullets setup
    bullets = this.physics.add.group({
        classType: Phaser.Physics.Arcade.Image,
        defaultKey: 'bullet',
        maxSize: 10,
        runChildUpdate: true
    });

    // Collisions
    this.physics.add.collider(player, asteroids, hitAsteroid, null, this);
    this.physics.add.collider(bullets, asteroids, hitAsteroidWithBullet, null, this);

    // UI setup
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    gameOverText = this.add.text(400, 300, 'GAME OVER', { fontSize: '64px', fill: '#fff' });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    // Bullet firing
    this.input.on('pointerdown', (pointer) => {
        if (!gameOver) {
            fireBullet.call(this, pointer);
        }
    });
}

function update() {
    if (gameOver) return;

    // Player movement
    const speed = 160;
    if (wasdKeys.A.isDown || cursors.left.isDown) {
        player.setVelocityX(-speed);
    } else if (wasdKeys.D.isDown || cursors.right.isDown) {
        player.setVelocityX(speed);
    } else {
        player.setVelocityX(0);
    }

    if (wasdKeys.W.isDown || cursors.up.isDown) {
        player.setVelocityY(-speed);
    } else if (wasdKeys.S.isDown || cursors.down.isDown) {
        player.setVelocityY(speed);
    } else {
        player.setVelocityY(0);
    }

    // Update score
    scoreText.setText('Score: ' + score);

    // Create more asteroids if needed
    if (asteroids.countActive() < 5) {
        createAsteroids(this);
    }
}

function hitAsteroid(player, asteroid) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    gameOverText.setVisible(true);
}

function hitAsteroidWithBullet(bullet, asteroid) {
    bullet.destroy();
    asteroid.destroy();
    score += 10;
}

function fireBullet(pointer) {
    const bullet = bullets.get(player.x, player.y);
    
    if (bullet) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y);
        const velocity = this.physics.velocityFromRotation(angle, 500);

        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.rotation = angle;
        bullet.setVelocity(velocity.x, velocity.y);

        this.time.delayedCall(2000, () => {
            bullet.setActive(false);
            bullet.setVisible(false);
        });
    }
}

function createAsteroids(scene) {
    const numAsteroids = 5 - asteroids.countActive();
    for (let i = 0; i < numAsteroids; i++) {
        const x = Phaser.Math.Between(0, scene.sys.game.config.width);
        const y = Phaser.Math.Between(0, scene.sys.game.config.height);
        
        const asteroid = asteroids.create(x, y, 'asteroid');
        asteroid.setScale(Phaser.Math.FloatBetween(0.5, 1));
        asteroid.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        asteroid.setAngularVelocity(Phaser.Math.FloatBetween(-100, 100));
        asteroid.setCollideWorldBounds(true);
        asteroid.setBounce(1);
    }
}

console.log("Game code updated successfully!");