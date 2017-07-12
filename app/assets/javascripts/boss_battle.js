var boss;
var explode;
var deadboss;
var background;

game = new Phaser.Game($("#gameArea").width(), $("#gameArea").height(), Phaser.CANVAS, 'gameArea', {
    preload: preload,
    create: create,
    update: update,
    render: render,
});

var worldScale = 1;

function preload() {
    // Load Background
    game.load.image('temple-background', 'images/backgrounds/temple.jpg');

    // Load Sprites
    game.load.spritesheet('boss', 'images/sprites/boss-stomp.png', 192, 172, 6);
    game.load.spritesheet('boss-shoot', 'images/sprites/boss-shoot.png', 192, 172, 6);
    game.load.spritesheet('boss-death', 'images/sprites/boss-death.png', 238.85, 170, 7);
    game.load.spritesheet('explosion', 'images/sprites/explosion.png', 100, 100, 37);
}

function create() {
    var scene = gon.scene

    background = game.add.sprite(0, 0, 'temple-background');
    background.height = game.world.height;
    background.width = game.world.width;
    game.time.events.add(Phaser.Timer.SECOND * 2, findBoss, this);
}

function findBoss() {
    boss = game.add.sprite(game.world.centerX-40, game.world.centerY-30, 'boss');
    var walk = boss.animations.add('walk');
    boss.animations.play('walk', 4, true);
    boss.scale.set(1);
    boss.alpha = 0;
    game.add.tween(boss).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
}

function update() {
    var style = { font: "30px Arial", fill: "white", align: "center" };
    var user_lost_text = game.add.text(game.world.centerX, game.world.centerY-50, "YOU LOSE!", style);
    user_lost_text.anchor.set(0.5);
    user_lost_text.alpha = 0;

    var boss_lost_text = game.add.text(game.world.centerX, game.world.centerY-50, "YOU WIN!", style);
    boss_lost_text.anchor.set(0.5);
    boss_lost_text.alpha = 0;

    // MAKE THE IMAGE ZOOM IN
    if (worldScale < 1.2){
        worldScale += 0.0015;
        game.world.pivot.x += 0.2
        game.world.pivot.y += 0.2
        game.world.scale.set(worldScale);
    };

    if (gon.bb_user_wrong_answer == true) {
        game.camera.shake(0.05, 500);
        gon.bb_user_wrong_answer = false;
    }
    else if (gon.bb_user_right_answer == true) {
        createExplosion();
        gon.bb_user_right_answer = false;
    }

    if (gon.user_game_over == true) {
        boss.animations.stop(null, true);
        game.add.tween(user_lost_text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        gon.user_game_over = false;
    }

    if (gon.boss_game_over == true) {
        boss.animations.stop(null, true);
        boss.alpha = 0;
        bossDeath();
        game.add.tween(boss_lost_text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
        gon.boss_game_over = false;
    }
}


function render() {

}

function createExplosion() {
    explode = game.add.sprite(game.world.centerX, game.world.centerY+10, 'explosion');
    explode.animations.add('walk');

    // 3rd param - loop once, 4th param - destroy sprite after playing once
    explode.animations.play('walk', 25, false, true);
    explode.alpha = 0;

    game.add.tween(explode).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
}

function bossDeath() {
    deadboss = game.add.sprite(game.world.centerX-40, game.world.centerY-30, 'boss-death');
    deadboss.animations.add('walk');

    // 3rd param - loop once, 4th param - destroy sprite after playing once
    deadboss.animations.play('walk', 4, false);

    game.add.tween(deadboss).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
}
