# シャープドライしながわ サイトリニューアル

群馬県太田市のクリーニング店「シャープドライしながわ」のコーポレートサイト。
静的HTML / CSS / 素のJavaScript で構成し、フレームワーク・ビルドツールは使用していない。

## ディレクトリ構成

```
/
├─ index.html          TOP
├─ service/            サービス・料金（#price に料金表）
├─ special/            染み抜き・特殊クリーニング
├─ business/           法人・団体のお客様
├─ about/              当店について
├─ news/               お知らせ
├─ 404.html
├─ css/style.css       カスタムプロパティ + BEM、SP優先設計
├─ js/main.js          ヘッダー縮小 / ドロワー / 追従CTA / 地図遅延読込 / 計測
├─ images/             サイトで使用する画像（PNG・JPG）
├─ .htaccess           301リダイレクト、404設定
├─ robots.txt / sitemap.xml
├─ 実装仕様書.md
└─ sharp-dry-shinagawa_renewal-plan.md   企画書
```

## プレビュー

https://shina937.github.io/sharp-dry-shinagawa/

クライアント確認用のプレビュー。現行サイト https://sharp-dry-shinagawa.com/ が稼働中のため、
重複コンテンツによる評価低下を避ける目的で**全ページに `noindex` を設定**し、
`robots.txt` でクロールを拒否している。本番公開時はこの2点を外す（該当箇所に TODO コメントあり）。

## ローカルでの確認

相対パス（`css/...` / `../css/...`）で参照しているため `file://` でも概ね表示できるが、
実際の配信に合わせて HTTP サーバーで確認する。

```bash
python3 -m http.server 8000
# http://localhost:8000/
```

`.htaccess` の301リダイレクトと404表示は Apache 上でのみ動作するため、この簡易サーバーと
GitHub Pages では確認できない。

### パスの扱い

GitHub Pages はリポジトリ名のサブディレクトリ（`/sharp-dry-shinagawa/`）配下に配信されるため、
ルート相対パス（`/css/style.css`）は解決できない。そのため全ページを相対パスで記述している。
相対パスはルート配信でもそのまま動くので、本番移行時の修正は不要。

例外は `404.html` で、任意の階層で呼び出される都合上、相対パスが解決できない。
GitHub Pages のサブパスを絶対指定している。

```html
<link rel="stylesheet" href="/sharp-dry-shinagawa/css/style.css">
```

**本番サーバーへ移行する際は、この `404.html` 内の `/sharp-dry-shinagawa` を削除する。**

## 画像の差し替え

`images/` 内のファイルを同名で置き換えるだけで反映される。WebP版は生成していない。

パフォーマンスを優先する場合は公開前に WebP を生成し、`<picture>` と CSS の `image-set()` で
配信する構成に戻す（実装仕様書 10章）。変換は以下で一括実行できる。

```bash
for f in images/*.png; do cwebp -q 80 "$f" -o "${f%.png}.webp"; done
```

## 公開前に対応が必要な項目

ソース内に `<!-- TODO:` コメントとして残してある。主なもの。

- **GA4測定ID** — 全ページの `<head>` が `G-XXXXXXXXXX` のままになっている
- **掲載許諾** — 実績の団体名・写真は許諾未確認のため、団体名を出さない表現で実装している
- **実写素材待ち** — 作業風景、染み抜きビフォーアフター
- **原稿確定待ち** — 洗い方4種の説明文、布団・カーペットの本文、店主コメント、創業年
- **料金の確認** — 端数処理、仕上がり日数、朝割の適用可否ほか

全件は以下で一覧できる。

```bash
grep -rn "TODO:" --include="*.html" --include="*.css" .
```

## 表記ルール

- 店名（和文）は「シャープドライしながわ」。「シナガワ」表記は使用しない
- 英字は `Sharp Dry Shinagawa`。旧サイトの "Shape" は誤記
- 電話番号は必ずテキストで記述し `tel:` でリンクする（画像化しない）
- 料金はすべて税込表示
- お問い合わせフォームは設置しない（電話・LINEに集約）
