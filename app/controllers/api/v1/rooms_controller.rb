# frozen_string_literal: true

class Api::V1::RoomsController < ::Api::ApplicationController
  before_action :authenticate_user!

  def index
    @rooms = Room.all
    @rooms = @rooms.where('capacity >= ?', params[:capacity]) if params[:capacity]
    @rooms = @rooms.where('tags && ARRAY[?]::varchar[]', tags) if tags.present?

    render json: @rooms, each_serializer: RoomSerializer
  end

  private

  def tags
    @tags ||= (params[:tags].is_a?(Array) ? params[:tags] : [params[:tags]]).compact
  end
end
