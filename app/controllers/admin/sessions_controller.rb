class Admin::SessionsController < Devise::SessionsController
  layout 'admin'

  private

  def after_sign_in_path_for(_resource_or_scope)
    admin_dashboard_index_path
  end

  def after_sign_out_path_for(_resource_or_scope)
    admin_users_sign_in_path
  end
end
