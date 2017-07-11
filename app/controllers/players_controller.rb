class PlayersController < ApplicationController
  def new
  end

  def create
    player = Player.new(player_params)
    response = MathAPIAdapter.create('/players', player )
    if response['player']
      player.from_json(response['player'])
      session[:id] = player.id
      redirect_to "/"
    else
      @errors = response['errors']
      render 'new'
    end
  end

  def show
    response = MathAPIAdapter.show("/players/#{params[:id]}")
    if response['player']
      @player = Player.new
      @player.from_json(response['player'])
      if home?
        render 'players/home'
      end
    else
      redirect '/home'
    end
  end

  private

  def player_params
    params.require(:player).permit(:username,
                                   :email_address,
                                   :password,
                                   :avatar_asset_link,
                                  )
  end

  def home?
    params[:id] == session[:id] ? true : false
  end
end
