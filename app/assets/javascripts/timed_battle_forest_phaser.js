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

    //Load Resource Sprite
    game.load.image('wood', 'images/resources/wood.png');
    game.load.image('popup', 'images/sprites/popup.png');

    // Load Enemy Sprites
    game.load.spritesheet('stumpy', 'images/sprites/stumpy.png', 200, 220, 12);
}

function create() {
    timer = game.time.create();

    // invisible stumpy
    stumpy = game.add.sprite(game.world.centerX-20, game.world.centerY, 'stumpy');
    stumpy.alpha = 0

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
    game.add.tween(stumpy).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
    stumpy.anchor.setTo(0.3, 0.4);
}

function update() {
    // MAKE THE IMAGE ZOOM IN
    if (worldScale < 1.2){
        worldScale += 0.0015;
        game.world.pivot.x += 0.2
        game.world.pivot.y += 0.2
        game.world.scale.set(worldScale);
    };

    if (gon.forest_user_wrong_answer == true) {
        game.camera.shake(0.05, 500);
        gon.forest_user_wrong_answer = false;
    }
    else if (gon.forest_user_right_answer == true) {
        sproutResources();
        gon.forest_user_right_answer = false;
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

    $(".streak_counter").remove();

    text.anchor.set(0.5);

    stumpy.animations.stop(null, true);
    stumpy.alpha = 0;

    gon.forest_round_over = true;

    popup();
}

function formatTime(s) {
    // Convert seconds (s) to a nicely formatted and padded time string
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
}


function sproutResources() {
    var wood_sprite = game.add.sprite(stumpy.x, stumpy.y, 'wood');
    wood_sprite.alpha = 0;
    var woodTween = game.add.tween(wood_sprite).to({ alpha: 1, x: wood_sprite.x , y: 0 }, 2000, Phaser.Easing.Linear.None, true);

    woodTween.onComplete.add(function() {
        wood_sprite.x = stumpy.x; wood_sprite.y = stumpy.y;
        wood_sprite.alpha = 0;
    });
    woodTween.start();
}

function popup() {
    popup = game.add.sprite(game.world.centerX-125, game.world.centerY-100, 'popup');
    popup.scale.set(0.1);
    game.add.tween(popup.scale).to( { x: 1, y: 1.5 }, 2000, Phaser.Easing.Elastic.Out, true);

    popup.alpha = 0.8
    // popup.scale.set(0.1);
    // // debugger

    // // TEXT
    var ipsum = "Resources gained: 100 Wood!";
    var style = { font: "12px Arial", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    text = game.add.text(popup.x/2, popup.y/2, ipsum, style);
    text.setTextBounds(popup.x, popup.y);
    // // Center align
    // text.anchor.set(0.5);
    text.align = 'center';
    // //  Stroke color and thickness
    text.stroke = '#000000';
    text.strokeThickness = 4;
}
