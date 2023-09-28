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
  end
end
