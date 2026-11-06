class ApplicationController < ActionController::API
  # 存在しない ID を指定されたら 404 を JSON で返す
  rescue_from ActiveRecord::RecordNotFound do
    render json: { errors: [ "見つかりませんでした" ] }, status: :not_found
  end
end
