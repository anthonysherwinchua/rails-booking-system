# frozen_string_literal: true

class Api::V1::RoomsController < ::Api::ApplicationController
  before_action :authenticate_user!

  def index
    @rooms = Room.all
    room_filter = FilteredRooms.new(@rooms, params)
    @rooms = room_filter.filter_rooms

    render json: @rooms, each_serializer: RoomSerializer
  end
end
