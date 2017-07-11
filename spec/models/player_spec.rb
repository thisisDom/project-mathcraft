require 'rails_helper'

RSpec.describe Player, type: :model do
  describe 'attributes' do
    let(:player) { Player.new }

    it 'has a username' do
      player.username = 'test'
      expect(player.username).to eq 'test'
    end

    it 'has a email address' do
      player.email_address = 'test@test.com'
      expect(player.email_address).to eq 'test@test.com'
    end

    it 'has a password' do
      player.password = 'test'
      expect(player.password).to eq 'test'
    end

    it 'has experience' do
      player.experience = 10
      expect(player.experience).to eq 10
    end

    it 'has an avatar asset link' do
      player.avatar_asset_link = '/path/to/asset/link.jpg'
      expect(player.avatar_asset_link).to eq '/path/to/asset/link.jpg'
    end
  end
  describe 'associations' do
    let(:player) { Player.new }

    context 'resources' do
      it 'is an array if present' do
        player.resources = [{"name" => 'wood', "quantity" => 20},{"name" => "stone", "quantity" => 10}]
        expect(player.resources).to all( be_a(Resource) )
      end

      it 'returns nil if empty' do
        player.resources = []
        expect(player.resources).to eq []
      end
    end

    context 'buildings' do
      it 'is an array if present' do
        player.buildings = [{"height" => '1', "position" => [2,2]},{"height" => '1', "position" => [1,1]}]
        expect(player.buildings).to all( be_a(Building) )
      end

      it 'returns nil if empty' do
        player.buildings = []
        expect(player.buildings).to eq []
      end
    end
  end
end
