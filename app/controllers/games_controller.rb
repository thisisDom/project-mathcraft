class GamesController < ApplicationController
  include GamesHelper

  def index
  end

  def town
    id = session[:id] = 1
    p id
    @player_info = get_player(id)
    session[:player] = @player_info
  end

  def level_select
    @levels = get_levels
    session[:levels] = @levels
  end

  def show
    id = params[:id]
    p session[:levels]
    @level = session[:levels].find { |level| level['position'] == id.to_i }
    # request = "/players/#{session[:id]}/playerslevels/start", params[:level_id],  response = { players_level: :id }
    render json: { level: @level, player_level: @player_level }
  end

  def update
    # request = "/players/#{session[:id]}/playerslevels/complete", params[:players_level_id] , response + { player: {...} }}
  end


  def boss_battle
    @assets = get_level_info('temple','assets')
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
