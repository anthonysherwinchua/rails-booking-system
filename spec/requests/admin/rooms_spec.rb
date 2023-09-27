# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Admin::Rooms', type: :request do
  let(:admin_user) { create(:user, :is_admin) }

  let(:room_attributes) { attributes_for(:room) }

  before do
    sign_in(admin_user)
  end

  describe 'GET /admin/rooms' do
    it 'renders a successful response' do
      get admin_rooms_path
      expect(response).to be_successful
    end
  end

  describe 'GET /admin/rooms/new' do
    it 'renders a successful response' do
      get new_admin_room_path
      expect(response).to be_successful
    end
  end

  describe 'POST /admin/rooms' do
    context 'with valid parameters' do
      it 'creates a new room' do
        expect do
          post admin_rooms_path, params: { room: room_attributes }
        end.to change(Room, :count).by(1)
      end

      it 'redirects to the created room' do
        post admin_rooms_path, params: { room: room_attributes }
        expect(response).to redirect_to(admin_room_path(Room.last))
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new room' do
        expect do
          post admin_rooms_path, params: { room: { name: nil } }
        end.to_not change(Room, :count)
      end

      it 'renders a successful response (new template)' do
        post admin_rooms_path, params: { room: { name: nil } }
        expect(response).to be_successful
      end
    end
  end

  describe 'GET /admin/rooms/:id/edit' do
    let(:room) { create(:room) }

    it 'renders a successful response' do
      get edit_admin_room_path(room)
      expect(response).to be_successful
    end
  end

  describe 'PATCH /admin/rooms/:id' do
    let(:room) { create(:room) }

    context 'with valid parameters' do
      it 'updates the requested room' do
        patch admin_room_path(room), params: { room: { name: 'Updated Room Name' } }
        room.reload
        expect(room.name).to eq('Updated Room Name')
      end

      it 'redirects to the room' do
        patch admin_room_path(room), params: { room: { name: 'Updated Room Name' } }
        expect(response).to redirect_to(admin_room_path(room))
      end
    end

    context 'with invalid parameters' do
      it 'does not update the room' do
        original_name = room.name
        patch admin_room_path(room), params: { room: { name: nil } }
        room.reload
        expect(room.name).to eq(original_name)
      end

      it 'renders a successful response (edit template)' do
        patch admin_room_path(room), params: { room: { name: '' } }
        expect(response).not_to be_successful
      end
    end
  end

  describe 'DELETE /admin/rooms/:id' do
    let!(:room) { create(:room) }

    it 'destroys the requested room' do
      expect do
        delete admin_room_path(room)
      end.to change(Room, :count).by(-1)
    end

    it 'redirects to the rooms list' do
      delete admin_room_path(room)
      expect(response).to redirect_to(admin_rooms_path)
    end
  end

  context 'GET #index' do
    it_behaves_like 'forbidden access', '/admin/rooms', :get
  end

  context 'GET #show' do
    it_behaves_like 'forbidden access', '/admin/rooms/1', :get
  end

  context 'GET #new' do
    it_behaves_like 'forbidden access', '/admin/rooms/new', :get
  end

  context 'GET #edit' do
    it_behaves_like 'forbidden access', '/admin/rooms/1/edit', :get
  end

  context 'POST #create' do
    it_behaves_like 'forbidden access', '/admin/rooms', :post
  end

  context 'PUT #update' do
    it_behaves_like 'forbidden access', '/admin/rooms/1', :put
  end

  context 'DESTROY #destroy' do
    it_behaves_like 'forbidden access', '/admin/rooms/1', :delete
  end
end
