# レシピ帳（レシピ管理アプリ）

自分のレシピを登録・一覧・詳細表示・編集・削除できる Web アプリ。

| 層 | 技術 |
| --- | --- |
| フロントエンド | Next.js 15（App Router）+ TypeScript — `frontend/` |
| バックエンド | Ruby 3.4 + Rails 8（API モード）— `backend/` |
| データベース | MySQL 8（開発: Docker / 本番: Amazon RDS） |
| デプロイ | Amazon EC2 + Amazon RDS for MySQL |

## ドキュメント

設計資料は [docs/](docs/) にある。まず [要件定義書](docs/00_要件定義書.md) を読み、そこから各資料に進む。

| ドキュメント | 内容 |
| --- | --- |
| [00_要件定義書](docs/00_要件定義書.md) | 目的・スコープ・スケジュール、各資料の要点とリンク |
| [01_機能一覧](docs/01_機能一覧.md) | 機能・優先度・実装状況・権限 |
| [02_画面仕様書](docs/02_画面仕様書.md) | 画面一覧・画面遷移・入力チェック |
| [03_データベース設計書](docs/03_データベース設計書.md) | ER 図・テーブル定義 |
| [04_非機能要件](docs/04_非機能要件.md) | 性能・セキュリティ・対応環境 |
| [05_技術スタック](docs/05_技術スタック.md) | 使用技術・システム構成・API 一覧 |

## 開発環境の起動

前提: Docker、rbenv（Ruby 3.4.12）、Node.js 20 以上

```sh
# 1. MySQL を起動
docker compose up -d

# 2. API サーバー（http://localhost:3001）
cd backend
bundle install
bin/rails db:create db:migrate
bin/rails s -p 3001

# 3. フロントエンド（http://localhost:3000）※別のターミナルで
cd frontend
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## テスト

```sh
cd backend && bin/rails test
cd frontend && npx tsc --noEmit && npm run lint
```

## API

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | /api/recipes | 一覧（新しい順） |
| GET | /api/recipes/:id | 詳細（材料・手順つき） |
| POST | /api/recipes | 登録 |
| PATCH | /api/recipes/:id | 更新（材料・手順は送った内容で入れ替え） |
| DELETE | /api/recipes/:id | 削除 |

## 本番環境で使う環境変数

| 変数 | 設定先 | 例 |
| --- | --- | --- |
| DB_HOST / DB_USERNAME / DB_PASSWORD / DB_NAME | backend | RDS のエンドポイントと接続情報 |
| FRONTEND_ORIGIN | backend | `http://<EC2のIP>:3000` |
| RAILS_MASTER_KEY | backend | `backend/config/master.key` の中身 |
| NEXT_PUBLIC_API_URL | frontend（ビルド時） | `http://<EC2のIP>:3001` |
