var boss;
var explode;
var deadboss;
var background;
gon.level_multiplier = 2;

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
    game.load.image('gold', 'images/resources/Gold.png');
    game.load.image('popup', 'images/sprites/popup.png');
    game.load.image('back', '../images/buttons/back_button.png');

    // Load Sprites
    game.load.spritesheet('boss', 'images/sprites/boss-stomp.png', 192, 172, 6);
    game.load.spritesheet('boss-shoot', 'images/sprites/boss-shoot.png', 192, 172, 6);
    game.load.spritesheet('boss-death', 'images/sprites/boss-death.png', 238.85, 170, 7);
    game.load.spritesheet('explosion', 'images/sprites/explosion.png', 100, 100, 37);

    // Load audio
    game.load.audio('zelda','../audio/background/zelda.mp3')
}

function create() {
    var scene = gon.scene

    background = game.add.sprite(0, 0, 'temple-background');
    background.height = game.world.height;
    background.width = game.world.width;
    game.time.events.add(Phaser.Timer.SECOND * 2, findBoss, this);

    music = game.add.audio('zelda');

    music.play();
    music.volume = 3;
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
        gon.user_game_over = false;
        gon.disable_input = true;

        setTimeout(function() {
          popup_loss();
        }, 1500);
    }

    if (gon.boss_game_over == true) {
        boss.animations.stop(null, true);
        boss.alpha = 0;
        bossDeath();
        gon.boss_game_over = false;
        gon.disable_input = true;

        setTimeout(function() {
          popup_win();
        }, 3000);

        gon.net_correct_answers = gon.right_answer_counter;

        var data = new Object();
        data.players_level_id = gon.players_level_id;
        data.correct_answers = gon.net_correct_answers;

        $("input[name='players_level_id']").val(gon.players_level_id);
        $("input[name='correct_answers']").val(gon.net_correct_answers);
        gon.wrong_answer_counter = 0;
        gon.right_answer_counter = 0;
        $("#level-form").submit();
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

function popup_win() {
    var res_gained = (gon.right_answer_counter) * gon.level_multiplier;

    popup = game.add.sprite(game.world.centerX-125, game.world.centerY-100, 'popup');
    popup.inputEnabled = true;

    popup.scale.set(0.1);
    popupDisplay = game.add.tween(popup.scale).to( { x: 1, y: 1.8 }, 2000, Phaser.Easing.Elastic.Out, true);

    popup.alpha = 0.8;

    var result_text = "RESULTS";
    var newline1_text = "_______"
    var correct_text = "Correct Answers: " + gon.right_answer_counter;
    var levelmult_text = "Level Multiplier: x " + gon.level_multiplier;
    var newline2_text = "____________";
    var resourcesgained_text = "Gained = " + res_gained;

    var result_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var newline1_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var correct_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var levelmult_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var newline2_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var resourcesgained_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };

    var result = game.add.text(popup.x-20, popup.y-55, result_text, result_style);
    var newline1 = game.add.text(popup.x-20, popup.y-50, newline1_text, newline1_style);
    var correct = game.add.text(popup.x-38, popup.y-15, correct_text, correct_style);
    var levelmult = game.add.text(popup.x-38, popup.y+25, levelmult_text, levelmult_style);
    var newline2 = game.add.text(popup.x-50, popup.y+35, newline2_text, newline2_style);

    var finalResourceIcon = game.add.sprite(120, 200, 'gold');

    var backButtonIcon = game.add.sprite(155, 250, 'back');
    backButtonIcon.scale.set(0.6);
    backButtonIcon.alpha = 0;
    game.add.tween(backButtonIcon).to( { alpha: 1 }, 3000, 'Linear', true);

    var finalResourceAmount = game.add.text(finalResourceIcon.x+50, finalResourceIcon.y+10, resourcesgained_text, {font: "15px Verdana", fill: "#ffffff"});

    result.setTextBounds(popup.x, popup.y);
    newline1.setTextBounds(popup.x, popup.y);
    correct.setTextBounds(popup.x, popup.y);
    levelmult.setTextBounds(popup.x, popup.y);
    newline2.setTextBounds(popup.x, popup.y);

    result.align = 'center';
    newline1.align = 'center';
    correct.align = 'center';
    levelmult.align = 'center';
    newline2.align = 'center';

    result.stroke = '#000000';
    newline1.stroke = '#00000';
    correct.stroke = '#000000';
    levelmult.stroke = '#000000';
    newline2.stroke = '#00000';
    finalResourceAmount.stroke = '#00000';

    result.strokeThickness = 4;
    newline1.strokeThickness = 4;
    correct.strokeThickness = 4;
    levelmult.strokeThickness = 4;
    newline2.strokeThickness = 4;
    finalResourceAmount.strokeThickness = 4;

    popup.events.onInputDown.add(redirect_to_town, this)
}

function popup_loss() {
    var res_gained = 0;

    popup = game.add.sprite(game.world.centerX-125, game.world.centerY-100, 'popup');
    popup.inputEnabled = true;

    popup.scale.set(0.1);
    popupDisplay = game.add.tween(popup.scale).to( { x: 1, y: 1.8 }, 2000, Phaser.Easing.Elastic.Out, true);

    popup.alpha = 0.8;

    var result_text = "RESULTS";
    var newline1_text = "_______"
    var resourcesgained_text = "Gained = " + res_gained;

    var result_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var newline1_style = { font: "22px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };
    var resourcesgained_style = { font: "15px Verdana", fill: "#fff", wordWrap: true, wordWrapWidth: 650 };

    var result = game.add.text(popup.x-20, popup.y-55, result_text, result_style);
    var newline1 = game.add.text(popup.x-20, popup.y-50, newline1_text, newline1_style);

    var finalResourceIcon = game.add.sprite(120, 150, 'gold');

    var backButtonIcon = game.add.sprite(155, 250, 'back');
    backButtonIcon.scale.set(0.6);
    backButtonIcon.alpha = 0;
    game.add.tween(backButtonIcon).to( { alpha: 1 }, 3000, 'Linear', true);

    var finalResourceAmount = game.add.text(finalResourceIcon.x+50, finalResourceIcon.y+10, resourcesgained_text, {font: "15px Verdana", fill: "#ffffff"});

    result.setTextBounds(popup.x, popup.y);
    newline1.setTextBounds(popup.x, popup.y);

    result.align = 'center';
    newline1.align = 'center';

    result.stroke = '#000000';
    newline1.stroke = '#00000';
    finalResourceAmount.stroke = '#00000';

    result.strokeThickness = 4;
    newline1.strokeThickness = 4;
    finalResourceAmount.strokeThickness = 4;

    popup.events.onInputDown.add(redirect_to_town, this)
}


function redirect_to_town() {
    window.open("/town", "_self");
}
