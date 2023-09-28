# frozen_string_literal: true

class BookingSerializer < ActiveModel::Serializer
  attributes :id

  attribute :start_time do
    object.start_time.strftime('%a %b %e %Y %I:%M %p')
  end

  attribute :end_time do
    object.end_time.strftime('%a %b %e %Y %I:%M %p')
  end

  has_one :user
  has_one :room
end
