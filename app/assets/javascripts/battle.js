var golem;
var stumpy;
var boss;
var explode;
var timer, timerEvent, text;
var deadboss;
var background;

game = new Phaser.Game($("#gameArea").width(), $("#gameArea").height(), Phaser.CANVAS, 'gameArea', {
    preload: preload,
    create: create,
    update: update,
    render: render,
    endTimer: endTimer,
    formatTime: formatTime
});

var worldScale = 1;

function preload() {
    // Do I need this?
    // game.load.crossOrigin = true;

    // Load Background
    game.load.image('cave-background', 'images/backgrounds/cave.png');
    game.load.image('forest-background', 'images/backgrounds/forest.png');
    game.load.image('temple-background', 'images/backgrounds/temple.jpg');

    // Load Sprites
    game.load.spritesheet('stumpy', 'images/sprites/stumpy.png', 200, 220, 12);
    game.load.spritesheet('golem', 'images/sprites/golem.png', 142.3, 140, 11);
    game.load.spritesheet('boss', 'images/sprites/boss-stomp.png', 192, 172, 6);
    game.load.spritesheet('boss-shoot', 'images/sprites/boss-shoot.png', 192, 172, 6);
    game.load.spritesheet('boss-death', 'images/sprites/boss-death.png', 238.85, 170, 7);
    game.load.spritesheet('explosion', 'images/sprites/explosion.png', 100, 100, 37);
}

function create() {
    var scene = gon.scene

    timer = game.time.create();

    // Create a delayed event 1m and 30s from now
    // timerEvent = timer.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, this.endTimer, this);

    // Create a delayed event 30s from now
    timerEvent = timer.add(Phaser.Timer.SECOND * 60, this.endTimer, this);

    // Start the timer if not boss level
    if (gon.scene != 'temple') {
        timer.start();
    }

    switch (scene) {
      case 'cave':
        background = game.add.sprite(0, 0, 'cave-background');
        background.height = game.world.height;
        background.width = game.world.width;
        game.time.events.add(Phaser.Timer.SECOND * 2, findGolem, this);
        break;
      case 'temple':
        background = game.add.sprite(0, 0, 'temple-background');
        background.height = game.world.height;
        background.width = game.world.width;
        game.time.events.add(Phaser.Timer.SECOND * 2, findBoss, this);
        break;
      case 'forest':
        background = game.add.sprite(0, 0, 'forest-background');
        background.height = game.world.height;
        background.width = game.world.width;
        game.time.events.add(Phaser.Timer.SECOND * 2, findStumpy, this);
        break;
      default:
        console.log("ERROR - Couldn't find case:" + scene)
    }
}

function findBoss() {
    boss = game.add.sprite(game.world.centerX-40, game.world.centerY-30, 'boss');
    var walk = boss.animations.add('walk');
    boss.animations.play('walk', 4, true);
    boss.scale.set(1);
    boss.alpha = 0;
    game.add.tween(boss).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
}

function findStumpy() {
    stumpy = game.add.sprite(game.world.centerX-20, game.world.centerY, 'stumpy');
    var walk = stumpy.animations.add('walk');
    stumpy.animations.play('walk', 8, true);
    stumpy.alpha = 0;
    stumpy.scale.set(0.9);
    game.add.tween(stumpy).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
    stumpy.anchor.setTo(0.3, 0.4);
}

function findGolem() {
    golem = game.add.sprite(game.world.centerX, game.world.centerY+50, 'golem');
    var walk = golem.animations.add('walk');
    golem.animations.play('walk', 8, true);
    golem.alpha = 0;
    game.add.tween(golem).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    golem.anchor.setTo(0.3, 0.4);
}

function createExplosion() {
    explode = game.add.sprite(game.world.centerX, game.world.centerY+10, 'explosion');
    explode.animations.add('walk');

    // 3rd param - loop once, 4th param - destroy sprite after playing once
    explode.animations.play('walk', 30, false, true);
    explode.alpha = 0;

    game.add.tween(explode).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
}

function bossDeath() {
    deadboss = game.add.sprite(game.world.centerX-40, game.world.centerY-30, 'boss-death');
    deadboss.animations.add('walk');

    // 3rd param - loop once, 4th param - destroy sprite after playing once
    deadboss.animations.play('walk', 3, false);
    // deadboss.alpha = 0;

    game.add.tween(deadboss).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
}

function update() {
    var style = { font: "30px Arial", fill: "white", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY-50, "GAME OVER!", style);
    text.anchor.set(0.5);
    text.alpha = 0;



    // MAKE THE IMAGE ZOOM IN
    if (worldScale < 1.2){
        worldScale += 0.0015;
        game.world.pivot.x += 0.2
        game.world.pivot.y += 0.2
        game.world.scale.set(worldScale);
    };

    if (gon.wrong_answer == true) {
        if (gon.scene == 'temple') {
            createExplosion();
        }

        if (gon.game_over == true) {
            timer.stop();
            game.camera.shake(0.05, 500);
            game.add.tween(text).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);

            if (gon.scene == 'temple') {
                boss.animations.stop(null, true);
                boss.alpha = 0;
                bossDeath();
            }
            else if (gon.scene == 'forest') {
                stumpy.animations.stop(null, true);
            }
            else {
                golem.animations.stop(null, true);
            }

            gon.wrong_answer = false;
        }
        else {
            game.camera.shake(0.05, 500);
            gon.wrong_answer = false;
        }
    }
}

function render() {
    // If our timer is running, show countdown'
    if (timer.running) {
        game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), game.world.centerX-20, game.world.centerY-100, "#ff0");
    }
}

function endTimer() {
    // Stop the timer when the delayed event triggers
    timer.stop();
    var style = { font: "30px Arial", fill: "white", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY-80, "GAME OVER!", style);

    text.anchor.set(0.5);

    if (gon.scene == 'temple') { boss.animations.stop(null, true); boss}
    else if (gon.scene == 'forest') { stumpy.animations.stop(null, true); }
    else { golem.animations.stop(null, true); }

    gon.game_over = true;
}

function formatTime(s) {
    // Convert seconds (s) to a nicely formatted and padded time string
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
}



// ----------------------- OLD CODE -----------------------
//  --- CREATE
// background.anchor.setTo(-0.5, -0.5);
// game.world.pivot.x = width / 2;
// game.world.pivot.y = height /2 ;
// game.time.events.add(Phaser.Timer.SECOND * 2.5, popup, this);
//  --- FUNCTIONS
// function popup() {
//     popup = game.add.sprite(game.world.centerX+50, game.world.centerY-200, 'popup');
//     popup.anchor.set(0.5);
//     popup.alpha = 0.8
//     popup.scale.set(0.1);
//     game.add.tween(popup.scale).to( { x: 3, y: 1.8 }, 1500, Phaser.Easing.Elastic.Out, true);
//     // debugger

//     // TEXT
//     var ipsum = "Resources gained: 100 Wood!";
//     var style = { font: "30px Arial", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
//     text = game.add.text(0, 0, ipsum, style);
//     text.setTextBounds(popup.x, popup.y);
//     // Center align
//     text.anchor.set(0.5);
//     text.align = 'center';
//     //  Stroke color and thickness
//     text.stroke = '#000000';
//     text.strokeThickness = 4;
// }
//  --- DEBUGGING ZOOM
// if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {}
// game.debug.cameraInfo(game.camera, 32, 32);
