module MathAPIAdapter
  include HTTParty
  base_uri ENV['MATH_API_URI']
  headers 'Accept' => 'JSON'
  headers 'Authorization' => "Basic #{session[:api_token]}" if authorized?


  def self.index(route, data)
    response = self.post(route, query: { data: data.to_json })
  end

  def self.create(route, data)
    response = self.post(route, query: { data: data.to_json })
  end

  def self.save(route, data)
    response = self.post(route, query: { data: data.to_json })
  end

  def self.update(route, data)
    response = self.post(route, query: { data: data.to_json })
  end

  def self.destroy(route, data)
    response = self.post(route, query: { data: data.to_json })
  end

  private

  def authorized?
    response = authorize_app
    response['error'] ? false : true
  end

  def authorize_app
    response = self.post('/authenticate', query: { email_address: ENV['API_EMAIL'], password: ENV['API_PASSWORD']})
    if response['auth_token']
      session[:api_token] = response['auth_token']
      return true
    end
    response
  end

end
