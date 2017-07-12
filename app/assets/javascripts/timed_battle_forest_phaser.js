var stumpy;
var timer, timerEvent, text;
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
    // Load Background
    game.load.image('forest-background', 'images/backgrounds/forest.png');

    // Load Sprites
    game.load.spritesheet('stumpy', 'images/sprites/stumpy.png', 200, 220, 12);
}

function create() {
    timer = game.time.create();

    // Create a delayed event 1m and 30s from now
    // timerEvent = timer.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, this.endTimer, this);
    timerEvent = timer.add(Phaser.Timer.SECOND * 5, this.endTimer, this);

    // Start the timer if not boss level
    timer.start();

    background = game.add.sprite(0, 0, 'forest-background');
    background.height = game.world.height;
    background.width = game.world.width;
    game.time.events.add(Phaser.Timer.SECOND * 2, findStumpy, this);
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
    // If our timer is running, show countdown
    if (timer.running) {
        game.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), game.world.centerX-20, game.world.centerY-100, "#ff0");
    }
}

function endTimer() {
    // Stop the timer when the delayed event triggers
    timer.stop();
    var style = { font: "30px Arial", fill: "white", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY-80, "ROUND OVER!", style);

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
