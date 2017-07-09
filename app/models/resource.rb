class Resource
  attr_accessor :id, :name, :quantity, :asset_link

  def initialize(arg = {})
    @id = arg.fetch("id", nil)
    @name = arg.fetch("name", nil)
    @quantity = arg.fetch("quantity", nil)
    @asset_link = arg.fetch("asset_link", nil)
    @resource_id = arg.fetch("resource_id", nil)
  end

end
