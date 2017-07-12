class GamesController < ApplicationController
  include GamesHelper

  def index
  end

  def level_select
    @levels = HTTParty.get("http://mathcraft-api.herokuapp.com/levels")
    p "*" * 80
    p @levels
  end

  def boss_battle
    # added dev branch
    data = Question.all
    questions_hash = {}

    data.each do |question|
      questions_hash[question.title] = question.answer
    end

    temp = questions_hash.to_a.sample
    @question = temp[0]
    gon.answer = temp[1]

    if request.xhr?
      render json: { question: @question, answer: gon.answer }.to_json
    end
  end

  def timed_battle_forest
    @questions = get_questions("addition", "easy")
    p @questions
    # added dev branch
    data = Question.all
    questions_hash = {}

    data.each do |question|
      questions_hash[question.title] = question.answer
    end

    temp = questions_hash.to_a.sample
    @question = temp[0]
    gon.answer = temp[1]

    if request.xhr?
      render json: { question: @question, answer: gon.answer }.to_json
    end
  end

  def timed_battle_cave
    # added dev branch
    data = Question.all
    questions_hash = {}

    data.each do |question|
      questions_hash[question.title] = question.answer
    end

    temp = questions_hash.to_a.sample
    @question = temp[0]
    gon.answer = temp[1]

    if request.xhr?
      render json: { question: @question, answer: gon.answer }.to_json
    end
  end
end
