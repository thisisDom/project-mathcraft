var wrong_answer_counter = 0;
var right_answer_counter = 0;

$(document).ready(function() {
    gon.forest_round_over = false;
    gon.forest_user_wrong_answer = false;
    gon.forest_user_right_answer = false;

    updateAnswerBox_withUserInput();
    clearText_fromAnswerBox();
    captureUserData_and_manipulateAnimation();

    $(".calculator_wrapper").css("background-image", "url('images/backgrounds/forest.png')");
});

var updateAnswerBox_withUserInput = function() {
  $(".calculator").on("click", function(e) {
    e.preventDefault();

    if (gon.forest_round_over == false) {
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

    if (gon.forest_round_over == false) {
      var $user_input = $(".answer_area")[0].innerText;

      if ($user_input == gon.answer) {
        gon.forest_user_right_answer = true;
        right_answer_counter += 1;

        $(".streak_btn").html(right_answer_counter);

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
    url: "/boss_battle",
    method: 'GET'
  })
  .done(function(response) {
    console.log(response)
    $(".question_area").html(response.question);
    $(".answer_area")[0].innerText = "";
    gon.answer = response.answer;
  })
  .fail(function(response) {
    console.log("something went wrong!", response);
  });
}
