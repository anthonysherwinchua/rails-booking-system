# frozen_string_literal: true

class AddTagsToRooms < ActiveRecord::Migration[7.0]
  def change
    add_column :rooms, :tags, :string
  end
end
