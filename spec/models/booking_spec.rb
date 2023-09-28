# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Booking, type: :model do
  let(:user) { create(:user) }
  let(:room) { create(:room) }

  it { should belong_to(:user) }
  it { should belong_to(:room) }

  it { should validate_presence_of(:start_time) }
  it { should validate_presence_of(:end_time) }

  describe 'custom validations' do
    it 'ensures end_time is in 15-minute increments' do
      booking = build(:booking, user: user, room: room, start_time: Time.zone.now,
                                end_time: Time.zone.now + 1.hour + 10.minutes)
      expect(booking).not_to be_valid
    end

    it 'ensures no overlapping booking' do
      _existing_booking = create(:booking, user: user, room: room, start_time: Time.zone.now,
                                           end_time: Time.zone.now + 1.hour)
      overlapping_booking = build(:booking, user: user, room: room, start_time: Time.zone.now + 30.minutes,
                                            end_time: Time.zone.now + 1.hour + 30.minutes)
      expect(overlapping_booking).not_to be_valid
    end

    it 'ensures start_time cannot be in the past' do
      booking = build(:booking, user: user, room: room, start_time: Time.zone.now - 1.hour,
                                end_time: Time.zone.now + 1.hour)
      expect(booking).not_to be_valid
    end

    it 'ensures past bookings cannot be updated' do
      past_booking = create(:booking, user: user, room: room)
      past_booking.update_columns(start_time: Time.zone.now - 2.5.hours, end_time: Time.zone.now - 1.5.hours)
      past_booking.reload

      t = Time.zone.now
      past_booking.start_time = t + 30.minutes
      past_booking.end_time = t + 1.hour

      expect(past_booking).not_to be_valid
      expect(past_booking.errors.full_messages).to include('Past bookings cannot be updated')
    end
  end
end
