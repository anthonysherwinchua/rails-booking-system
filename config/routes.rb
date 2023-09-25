# frozen_string_literal: true

Rails.application.routes.draw do
  scope :api, module: :api do
    devise_for :users,
               path: '',
               path_names: {
                 sign_in: 'login',
                 sign_out: 'logout',
                 registration: 'signup'
               },
               controllers: {
                 sessions: 'api/users/sessions',
                 registrations: 'api/users/registrations'
               }
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  root 'homepage#index'
  get '/*path' => 'homepage#index'
end
