# frozen_string_literal: true

require 'rails_helper'

RSpec.describe FilteredRooms do
  let!(:room1) { create(:room, capacity: 10, tags: %w[meeting large]) }
  let!(:room2) { create(:room, capacity: 5, tags: ['conference']) }
  let!(:user) { create(:user) }

  describe '#filter_rooms' do
    it 'filters rooms by capacity' do
      params = { capacity: 10 }
      filtered_rooms = FilteredRooms.new(Room.all, params).filter_rooms
      expect(filtered_rooms.count).to eq(1)
    end

    it 'filters rooms by tags' do
      params = { tags: 'meeting' }
      filtered_rooms = FilteredRooms.new(Room.all, params).filter_rooms
      expect(filtered_rooms.count).to eq(1)
    end

    it 'filters rooms by capacity and tags' do
      params = { capacity: 10, tags: 'meeting' }
      filtered_rooms = FilteredRooms.new(Room.all, params).filter_rooms
      expect(filtered_rooms.count).to eq(1)
      expect(filtered_rooms.first.capacity).to eq(10)
      expect(filtered_rooms.first.tags).to include('meeting')
    end

    it 'filters rooms by booking timing' do
      start_time = Time.zone.now - 2.5.hours
      end_time = Time.zone.now - 1.5.hours

      params = { start_time: (start_time + 5.minutes).to_s, end_time: (end_time + 5.minutes).to_s }

      past_booking = create(:booking, room: room1)
      # rubocop:disable Rails/SkipsModelValidations
      past_booking.update_columns(start_time: start_time, end_time: end_time)
      # rubocop:enable Rails/SkipsModelValidations

      filtered_rooms = FilteredRooms.new(Room.all, params).filter_rooms
      expect(filtered_rooms.count).to eq(1)
      expect(filtered_rooms.first.id).to eq(room2.id)
    end
  end
end
