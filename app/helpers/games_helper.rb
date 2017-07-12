module GamesHelper

  def get_questions(type, difficulty)
    return HTTParty.get("http://mathcraft-api.herokuapp.com/generate/?type=#{type}&difficulty=#{difficulty}")['questions']
  end
end
