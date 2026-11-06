Rails.application.routes.draw do
  namespace :api do
    resources :recipes, only: %i[index show create update destroy]
  end

  # ロードバランサーなどの死活監視用（200 が返れば正常）
  get "up" => "rails/health#show", as: :rails_health_check
end
