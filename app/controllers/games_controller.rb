class GamesController < ApplicationController
  include GamesHelper

  def index
  end

  def level_select
    @levels = HTTParty.get("http://mathcraft-api.herokuapp.com/levels")
  end

  def boss_battle
    # added dev branch
    @questions = get_questions("addition", "medium")

    current_question = @questions.pop

    @problem = current_question['problem']
    gon.answer = current_question['answer']

    if request.xhr?
      render json: { problem: @problem, answer: gon.answer }.to_json
    end
  end

  def timed_battle_forest
    @questions = get_questions("multiplication", "easy")

    current_question = @questions.pop

    @problem = current_question['problem']
    gon.answer = current_question['answer']

    if request.xhr?
      render json: { problem: @problem, answer: gon.answer }.to_json
    end
  end

  def timed_battle_cave
    # added dev branch
    @questions = get_questions("addition", "hard")

    current_question = @questions.pop

    @problem = current_question['problem']
    gon.answer = current_question['answer']

    if request.xhr?
      render json: { problem: @problem, answer: gon.answer }.to_json
    end

  end
end
