# 画面モック

[画面仕様書](../docs/02_画面仕様書.md) の画面イメージを確認するための、HTML と CSS だけで作った静的モック。
本体（`frontend/`）とは別物で、API にはつながっていない。データはすべてダミー。

## 開き方

`index.html` をブラウザで開く（ダブルクリック、または `open mockup/index.html`）。ビルドやサーバーはいらない。
画面上部の黒い帯から、どの画面にも移動できる。

## 画面との対応

| ファイル | 画面 |
| --- | --- |
| [index.html](index.html) | S-01 レシピ一覧・検索 |
| [recipe.html](recipe.html) | S-02 レシピ詳細（「削除する」で確認ダイアログ） |
| [new.html](new.html) | S-03 レシピ登録 |
| [edit.html](edit.html) | S-04 レシピ編集 |
| [signup.html](signup.html) | S-05 ユーザー登録 |
| [login.html](login.html) | S-06 ログイン |
| [mypage.html](mypage.html) | S-07 マイページ（任意） |

## 見方の注意

- 未実装の機能（検索・カテゴリ・ページ送り・ログイン・画像・お気に入り・マイページ）も、完成したときの形で入れてある。
- 0件やエラーなど、表示が変わる場面は、各ページ下の点線の枠「状態例」にまとめてある。
- JavaScript は使っていない。行の追加・削除や検索は、ボタンの見た目だけ。
- 色やボタンは `frontend/src/app/globals.css` に合わせてある（`style.css` の前半はそのコピー）。
