require "rails_helper"
require 'devise/jwt/test_helpers'

RSpec.describe "Manage Users", type: :request do
  context 'user is admin' do
    let(:user) { create(:user, :is_admin) }
    let!(:other_user) { create(:user) }

    before do
      sign_in user
    end

    it "allowed to list all users" do
      get "/admin/users"

      expect(response.body).to include(other_user.email)
    end

    it "allowed to edit user" do
      get "/admin/users/#{other_user.id}/edit"

      expect(response.body).to include("Edit User: #{other_user.name}")
    end

    it "allowed to update user" do
      expect(other_user.admin?).to eq(false)

      put "/admin/users/#{other_user.id}", params: { user: { admin: true } }

      expect(response).to redirect_to(admin_users_path)
      expect(other_user.reload.admin?).to eq(true)
    end
  end

  context 'user is admin' do
    let(:user) { create(:user) }
    let!(:other_user) { create(:user) }

    before do
      sign_in user
    end

    it "allowed to list all users" do
      get "/admin/users"

      expect(response.body).to include('Access Forbidden')
    end

    it "allowed to edit user" do
      get "/admin/users/#{other_user.id}/edit"

      expect(response.body).to include('Access Forbidden')
    end

    it "allowed to update user" do
      expect(other_user.admin?).to eq(false)

      put "/admin/users/#{other_user.id}", params: { user: { admin: true } }

      expect(response.body).to include('Access Forbidden')
      expect(other_user.reload.admin?).to eq(false)
    end
  end
end