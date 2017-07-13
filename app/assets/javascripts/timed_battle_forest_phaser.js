var stumpy;
var tree1;
var timer, timerEvent, text;
var background;
gon.level_multiplier = 1;
var enemy;

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
    game.load.image('back', '../images/buttons/back_button.png');

    // Load Enemy Sprites
    game.load.spritesheet('stumpy', '../images/sprites/stumpy.png', 200, 220, 12);
    game.load.spritesheet('tree1', '../images/sprites/tree1.png', 73, 85, 4);
    game.load.spritesheet('tree2', '../images/sprites/tree2.png', 75, 61, 4);
    game.load.spritesheet('tree3', '../images/sprites/tree3.png', 73, 85, 4);
    game.load.spritesheet('tree4', '../images/sprites/tree4.png', 72.25, 64, 4);

    game.load.audio('tetris', '../audio/background/tetris.mp3')
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

    music = game.add.audio('tetris');

    music.play();
    music.volume = 3;

    game.time.events.add(Phaser.Timer.SECOND * 1, findEnemy, this);

}

function findEnemy() {
    randomEnemy = rndNum(5);
    switch(randomEnemy){
        case 1:
            enemyName = 'tree1';
            break;
        case 2:
            enemyName = 'tree2';
            break;
        case 3:
            enemyName = 'tree3';
            break;
        case 4:
            enemyName = 'tree4';
            break;
        case 5:
            enemyName = 'stumpy';
            break;
    };

    enemy = game.add.sprite(game.world.centerX-20, game.world.centerY+30, enemyName);
    var walk = enemy.animations.add('walk');
    enemy.animations.play('walk',3,true);
    enemy.alpha = 0;
    game.add.tween(enemy).to( { alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
    enemy.anchor.setTo(0.3, 0.4);
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
        enemy.destroy();
        findEnemy();
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

    $(".streak_counter").remove();

    enemy.animations.stop(null, true);
    enemy.alpha = 0;

    gon.forest_round_over = true;

    gon.net_correct_answers = gon.right_answer_counter - gon.wrong_answer_counter

    var data = new Object();
    data.players_level_id = gon.players_level_id;
    data.correct_answers = gon.net_correct_answers;

    console.log(data);
    popup();

    $("input[name='players_level_id']").val(gon.players_level_id)
    $("input[name='correct_answers']").val(gon.net_correct_answers)
    gon.wrong_answer_counter = 0;
    gon.right_answer_counter = 0;
    $("#level-form").submit();
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
    var res_gained;
    var temp = (gon.right_answer_counter - gon.wrong_answer_counter) * gon.level_multiplier;

    if (temp < 0) {
        res_gained = 0;
    }
    else {
        res_gained = temp;
    }

    popup = game.add.sprite(game.world.centerX-125, game.world.centerY-100, 'popup');
    popup.inputEnabled = true;

    popup.scale.set(0.1);
    popupDisplay = game.add.tween(popup.scale).to( { x: 1, y: 1.8 }, 2000, Phaser.Easing.Elastic.Out, true);

    popup.alpha = 0.8;

    var result_text = "RESULTS";
    var newline1_text = "_______"
    var correct_text = "Correct Answers: " + gon.right_answer_counter;
    var wrong_text = "Wrong Answers: " + gon.wrong_answer_counter;
    var levelmult_text = "Level Multiplier: x " + gon.level_multiplier;
    var newline2_text = "____________";
    var resourcesgained_text = "Gained = " + res_gained;

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

    var finalResourceIcon = game.add.sprite(120, 200, 'wood');
    finalResourceIcon.scale.set(0.9);

    var backButtonIcon = game.add.sprite(155, 250, 'back');
    backButtonIcon.scale.set(0.6);
    backButtonIcon.alpha = 0;
    game.add.tween(backButtonIcon).to( { alpha: 1 }, 3000, 'Linear', true);

    var finalResourceAmount = game.add.text(finalResourceIcon.x+50, finalResourceIcon.y+10, resourcesgained_text, {font: "15px Verdana", fill: "#ffffff"});

    result.setTextBounds(popup.x, popup.y);
    newline1.setTextBounds(popup.x, popup.y);
    correct.setTextBounds(popup.x, popup.y);
    wrong.setTextBounds(popup.x, popup.y);
    levelmult.setTextBounds(popup.x, popup.y);
    newline2.setTextBounds(popup.x, popup.y);

    result.align = 'center';
    newline1.align = 'center';
    correct.align = 'center';
    wrong.align = 'center';
    levelmult.align = 'center';
    newline2.align = 'center';

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

function redirect_to_town() {
    window.open("/town", "_self");
}

function rndNum(num) {
    return Math.round(Math.random() * num);
}
