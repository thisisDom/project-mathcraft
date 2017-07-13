class GamesController < ApplicationController
  include GamesHelper

  def town
    session[:id] = 1
    @player_info = get_player(session[:id])
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
    # @assets = @level['assets']

    response = HTTParty.post("http://mathcraft-api.herokuapp.com/playerslevels/start", query: { data: { level_id: @level['id'], player_id: session[:id] } } )

    body = JSON.parse(response.body)
    number = body['player_level']['id'].to_i

    case name
    when "forest"
      @questions = get_questions('addition', 'medium')
    when "cave"
      @questions = get_questions('multiplication', 'medium')
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
    request = HTTParty.post("http://mathcraft-api.herokuapp.com/playerslevels/complete", query: { data: { players_id: session[:id], players_level_id:  game_params[:players_level_id], correct_answers: game_params[:correct_answers] } } )
  end

  private

  def game_params
    params.permit(:players_level_id, :correct_answers)
  end

end
