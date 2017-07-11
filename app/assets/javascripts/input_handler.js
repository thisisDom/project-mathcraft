var wrong_answer_counter = 0;
var guess_attempts = 0;
var correct_answer_counter = 0;

$(document).ready(function() {
    updateAnswerBox_withUserInput();
    clearText_fromAnswerBox();
    captureUserData_and_manipulateAnimation();
});

var updateAnswerBox_withUserInput = function() {
  $(".calculator").on("click", function(e) {
    e.preventDefault();
    var $number = $(this)[0].innerText;
    $(".answer_area").append($number);
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
    updateQuestionsviaAJAX();

    guess_attempts += 1;

    var $user_input = $(".answer_area")[0].innerText;

    if ($user_input == gon.answer) {
     correct_answer_counter += 1;
     $("#correct_counter").html(correct_answer_counter);
    }
    else {
      $("#correct_counter").html("0");
      correct_answer_counter = 0;
      wrong_answer_counter += 1;
      gon.wrong_answer = true;

      var $find_hearts = $(".hearts")[0].children;

      if ($find_hearts.length > 0) {
        $find_hearts[$find_hearts.length-1].remove();
      }

      if (wrong_answer_counter == 3) {
        gon.game_over = true;
      }
    }
  })
}

var updateQuestionsviaAJAX = function() {
  $.ajax({
    url: "/",
    method: 'GET'
  })
  .done(function(response) {
    $(".question_area").html(response.question);
    $(".answer_area")[0].innerText = "";
    gon.answer = response.answer;
  })
  .fail(function(response) {
    console.log("something went wrong!", response);
  });
}
