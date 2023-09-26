require "rails_helper"
require 'devise/jwt/test_helpers'

RSpec.describe "User Session", type: :request do
  context 'user tries to register' do
    it "with valid details" do
      attributes = attributes_for(:user)
      post "/api/signup", :params => { :user => attributes }

      expect(response.body).to match_response_schema('user', strict: true)
      expect(JSON.parse(response.body)['name']).to eq(attributes[:name])
    end

    it "with error" do
      user = create(:user)
      attributes = attributes_for(:user, email: user.email, name: '')
      post "/api/signup", :params => { :user => attributes }

      expect(response.body).to match_response_schema('user_invalid', strict: true)

      body = JSON.parse(response.body)
      expect(body['email']).to include('has already been taken')
      expect(body['name']).to include('can\'t be blank')
    end
  end

  context 'user tries to login' do
    it "with valid credentials" do
      user = create(:user)
      post "/api/login", :params => { :user => { email: user.email, password: user.password } }

      expect(response.body).to match_response_schema('user', strict: true)
      expect(JSON.parse(response.body)['name']).to eq(user.name)
    end

    it "with invalid credentials" do
      post "/api/login", :params => { :user => { email: 'dummy@email.com', password: 'dummyPassword' } }

      expect(response.body).to match_response_schema('error', strict: true)
      expect(JSON.parse(response.body)['message']).to eq('Invalid username/password.')
    end
  end

  context 'user tries to logout' do
    it "with valid JTI" do
      user = create(:user)
      headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
      auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, user)

      delete "/api/logout", :headers => auth_headers

      expect(JSON.parse(response.body)['message']).to eq('Logged out successfully')
    end

    it "with invalid JTI" do
      user = create(:user)
      headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json', 'Authorization' => "Some InvalidToken" }

      delete "/api/logout", :headers => headers

      expect(response.body).to match_response_schema('error', strict: true)
      expect(JSON.parse(response.body)['message']).to eq('Couldn\'t find an active session.')
    end

    it "without JTI" do
      user = create(:user)
      headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }

      delete "/api/logout", :headers => headers

      expect(response.body).to match_response_schema('error', strict: true)
      expect(JSON.parse(response.body)['message']).to eq('Couldn\'t find an active session.')
    end
  end
end