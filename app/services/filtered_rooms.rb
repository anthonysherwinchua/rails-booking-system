# frozen_string_literal: true

class FilteredRooms
  def initialize(rooms, params)
    @rooms = rooms
    @params = params
  end

  def filter_rooms
    apply_capacity_filter
    apply_tags_filter
    apply_booking_timing_filter if booking_timing_params_present?
    @rooms
  end

  private

  def apply_capacity_filter
    return unless @params[:capacity]

    @rooms = @rooms.where('capacity >= ?', @params[:capacity])
  end

  def apply_tags_filter
    return if tags.blank?

    @rooms = @rooms.where('tags && ARRAY[?]::varchar[]', tags)
  end

  def apply_booking_timing_filter
    start_time = Time.zone.parse(@params[:start_time])
    end_time = Time.zone.parse(@params[:end_time])

    overlapping_room_ids = rooms_with_overlapping_bookings(start_time, end_time)
    @rooms = @rooms.where.not(id: overlapping_room_ids)
  end

  def tags
    @tags ||= Array(@params[:tags]).compact
  end

  def booking_timing_params_present?
    @params[:start_time] && @params[:end_time]
  end

  def rooms_with_overlapping_bookings(start_time, end_time)
    Booking.where('start_time < ? AND end_time > ? OR start_time >= ? AND end_time <= ?',
               end_time, start_time, end_time, start_time).pluck(:room_id)
  end
end
