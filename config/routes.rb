Rails.application.routes.draw do
  get '/login', to: 'sessions#new'
  post 'login', to: 'sessions#create'

  get 'logout', to: 'sessions#delete'

  root 'games#index'
  get "/town", to: "games#town"
  get "/level-select", to:"games#level-select"
end
