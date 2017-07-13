Rails.application.routes.draw do
  root 'games#index'

  get '/login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  get 'logout', to: 'sessions#delete'

  get '/town', to: "games#town"
  get '/level-select', to:"games#level_select"

  get '/temple', to: 'games#boss_battle'
  get '/forest', to: 'games#timed_battle_forest'
  get '/cave', to: 'games#timed_battle_cave'

  get '/levels/:name', to: "games#show"

  post '/complete', to: "games#complete"

  get '/test', to: "games#start"
end
