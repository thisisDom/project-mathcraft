module GamesHelper

  def get_questions(type, difficulty)
    return HTTParty.get("http://mathcraft-api.herokuapp.com/generate/?type=#{type}&difficulty=#{difficulty}")['questions']
  end

  def get_level_info(level_name, key)
    levels = get_levels
    level = levels.find { |level| level['title'] == level_name }
    return level[key]
  end

  def get_levels
    return HTTParty.get("http://mathcraft-api.herokuapp.com/levels")['levels']
  end

  def get_player(id)
    return HTTParty.get("http://mathcraft-api.herokuapp.com/players/#{id}")['player']
  end


end
