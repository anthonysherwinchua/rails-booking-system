# frozen_string_literal: true

class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :room

  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :validate_booking_time, :prevent_update_for_past_bookings, :validate_time_increment,
           :validate_no_overlapping_booking

  scope :future_dated, -> { where('start_time > ?', Time.zone.now) }
  scope :past, -> { where('end_time < ?', Time.zone.now) }

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

  def validate_booking_time
    return unless start_time

    return unless start_time < 1.minute.ago

    errors.add(:start_time, 'cannot be in the past')
  end

  def prevent_update_for_past_bookings
    return unless persisted?

    return unless (start_time_changed? || end_time_changed?) && start_time_was < Time.zone.now

    errors.add(:base, 'Past bookings cannot be updated')
  end
end
