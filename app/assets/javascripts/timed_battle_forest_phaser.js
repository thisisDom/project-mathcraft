var stumpy;
var tree1;
var timer, timerEvent, text;
var background;
var enemy_arr;

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
    game.load.spritesheet('tree1', 'images/sprites/tree1.png', 73, 85, 4);
    game.load.spritesheet('tree2', 'images/sprites/tree2.png', 129.66, 150, 12);
    game.load.spritesheet('tree3', 'images/sprites/tree3.png', 85.5, 87, 4);
    game.load.spritesheet('tree4', 'images/sprites/tree4.png', 72.25, 64, 4);
}

function create() {
    timer = game.time.create();

    // invisible stumpy
    stumpy = game.add.sprite(game.world.centerX-20, game.world.centerY, 'stumpy');
    stumpy.alpha = 0

    // Create a delayed event 1m and 30s from now
    // timerEvent = timer.add(Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30, this.endTimer, this);
    timerEvent = timer.add(Phaser.Timer.SECOND * 1, this.endTimer, this);

    // Start the timer if not boss level
    timer.start();

    background = game.add.sprite(0, 0, 'forest-background');
    background.height = game.world.height;
    background.width = game.world.width;
    game.time.events.add(Phaser.Timer.SECOND * 1, findStumpy, this);
//    game.time.events.add(Phaser.Timer.SECOND * 1, findTree1, this);
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

// function findTree1() {
//     stumpy = game.add.sprite(game.world.centerX-20, game.world.centerY, 'tree1');
//     var walk = stumpy.animations.add('walk');
//     stumpy.animations.play('walk', 4, true);
//     stumpy.alpha = 0;
//     stumpy.scale.set(1);
//     game.add.tween(stumpy).to( { alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
//     stumpy.anchor.setTo(0.3, 0.4);
// }

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
    // var style = { font: "30px Arial", fill: "white", align: "center" };
    // var text = game.add.text(game.world.centerX, game.world.centerY-80, "ROUND OVER!", style);

    $(".streak_counter").remove();

    // text.anchor.set(0.5);

    stumpy.animations.stop(null, true);
    stumpy.alpha = 0;

    gon.forest_round_over = true;

    var data = new Object();
    data.players_level_id = gon.players_level_id
    data.correct_answers = gon.net_correct_answers

    popup();
    
    $.ajax({
      url: '/gamecomplete',
      method: 'POST',
      data: data
    })

    gon.wrong_answer_counter = 0;
    gon.right_answer_counter = 0;

}

function formatTime(s) {
    // Convert seconds (s) to a nicely formatted and padded time string
    var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
}


function sproutResources() {
    var style = { font: "15px Arial", fill: "white", align: "center" };

    var wood_sprite = game.add.sprite(stumpy.x, stumpy.y, 'wood');
    var text_sprite = game.add.text(stumpy.x+20, stumpy.y, "x 1", style);

    wood_sprite.alpha = 0;
    text_sprite.alpha = 0;

    var woodTween = game.add.tween(wood_sprite).to({ alpha: 1, x: wood_sprite.x , y: 0 }, 2000, Phaser.Easing.Linear.None, true);
    var textTween = game.add.tween(text_sprite).to({ alpha: 1, x: text_sprite.x , y: 0 }, 2000, Phaser.Easing.Linear.None, true);

    woodTween.onComplete.add(function() {
        wood_sprite.x = stumpy.x; wood_sprite.y = stumpy.y;
        wood_sprite.alpha = 0;
    });
    woodTween.start();

    textTween.onComplete.add(function() {
        text_sprite.x = stumpy.x+20; text_sprite.y = stumpy.y;
        text_sprite.alpha = 0;
    });
    textTween.start();
}

function popup() {
    popup = game.add.sprite(game.world.centerX-125, game.world.centerY-100, 'popup');
    popup.inputEnabled = true;

    popup.scale.set(0.1);
    game.add.tween(popup.scale).to( { x: 1, y: 1.5 }, 2000, Phaser.Easing.Elastic.Out, true);

    popup.alpha = 0.8

    var result_text = "RESULTS";
    var newline1_text = "_______"
    var correct_text = "Correct Answers: " + gon.right_answer_counter;
    var wrong_text = "Wrong Answers: " + gon.wrong_answer_counter;
    var levelmult_text = "Level Multiplier: x 1"
    var newline2_text = "____________"
    var resourcesgained_text = "= (" + gon.right_answer_counter + " - " + gon.wrong_answer_counter + ") x " + "1"

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
    var wood_summary = game.add.sprite(popup.x+20, popup.y+140, 'wood');
    wood_summary.scale.set(0.5)
    var resourcesgained = game.add.text(popup.x-38, popup.y+75, resourcesgained_text, resourcesgained_style);

    result.setTextBounds(popup.x, popup.y);
    newline1.setTextBounds(popup.x, popup.y);
    correct.setTextBounds(popup.x, popup.y);
    wrong.setTextBounds(popup.x, popup.y);
    levelmult.setTextBounds(popup.x, popup.y);
    newline2.setTextBounds(popup.x, popup.y);
    resourcesgained.setTextBounds(popup.x, popup.y);

    result.align = 'center';
    newline1.align = 'center';
    correct.align = 'center';
    wrong.align = 'center';
    levelmult.align = 'center';
    newline2.align = 'center';
    resourcesgained.align = 'center';

    result.stroke = '#000000';
    newline1.stroke = '#00000';
    correct.stroke = '#000000';
    wrong.stroke = '#000000';
    levelmult.stroke = '#000000';
    newline2.stroke = '#00000';
    resourcesgained.stroke = '#000000';

    result.strokeThickness = 4;
    newline1.strokeThickness = 4;
    correct.strokeThickness = 4;
    wrong.strokeThickness = 4;
    levelmult.strokeThickness = 4;
    newline2.strokeThickness = 4;
    resourcesgained.strokeThickness = 4;

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
