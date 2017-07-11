class GamesController < ApplicationController
  def index
    # added dev branch
    data = Question.all
    questions_hash = {}

    data.each do |question|
      questions_hash[question.title] = question.answer
    end

    temp = questions_hash.to_a.sample
    @question = temp[0]
    gon.answer = temp[1]

    gon.scene = "temple"
    @scene = "temple"

    if request.xhr?
      render json: { question: @question, answer: gon.answer }.to_json
    end
  end
end
