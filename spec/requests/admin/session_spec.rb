require "rails_helper"
require 'devise/jwt/test_helpers'

RSpec.describe "Admin Session", type: :request do
  context 'admin tries to login' do
    it "with valid credentials" do
      user = create(:user)
      post "/admin/users/sign_in", :params => { :user => { email: user.email, password: user.password } }

      expect(response).to redirect_to(admin_dashboard_index_path)
    end

    it "with invalid credentials" do
      post "/admin/users/sign_in", :params => { :user => { email: 'dummy@email.com', password: 'dummyPassword' } }

      expect(response.body).to include("Invalid Email or password.")
    end
  end

  context 'admin tries to logout' do
    it "with valid JTI" do
      delete "/admin/users/sign_out"

      expect(response).to redirect_to(admin_users_sign_in_path)
    end
  end
end