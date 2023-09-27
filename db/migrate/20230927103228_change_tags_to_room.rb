# frozen_string_literal: true

class ChangeTagsToRoom < ActiveRecord::Migration[7.0]
  def up
    remove_column :rooms, :tags
    add_column :rooms, :tags, :string, array: true, default: []
  end

  def down
    remove_column :rooms, :tags
    add_column :rooms, :tags, :string, array: false, default: nil
  end
end
