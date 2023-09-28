# frozen_string_literal: true

class Api::ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def record_not_found
    render json: { message: 'Couldn\'t find record' }, status: :not_found
  end

  private

  def authenticate_user!
    current_user = User.find(jwt_payload['sub']) if request.headers['Authorization'].present?

    render json: { message: 'Couldn\'t find an active session.' }, status: :unauthorized unless current_user
  rescue StandardError => _e
    render json: { message: 'Couldn\'t find an active session.' }, status: :unauthorized
  end

  def jwt_payload
    JWT.decode(
      request.headers['Authorization'].split(' ').last,
      Rails.application.credentials.devise_jwt_secret_key!
    ).first
  end
end
