class GamesController < ApplicationController
  include GamesHelper

  def index
  end

  def town
    session[:id] = 1
    id = session[:id]
    @player_info = get_player(id)
    p "* #{@player_info}"
    session[:player] = @player_info
  end

  def level_select
    @levels = get_levels
    session[:levels] = @levels
  end

  def show
    name = params[:name]
    gon.level_name = name

    @level = session[:levels].find { |level| level['title'] == name }
    @assets = get_level_info(name, 'assets')
    # request = "/players/#{session[:id]}/playerslevels/start", params[:level_id],  response = { players_level: :id }
    # render json: { assets: @assets }

    case name
    when "forest"
      @questions = get_questions('multiplication', 'easy')
    when "cave"
      @questions = get_questions('addition', 'medium')
    when "temple"
      @questions = get_questions('addition', 'hard')
    end

    current_question = @questions.pop

    @problem = current_question['problem']
    gon.answer = current_question['answer']

    if request.xhr?
       render json: { problem: @problem, answer: gon.answer }.to_json
    else
      case name
      when "forest"
        render "timed_battle_forest"
      when "cave"
        render "timed_battle_cave"
      when "temple"
        render "boss_battle"
      end
    end
  end

  def update
    # request = "/players/#{session[:id]}/playerslevels/complete", params[:players_level_id] , response + { player: {...} }}
  end


  def boss_battle
    # @assets = get_level_info('temple','assets')
    # # added dev branch
    # @questions = get_questions('addition', 'medium')

    # current_question = @questions.pop

    # @problem = current_question['problem']
    # gon.answer = current_question['answer']

    # if request.xhr?
    #   render json: { problem: @problem, answer: gon.answer }.to_json
    # end
  end

  def timed_battle_forest
    # @assets = get_level_info('forest', 'assets')
    # @questions = get_questions('multiplication', 'easy')

    # current_question = @questions.pop

    # @problem = current_question['problem']
    # gon.answer = current_question['answer']

    # if request.xhr?
    #   render json: { problem: @problem, answer: gon.answer }.to_json
    # end
  end

  def timed_battle_cave
    # @assets = get_level_info('cave','assets')

    # # added dev branch
    # @questions = get_questions('addition', 'hard')

    # current_question = @questions.pop

    # @problem = current_question['problem']
    # gon.answer = current_question['answer']

    # if request.xhr?
    #   render json: { problem: @problem, answer: gon.answer }.to_json
    # end
  end
end
