# frozen_string_literal: true

require 'rails_helper'
require 'devise/jwt/test_helpers'

RSpec.describe 'Api::V1::Bookings', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let!(:bookings) { create_list(:booking, 5, user: user) }
  let(:booking) { bookings.first }
  let(:headers) { { 'Accept' => 'application/json' } }
  let(:auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, user) }
  let(:other_auth_headers) { Devise::JWT::TestHelpers.auth_headers(headers, other_user) }

  describe 'GET #index' do
    it 'returns a list of bookings for the authenticated user' do
      get '/api/v1/bookings', headers: auth_headers
      expect(response).to have_http_status(:ok)
      expect(json_response.length).to eq(5)
    end
  end

  describe 'GET #show' do
    it 'returns a specific booking for the authenticated user' do
      get "/api/v1/bookings/#{booking.id}", headers: auth_headers
      expect(response).to have_http_status(:ok)
      expect(json_response['id']).to eq(booking.id)
    end

    it 'returns not found for a booking belonging to another user' do
      get "/api/v1/bookings/#{booking.id}", headers: other_auth_headers
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST #create' do
    let(:room) { create(:room) }
    let(:valid_attributes) { attributes_for(:booking).merge({ room_id: room.id }) }
    let(:invalid_attributes) { attributes_for(:booking, start_time: nil, end_time: nil) }

    context 'with valid attributes' do
      before do
        create(:booking, start_time: 2.hours.from_now, end_time: 3.hours.from_now, user: other_user, room: room)
      end

      it 'creates a new booking' do
        expect do
          post '/api/v1/bookings', params: { booking: valid_attributes }, headers: auth_headers
        end.to change(user.bookings, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid attributes' do
      it 'returns unprocessable_entity status' do
        post '/api/v1/bookings', params: { booking: invalid_attributes }, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'with conflicting booking' do
      before do
        create(:booking, start_time: 30.minutes.from_now, end_time: 90.minutes.from_now, user: other_user, room: room)
      end

      it 'creates a new booking' do
        post '/api/v1/bookings', params: { booking: valid_attributes }, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH #update' do
    context 'with valid attributes' do
      let(:new_attributes) { { start_time: Time.zone.now + 1.hour } }

      it 'updates the booking' do
        patch "/api/v1/bookings/#{booking.id}", params: { booking: new_attributes }, headers: auth_headers
        booking.reload
        expect(booking.start_time).to be_within(1.second).of(new_attributes[:start_time])
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid attributes' do
      let(:new_attributes) { { start_time: '' } }

      it 'updates the booking' do
        patch "/api/v1/bookings/#{booking.id}", params: { booking: new_attributes }, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'with conflicting booking' do
      let(:new_attributes) do
        { start_time: (12.hours + 30.minutes).from_now, end_time: (13.hours + 30.minutes).from_now }
      end

      before do
        create(:booking, start_time: 12.hours.from_now, end_time: 13.hours.from_now, user: other_user,
                         room: booking.room)
      end

      it 'updates the booking' do
        patch "/api/v1/bookings/#{booking.id}", params: { booking: new_attributes }, headers: auth_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE #destroy' do
    it 'destroys the booking' do
      expect do
        delete "/api/v1/bookings/#{booking.id}", headers: auth_headers
      end.to change(user.bookings, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end

  def json_response
    JSON.parse(response.body)
  end
end
