# frozen_string_literal: true

class Room < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :capacity, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
