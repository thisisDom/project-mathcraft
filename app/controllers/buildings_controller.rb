class BuildingsController < ApplicationController
  skip_before_action :verify_authenticity_token
  def build
    response = HTTParty.post("http://mathcraft-api.herokuapp.com/playersbuildings/", query: { data: { building_name: building_params[:building_name], location: building_params[:location],  player_id: session[:id] } } )
  end

  def upgrade
    response = HTTParty.post("http://mathcraft-api.herokuapp.com/playersbuildings/upgrade", query: { data: { building_name: building_params[:building_name], location: building_params[:location],  player_id: session[:id] } } )
    p response.body
  end

  private

  def building_params
    params.permit(:location, :building_name)
  end
end
