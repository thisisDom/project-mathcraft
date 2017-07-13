var golem;
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

    game.load.image('stone', 'images/resources/stone_sprout.png');
    game.load.image('popup', 'images/sprites/popup.png');

    // Load Sprites
    game.load.spritesheet('golem', 'images/sprites/golem.png', 142.3, 140, 11);

    // Load Rock Resource
    game.load.image('cave-background', 'images/backgrounds/cave.png');

    game.load.audio('super-mario', '../audio/super-mario.mp3')

}

function create() {
    timer = game.time.create();

    golem = game.add.sprite(game.world.centerX, game.world.centerY+50, 'golem');
    golem.alpha = 0

    // Create a delayed event 1m and 30s from now
    // timerEvent = timer.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, this.endTimer, this);
    timerEvent = timer.add(Phaser.Timer.SECOND * 3, this.endTimer, this);

    // Start the timer if not boss level
    timer.start();

    background = game.add.sprite(0, 0, 'cave-background');
    background.height = game.world.height;
    background.width = game.world.width;
    game.time.events.add(Phaser.Timer.SECOND * 2, findGolem, this);

    //when the level loads, play the theme
    music = game.add.audio('super-mario');

    music.play();
    music.volume = 3;
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
        sproutResources();
        gon.cave_user_right_answer = false;
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

    golem.animations.stop(null, true);
    golem.alpha = 0;

    gon.cave_round_over = true;

    popup();
}

function formatTime(s) {
    // Convert seconds (s) to a nicely formatted and padded time string
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
}

function sproutResources() {
    var stone_sprite = game.add.sprite(golem.x, golem.y, 'stone');
    stone_sprite.alpha = 0;
    var stoneTween = game.add.tween(stone_sprite).to({ alpha: 1, x: stone_sprite.x , y: 0 }, 2000, Phaser.Easing.Linear.None, true);

    stoneTween.onComplete.add(function() {
        stone_sprite.x = golem.x; stone_sprite.y = golem.y;
        stone_sprite.alpha = 0;
    });
    stoneTween.start();
}

function popup() {
    popup = game.add.sprite(game.world.centerX-125, game.world.centerY-100, 'popup');
    popup.inputEnabled = true;

    popup.scale.set(0.1);
    popupDisplay = game.add.tween(popup.scale).to( { x: 1, y: 1.5 }, 2000, Phaser.Easing.Elastic.Out, true);

    popup.alpha = 0.8

    var result_text = "RESULTS";
    var newline1_text = "_______"
    var correct_text = "Correct Answers: " + gon.right_answer_counter;
    var wrong_text = "Wrong Answers: " + gon.wrong_answer_counter;
    var levelmult_text = "Level Multiplier: x 1"
    var newline2_text = "____________"
    // var resourcesgained_text = "= (" + gon.right_answer_counter + " - " + gon.wrong_answer_counter + ") x " + "1"
    var resourcesgained_text = "5"

    var result_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var newline1_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var correct_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var wrong_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var levelmult_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var newline2_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var resourcesgained_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };

    var result = game.add.text(popup.x-20, popup.y-55, result_text, result_style);
    var newline1 = game.add.text(popup.x-20, popup.y-50, newline1_text, newline1_style);
    var correct = game.add.text(popup.x-38, popup.y-15, correct_text, correct_style);
    var wrong = game.add.text(popup.x-38, popup.y+5, wrong_text, wrong_style);
    var levelmult = game.add.text(popup.x-38, popup.y+25, levelmult_text, levelmult_style);
    var newline2 = game.add.text(popup.x-50, popup.y+35, newline2_text, newline2_style);

    // var wood_summary = game.add.sprite(popup.x + 80, popup.y+140, 'stone');
    // wood_summary.scale.set(0.5)
    // var resourcesgained = game.add.text(popup.x-38, popup.y+75, resourcesgained_text, resourcesgained_style);

    var finalResourceIcon = game.add.sprite(170,210, 'stone');
    var finalResourceAmount = game.add.text(finalResourceIcon.x, finalResourceIcon.y, "5",{fill: "#ffffff"});
    finalResourceAmount.anchor.set(-1.0,0);

    result.setTextBounds(popup.x, popup.y);
    newline1.setTextBounds(popup.x, popup.y);
    correct.setTextBounds(popup.x, popup.y);
    wrong.setTextBounds(popup.x, popup.y);
    levelmult.setTextBounds(popup.x, popup.y);
    newline2.setTextBounds(popup.x, popup.y);
    // resourcesgained.setTextBounds(popup.x, popup.y);

    result.align = 'center';
    newline1.align = 'center';
    correct.align = 'center';
    wrong.align = 'center';
    levelmult.align = 'center';
    newline2.align = 'center';
    // resourcesgained.align = 'center';

    result.stroke = '#000000';
    newline1.stroke = '#00000';
    correct.stroke = '#000000';
    wrong.stroke = '#000000';
    levelmult.stroke = '#000000';
    newline2.stroke = '#00000';
    finalResourceAmount.stroke = '#00000';

    result.strokeThickness = 4;
    newline1.strokeThickness = 4;
    correct.strokeThickness = 4;
    wrong.strokeThickness = 4;
    levelmult.strokeThickness = 4;
    newline2.strokeThickness = 4;
    finalResourceAmount.strokeThickness = 4;

    popup.events.onInputDown.add(redirect_to_town, this)
}

function update_data() {
  $.ajax({
    url: "/town",
    method: 'POST',
    data: 1
  })
  .done(function(response) {
    console.log("success");
  })
  .fail(function(response) {
    console.log("something went wrong!", response);
  });
}

function redirect_to_town() {
    window.open("/town","_self");
}
