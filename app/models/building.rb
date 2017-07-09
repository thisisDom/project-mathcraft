class Building
  attr_accessor :height, :asset_link, :building_class, :building_level, :location

  def initialize(args = {})
    @width = args.fetch("width", nil)
    @height = args.fetch("height", nil)
    @asset_link = args.fetch("asset_link", nil)
    @building_class = args.fetch("building_class", nil)
    @building_level = args.fetch("building_level", nil)
    @location = args.fetch("location", nil)
    @building_id = args.fetch("building_id", nil)
  end
end
