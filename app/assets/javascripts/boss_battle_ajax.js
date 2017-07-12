var wrong_answer_counter = 0;
var right_answer_counter = 0;

$(document).ready(function() {
    gon.disable_input = false;
    gon.boss_game_over = false;
    gon.user_game_over = false;
    gon.bb_user_wrong_answer = false;
    gon.bb_user_right_answer = false;

    updateAnswerBox_withUserInput();
    clearText_fromAnswerBox();
    captureUserData_and_manipulateAnimation();

    $(".calculator_wrapper").css("background-image", "url('images/backgrounds/temple.jpg')");
});

var updateAnswerBox_withUserInput = function() {
  $(".calculator").on("click", function(e) {
    e.preventDefault();

    if (gon.disable_input == false) {
      var $number = $(this)[0].innerText;
      $(".answer_area").append($number);
    }
  });
}

var clearText_fromAnswerBox = function() {
  $(".calculator-cancel").on("click", function(e) {
    e.preventDefault();
    $(".answer_area")[0].innerText = "";
  });
}

var captureUserData_and_manipulateAnimation = function() {
  $(".calculator-submit").on("click", function(e) {
    e.preventDefault();

    var $find_hearts = $(".hearts")[0].children;

    if (gon.disable_input == false) {
      var $user_input = $(".answer_area")[0].innerText;

      if ($user_input == gon.answer) {
        right_answer_counter += 1;

        if (right_answer_counter == 5) {
          gon.boss_game_over = true;
        }
        else {
          updateQuestionsviaAJAX();
          gon.bb_user_right_answer = true;
        }
      }
      else {
        wrong_answer_counter += 1;

        $find_hearts[$find_hearts.length-1].remove();

        if (wrong_answer_counter == 5) {
          gon.bb_user_wrong_answer = true;
          gon.user_game_over = true;
        }
        else {
          gon.bb_user_wrong_answer = true;
        }
      }
    }
  })
}

var updateQuestionsviaAJAX = function() {
  $.ajax({
    url: "/levels/" + gon.level_name,
    method: 'GET'
  })
  .done(function(response) {
    $(".question_area").html(response.problem);
    $(".answer_area")[0].innerText = "";
    gon.answer = response.answer;
  })
  .fail(function(response) {
    console.log("something went wrong!", response);
  });
}
