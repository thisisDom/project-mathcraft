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
    game.load.image('cave-background', 'images/backgrounds/cave.png');

    // Load Sprites
    game.load.spritesheet('golem', 'images/sprites/golem.png', 142.3, 140, 11);

    // Load Rock Resource
    game.load.image('cave-background', 'images/backgrounds/cave.png');
}

function create() {
    timer = game.time.create();

    // Create a delayed event 1m and 30s from now
    // timerEvent = timer.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, this.endTimer, this);
    timerEvent = timer.add(Phaser.Timer.SECOND * 15, this.endTimer, this);

    // Start the timer if not boss level
    timer.start();

    background = game.add.sprite(0, 0, 'cave-background');
    background.height = game.world.height;
    background.width = game.world.width;
    game.time.events.add(Phaser.Timer.SECOND * 2, findGolem, this);
}

function findGolem() {
    golem = game.add.sprite(game.world.centerX, game.world.centerY+50, 'golem');
    var walk = golem.animations.add('walk');
    golem.animations.play('walk', 8, true);
    golem.alpha = 0;
    game.add.tween(golem).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true);
    golem.anchor.setTo(0.3, 0.4);
}

function update() {
    var style = { font: "30px Arial", fill: "white", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY-50, "ROUND OVER!", style);
    text.anchor.set(0.5);
    text.alpha = 0;

    // MAKE THE IMAGE ZOOM IN
    if (worldScale < 1.2){
        worldScale += 0.0015;
        game.world.pivot.x += 0.2
        game.world.pivot.y += 0.2
        game.world.scale.set(worldScale);
    };

    if (gon.cave_user_wrong_answer == true) {
        game.camera.shake(0.05, 500);
        gon.cave_user_wrong_answer = false;
    }
    else if (gon.cave_user_right_answer == true) {
        // SPROUT RESOURCES
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

    golem.animations.stop(null, true);

    gon.cave_round_over = true;
}

function formatTime(s) {
    // Convert seconds (s) to a nicely formatted and padded time string
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
}
