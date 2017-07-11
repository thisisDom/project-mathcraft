var wrong_answer_counter = 0;
var guess_attempts = 0;
var streak_counter = 0;

$(document).ready(function() {
    gon.game_over = false;

    updateAnswerBox_withUserInput();
    clearText_fromAnswerBox();
    captureUserData_and_manipulateAnimation();
    updateCalculatorWrapper_backgroundImage();
});

var updateAnswerBox_withUserInput = function() {
  $(".calculator").on("click", function(e) {
    e.preventDefault();

    if (gon.game_over == false) {
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

    if (gon.game_over == false) {
      updateQuestionsviaAJAX();

      guess_attempts += 1;

      var $user_input = $(".answer_area")[0].innerText;

      if ($user_input == gon.answer) {
       streak_counter += 1;

       if (streak_counter >= 2) {
          $(".streak_btn").html("<div id=\"streak_counter\" class=\"streak_counter\"><div>" + streak_counter + "</div><span>combo</span></div>");
        }
      }
      else {
        $("#streak_counter").remove();
        streak_counter = 0;

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

var updateCalculatorWrapper_backgroundImage = function() {
  switch (gon.scene) {
    case 'cave':
      $(".calculator_wrapper").css("background-image", "url('images/backgrounds/cave.png')");
      break;
    case 'temple':
      $(".calculator_wrapper").css("background-image", "url('images/backgrounds/temple.jpg')");
      break;
    case 'forest':
      $(".calculator_wrapper").css("background-image", "url('images/backgrounds/forest.png')");
      break;
    default:
      console.log("ERROR - Couldn't find scene:" + scene)
  }
}
