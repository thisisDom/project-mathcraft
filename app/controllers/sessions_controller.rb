class SessionsController < ApplicationController
  def new

  end

  def create
    
  end

  def delete

  end

  private
    def sessions_params
      params.require(:player).permit(:email_address, :login)
    end

end
