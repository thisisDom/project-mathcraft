class GamesController < ApplicationController
  include GamesHelper

  def index
  end

  def town
    session[:id] = 1
    @player_info = get_player(session[:id])
    p "* #{@player_info}"
    session[:player] = @player_info
  end

  def level_select
    @levels = get_levels
    session[:levels] = @levels
  end

  def accept_town_buildings


  end

  def start
    request = HTTParty.post("http://mathcraft-api.herokuapp.com/playerslevels/start", query: { data: { level_id: 1, player_id: 1 } } )
    p "^" * 100
    body = JSON.parse(request.body)
    p body
    p "*" * 100
    number = body['player_level']['id'].to_i
    p number

    other_request = HTTParty.post("http://mathcraft-api.herokuapp.com/playerslevels/complete", query: { data: { players_id: 1, players_level_id: number, correct_answers: 5 } } )
    p other_request.body
    p ":)" * 100
  end

  def show
    name = params[:name]
    gon.level_name = name

    @level = session[:levels].find { |level| level['title'] == name }
    p @level['id']
    p session[:id]
    @assets = @level['assets']
    p @assets

    response = HTTParty.post("http://mathcraft-api.herokuapp.com/playerslevels/start", query: { data: { level_id: @level['id'], player_id: session[:id] } } )
    p "^" * 100
    p response
    body = JSON.parse(response.body)
    p "fuck"*20
    number = body['player_level']['id'].to_i
    p number

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

    gon.players_level_id = number

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

  def complete
    p game_params
    request = HTTParty.post("http://mathcraft-api.herokuapp.com/playerslevel/complete", query: { data: { players_id: session[:id], players_level_id:  game_params[:players_level_id], correct_answers: game_params[:correct_answers] } } )
    p request
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

  private

  def game_params
    params.permit(:players_level_id, :correct_answers)
  end

end
