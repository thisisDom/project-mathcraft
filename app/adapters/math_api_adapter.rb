module MathAPIAdapter
  include HTTParty
  base_uri ENV['MATH_API_URI']
  headers 'Accept' => 'JSON'
  headers 'Authorization' => "Basic #{session[:api_token]}" if authorized?


  def self.index(route, data)
    self.get(route, query: { data: data.as_json(root: true) })
  end

  def self.create(route, data)
    self.post(route, query: { data: data.as_json(root: true) })
  end

  def self.save(route, data)
    self.post(route, query: { data: data.as_json(root: true) })
  end

  def self.show(route)
    self.get(route)
  end

  def self.update(route, data)
    self.post(route, query: { data: data.as_json(root: true) })
  end

  def self.destroy(route, data)
    self.post(route, query: { data: data.as_json(root: true) })
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
