# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:name) { |i| "Jean Dupont #{i}" }
  end
end
