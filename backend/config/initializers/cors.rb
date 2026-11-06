# フロントエンド（Next.js）から API を呼べるようにする設定
# 本番では FRONTEND_ORIGIN に公開 URL（例: http://<EC2のIP>:3000）を入れる
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:3000")

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
