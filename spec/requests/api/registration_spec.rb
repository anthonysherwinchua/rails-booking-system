# frozen_string_literal: true

require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe 'User Registration', type: :request do
  context 'user tries to register' do
    it 'with valid details' do
      attributes = attributes_for(:user)
      post '/api/signup', params: { user: attributes }

      user = JSON.parse(response.body)['user']
      expect(user).to match_response_schema('user', strict: true)
      expect(JSON.parse(user)['name']).to eq(attributes[:name])
    end

    it 'with error' do
      user = create(:user)
      attributes = attributes_for(:user, email: user.email, name: '')
      post '/api/signup', params: { user: attributes }

      expect(response.body).to match_response_schema('user_invalid', strict: true)

      body = JSON.parse(response.body)
      expect(body['email']).to include('has already been taken')
      expect(body['name']).to include('can\'t be blank')
    end
  end
end
