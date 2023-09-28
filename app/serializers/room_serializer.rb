# frozen_string_literal: true

class RoomSerializer < ActiveModel::Serializer
  attributes :id, :name, :capacity, :tags
end
