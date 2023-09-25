# frozen_string_literal: true

class Api::Users::RegistrationsController < Devise::RegistrationsController
  protect_from_forgery with: :null_session

  respond_to :json

  private

  def respond_with(current_user, _opts = {})
    if resource.persisted?
      render json: current_user, status: :ok
    else
      render json: current_user.errors, status: :unprocessable_entity
    end
  end
end
