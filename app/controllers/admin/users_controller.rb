# frozen_string_literal: true

class Admin::UsersController < Admin::ApplicationController
  before_action :set_user, only: [:edit, :update]

  def index
    @users = User.order(created_at: :desc)
  end

  def edit; end

  def update
    if @user.update(user_params)
      redirect_to admin_users_path, notice: 'User was successfully updated.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:admin)
  end
end
