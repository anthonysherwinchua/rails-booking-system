# frozen_string_literal: true

class Api::V1::BookingsController < ::Api::ApplicationController
  before_action :authenticate_user!

  def index
    @bookings = current_user.bookings
    render json: @bookings
  end

  def show
    @booking = current_user.bookings.find(params[:id])
    render json: @booking
  end

  def create
    @booking = current_user.bookings.new(booking_params)
    if @booking.save
      render json: @booking, status: :created
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def update
    @booking = current_user.bookings.find(params[:id])
    if @booking.update(booking_params)
      render json: @booking
    else
      render json: @booking.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @booking = current_user.bookings.find(params[:id])
    @booking.destroy
  end

  private

  def booking_params
    params.require(:booking).permit(:room_id, :start_time, :end_time)
  end
end
