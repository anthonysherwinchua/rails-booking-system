# frozen_string_literal: true

class Api::Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    if current_user.persisted?
      render json: current_user, status: :ok
    else
      render json: { message: 'Invalid username/password.' }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    current_user = User.find(jwt_payload['sub']) if request.headers['Authorization'].present?

    if current_user
      render json: { message: 'Logged out successfully' }, status: :no_content
    else
      render json: { message: 'Couldn\'t find an active session.' }, status: :unauthorized
    end
  end

  def jwt_payload
    JWT.decode(
      request.headers['Authorization'].split(' ').last,
      Rails.application.credentials.devise_jwt_secret_key!
    ).first
  end
end
