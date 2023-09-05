# frozen_string_literal: true

class Api::Users::RegistrationsController < Devise::RegistrationsController
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
