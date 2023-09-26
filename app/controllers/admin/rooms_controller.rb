# frozen_string_literal: true

class Admin::RoomsController < Admin::ApplicationController
  before_action :set_room, only: %i[show edit update destroy]
  before_action :split_tags_param, only: %i[create update]

  def index
    @rooms = Room.order(name: :asc)
  end

  def show; end

  def new
    @room = Room.new
  end

  def create
    @room = Room.new(room_params)

    if @room.save
      redirect_to admin_room_path(@room), notice: 'Room was successfully created.'
    else
      render :new
    end
  end

  def edit; end

  def update
    if @room.update(room_params)
      redirect_to admin_room_path(@room), notice: 'Room was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @room.destroy
    redirect_to admin_rooms_url, notice: 'Room was successfully deleted.'
  end

  private

  def set_room
    @room = Room.find(params[:id])
  end

  def split_tags_param
    return if params[:room][:tags].blank?

    tags = params[:room][:tags]
    params[:room][:tags] = tags.is_a?(String) ? tags.split(',').map(&:strip) : Array(tags)
  end

  def room_params
    params.require(:room).permit(:name, :capacity, tags: [])
  end
end
