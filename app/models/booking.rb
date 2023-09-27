# frozen_string_literal: true

class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :room

  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :validate_time_increment, :validate_no_overlapping_booking

  private

  def validate_time_increment
    return unless start_time && end_time

    duration = (end_time - start_time).to_i
    return if (duration % 900).zero?

    errors.add(:end_time, 'must be in 15-minute increments')
  end

  def validate_no_overlapping_booking
    return unless start_time && end_time

    overlapping_bookings = Booking.where(room_id: room_id)
                                  .where.not(id: id)
                                  .where('start_time < ? AND end_time > ?', end_time, start_time)
    errors.add(:base, 'Booking overlaps with existing booking') if overlapping_bookings.exists?
  end
end
