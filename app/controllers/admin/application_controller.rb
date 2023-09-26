# frozen_string_literal: true

class Admin::ApplicationController < ::ApplicationController
  layout 'admin'

  before_action :authenticate_user!
  before_action :authorize_admin!

  private

  def authorize_admin!
    render 'errors/forbidden', status: :forbidden unless current_user.admin?
  end
end
