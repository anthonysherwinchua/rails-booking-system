# frozen_string_literal: true

RSpec.shared_examples 'forbidden access' do |resource_path, http_method, params: {}|
  context 'user is not an admin' do
    let(:non_admin_user) { create(:user) }

    before { sign_in non_admin_user }

    it 'forbids access for non-admin users' do
      send(http_method, resource_path, params: params)
      expect(response.body).to include('Access Forbidden')
    end
  end
end
