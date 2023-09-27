# frozen_string_literal: true

require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe 'User Session', type: :request do
  context 'user tries to login' do
    it 'with valid credentials' do
      user = create(:user)
      post '/api/login', params: { user: { email: user.email, password: user.password } }

      user_data = JSON.parse(response.body)['user']
      expect(user_data).to match_response_schema('user', strict: true)
      expect(JSON.parse(user_data)['name']).to eq(user.name)
    end

    it 'with invalid credentials' do
      post '/api/login', params: { user: { email: 'dummy@email.com', password: 'dummyPassword' } }

      expect(response.body).to match_response_schema('error', strict: true)
      expect(JSON.parse(response.body)['message']).to eq('Invalid username/password.')
    end
  end

  context 'user tries to logout' do
    it 'with valid JTI' do
      user = create(:user)
      headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
      auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, user)

      delete '/api/logout', headers: auth_headers

      expect(JSON.parse(response.body)['message']).to eq('Logged out successfully')
    end

    it 'with invalid JTI' do
      create(:user)
      headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json',
                  'Authorization' => 'Some InvalidToken' }

      delete '/api/logout', headers: headers

      expect(response.body).to match_response_schema('error', strict: true)
      expect(JSON.parse(response.body)['message']).to eq('Couldn\'t find an active session.')
    end

    it 'without JTI' do
      create(:user)
      headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }

      delete '/api/logout', headers: headers

      expect(response.body).to match_response_schema('error', strict: true)
      expect(JSON.parse(response.body)['message']).to eq('Couldn\'t find an active session.')
    end
  end
end
