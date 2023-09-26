# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:name) { |i| "Jean Dupont #{i}" }
    sequence(:email) { |i| "jean_dupont_#{i}@example.com" }
    password { 'verySecurePassw0rd' }
  end
end
