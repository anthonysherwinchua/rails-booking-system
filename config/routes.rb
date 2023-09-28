# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :admin do
    devise_scope :user do
      get 'users/sign_in', to: 'sessions#new'
      post 'users/sign_in', to: 'sessions#create'
      delete 'users/sign_out', to: 'sessions#destroy'
    end

    resources :dashboard, only: [:index]
    resources :rooms
    resources :users, only: %i[index edit update]

    get :forbidden
  end

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
    namespace :v1 do
      resources :bookings
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  root 'homepage#index'
  get '/*path' => 'homepage#index'
end
