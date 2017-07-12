class GamesController < ApplicationController
  include GamesHelper

  def index
  end

  def level_select
    @levels = get_levels
  end

  def boss_battle
    @assets = get_level_info('temple','assets')
    p @assets
    # added dev branch
    @questions = get_questions('addition', 'medium')

    current_question = @questions.pop

    @problem = current_question['problem']
    gon.answer = current_question['answer']

    if request.xhr?
      render json: { problem: @problem, answer: gon.answer }.to_json
    end
  end

  def timed_battle_forest
    @assets = get_level_info('forest', 'assets')
    @questions = get_questions('multiplication', 'easy')

    current_question = @questions.pop

    @problem = current_question['problem']
    gon.answer = current_question['answer']

    if request.xhr?
      render json: { problem: @problem, answer: gon.answer }.to_json
    end
  end

  def timed_battle_cave
    @assets = get_level_info('cave','assets')

    # added dev branch
    @questions = get_questions('addition', 'hard')

    current_question = @questions.pop

    @problem = current_question['problem']
    gon.answer = current_question['answer']

    if request.xhr?
      render json: { problem: @problem, answer: gon.answer }.to_json
    end

  end
end
