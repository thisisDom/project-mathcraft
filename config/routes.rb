Rails.application.routes.draw do
  get '/login', to: 'sessions#new'
  post 'login', to: 'sessions#create'

  get 'logout', to: 'sessions#delete'

  get '/boss_battle', to: 'games#boss_battle'
  get '/town', to: "games#town"
  get '/level-select', to:"games#level-select"

  root 'games#index'
end
