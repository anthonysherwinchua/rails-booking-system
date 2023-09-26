# frozen_string_literal: true

require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe 'Manage Users', type: :request do
  let(:admin_user) { create(:user, :is_admin) }
  let!(:other_user) { create(:user) }

  before do
    sign_in admin_user
  end

  describe 'GET /admin/users' do
    it 'renders a successful response' do
      get admin_users_path
      expect(response).to be_successful
    end
  end

  describe 'GET /admin/users/:id/edit' do
    it 'renders a successful response' do
      get edit_admin_user_path(other_user)
      expect(response).to be_successful
    end
  end

  describe 'PATCH /admin/users/:id' do
    it 'updates the requested user' do
      expect {
        patch admin_user_path(other_user), params: { user: { admin: true } }
      }.to change { other_user.reload.admin }.from(false).to(true)
    end

    it 'redirects to the user' do
      patch admin_user_path(other_user), params: { user: { admin: true } }
      expect(response).to redirect_to(admin_users_path)
    end
  end

  context 'GET #index' do
    it_behaves_like "forbidden access", '/admin/users', :get
  end

  context 'GET #edit' do
    it_behaves_like "forbidden access", "/admin/users/1/edit", :get
  end

  context 'GET #edit' do
    it_behaves_like "forbidden access", "/admin/users/1", :put
  end
end
