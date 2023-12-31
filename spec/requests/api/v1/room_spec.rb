# frozen_string_literal: true

require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe 'API::Rooms', type: :request do
  describe 'GET /api/v1/rooms' do
    context 'when a user is not logged in' do
      it 'returns unauthorized' do
        get '/api/v1/rooms'
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when a user is logged in' do
      let!(:user) { create(:user) }
      let!(:room1) { create(:room, capacity: 10, tags: %w[meeting large]) }
      let!(:room2) { create(:room, capacity: 5, tags: ['conference']) }

      it 'returns a list of rooms' do
        headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
        auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, user)

        get '/api/v1/rooms', headers: auth_headers
        expect(response).to have_http_status(:ok)
        expect(response).to match_response_schema('rooms')
      end

      it 'filters rooms by capacity' do
        headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
        auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, user)

        get '/api/v1/rooms', params: { capacity: 10 }, headers: auth_headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).count).to eq(1)
      end

      it 'filters rooms by tags' do
        headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
        auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, user)

        get '/api/v1/rooms', params: { tags: 'meeting' }, headers: auth_headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).count).to eq(1)
      end

      it 'filters rooms by capacity and tags' do
        headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
        auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, user)

        get '/api/v1/rooms', params: { capacity: 10, tags: 'meeting' }, headers: auth_headers
        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)

        expect(json_response.count).to eq(1)
        expect(json_response.first['capacity']).to eq(10)
        expect(json_response.first['tags']).to include('meeting')
      end

      it 'filters rooms by booking timing' do
        headers = { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
        auth_headers = Devise::JWT::TestHelpers.auth_headers(headers, user)

        start_time = Time.zone.now - 2.5.hours
        end_time = Time.zone.now - 1.5.hours

        past_booking = create(:booking, room: room1)
        # rubocop:disable Rails/SkipsModelValidations
        past_booking.update_columns(start_time: start_time, end_time: end_time)
        # rubocop:enable Rails/SkipsModelValidations

        get '/api/v1/rooms', params: { start_time: start_time - 5.minutes, end_time: end_time - 5.minutes },
                             headers: auth_headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).count).to eq(1)
        expect(JSON.parse(response.body).first['id']).to eq(room2.id)
      end
    end
  end
end
