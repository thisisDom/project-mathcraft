Rails.application.routes.draw do
  root 'games#index'

  get '/login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  get 'logout', to: 'sessions#delete'

  get '/town', to: "games#town"
  get '/level-select', to:"games#level-select"

  get '/boss_battle', to: 'games#boss_battle'
  get '/forest', to: 'games#timed_battle_forest'
  get '/cave', to: 'games#timed_battle_cave'
end
