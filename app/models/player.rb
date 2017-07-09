class Player
  attr_accessor :username, :email_address, :avatar_asset_link, :password, :experience, :login_status, :buildings
  attr_reader :resources

  def initialize(args = {})
    @id = args.fetch("id", nil)
    @username = args.fetch("username", nil)
    @email_address = args.fetch("email_address", nil)
    @password = args.fetch("password", nil)
    @avatar_asset_link = args.fetch("avatar_asset_link", nil)
    @experience = args.fetch("experience", 0)
    @level = args.fetch("experience_level", 0)
    @login_status = args.fetch("login_status", false)
    @buildings = args.fetch("buildings", [])
    @resources = args.fetch("resources", [])
  end

  def buildings=(new_buildings)
      @buildings = new_buildings.map { |players_building|
        Building.new(players_building)
      }
  end

  def resources=(new_resources)
    @resources = new_resources.map { |players_resource|
      Resource.new(players_resource)
    }
  end

end
