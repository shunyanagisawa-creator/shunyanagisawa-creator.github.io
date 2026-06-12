# CLAUDE.md — 柳沢 俊 パーソナルブランディングサイト 引き継ぎ文書

**最終更新：2026年4月16日**
**対象プロジェクト：shun-yanagisawa.com 個人ブランディングサイト + 書籍試し読みページ**

---

## 1. プロジェクト概要

### オーナー
- **氏名：** 柳沢 俊 / Shun Yanagisawa
- **役職：** Director, Head of Futures / OTC Clearing / FX Prime Brokerage — Citi Japan
- **LinkedIn：** https://www.linkedin.com/in/shun-yanagisawa-579b638/
- **Amazon（著書）：** https://amzn.asia/d/00Aawrf8

### サイトの目的
組織・会社に依存しない「柳沢 俊」個人ブランドの確立。  
金融市場インフラの専門家・著者・コンベナーとしての国際的デジタルプレゼンスを構築する。

---

## 2. インフラ構成

### ホスティング
| 項目 | 値 |
|---|---|
| ホスティング | Cloudflare Pages（Workers & Pages > shunyanagisawa） |
| GitHub リポジトリ | `shunyanagisawa-creator/shunyanagisawa-creator.github.io` |
| ブランチ | `main` |
| カスタムドメイン | `shun-yanagisawa.com` |
| DNS管理 | Cloudflare（shun-yanagisawa.com） |
| デプロイ | GitHubへのpushで自動デプロイ（GitHub → Cloudflare Pages連携済み） |

### ファイル構成（リポジトリルート）
```
/
├── index.html          # メインサイト（個人ブランディングページ）
├── book.html           # 書籍試し読みビューア（PDF.js使用）
├── book-cover.png      # 書籍表紙画像
├── book-preview.pdf    # 試し読みPDF（序章 + 第1章、105ページ）
└── essays/             # エッセイ（1本 = 1 HTML、self-contained、英日バイリンガル）
    └── learning-as-a-luxury-good.html  # Essay 001（2026年6月、HBS帰国）
```

**注意（2026-06-13）**: 本 CLAUDE.md の正本はこのリポジトリ（デプロイ側）。
`C:\pg\shunyanagisawa` は旧コピーで陳腐化している。
エッセイの掲載規律: Citi 兼職規定により Citi 業務関連は掲載不可、HBS 関連は可。

---

## 3. ファイル詳細

### index.html（メインサイト）
**サイズ：** 約78KB  
**言語切替：** 英日バイリンガル（`body.lang-en` / `body.lang-ja` クラスで制御）  
**フォント：** Playfair Display（見出し）、Source Sans 3（本文）、Noto Serif JP（日本語）、DM Mono（モノスペース）

#### セクション構成
| セクション | ID | 内容 |
|---|---|---|
| ヒーロー | `#top` | 名前・肩書き・コアクエスチョン・統計 |
| ローテーティング引用バー | — | 5つの引用を6秒ごとに自動切替 |
| About | `#about` | プロフィール・現職・職歴・学歴、Key Topicsタグクラウド |
| Publications | `#publications` | 著書2冊（書籍抜粋トグル付き）、Amazonリンク、試し読みリンク |
| Speaking | `#speaking` | 登壇履歴テーブル（2015〜2027）、業界団体・委員会 |
| Media | `#media` | Risk.net・FOW掲載記事（Featured + グリッド） |
| Contact | `#contact` | LinkedIn・WAMポータルリンク |

#### 主要CSS変数
```css
--teal-dark: #1d5c5c   /* メインカラー（書籍表紙のティール） */
--gold: #b5832a         /* アクセントカラー（書籍表紙のゴールド） */
--navy: #1a2332         /* ネイビー（ヘッダー背景） */
--off-white: #f7f6f2    /* 背景（偶数セクション） */
```

#### JavaScript機能
- `toggleLang()` — 英日切替
- ローテーティング引用（5種、6秒間隔、ドット手動切替、言語連動）
- `toggleExcerpt(btn)` — 書籍抜粋の開閉
- IntersectionObserver — フェードインアニメーション

#### 重要な注意点
- **言語切替：** `.en`クラスと`.ja`クラスをbodyのlang-en/lang-jaで表示制御
- **書籍タグ：** `pub-tag` / `pub-tag gold` の2色分類
- **WAMポータルリンク：** `href="#"` のまま（URL決定後に要更新）
- **LinkedInリンク：** `https://www.linkedin.com/in/shun-yanagisawa-579b638/`

---

### book.html（書籍試し読みビューア）
**サイズ：** 約20KB  
**使用ライブラリ：** PDF.js 3.11.174（Cloudflare CDN経由）

#### 機能
- フルウィンドウ表示（スクロールなし、ビューア固定）
- **見開き2ページ表示**（デフォルト）/ 単ページ切替ボタン
- **Retinaディスプレイ対応**（`devicePixelRatio`で物理ピクセル倍率適用）
- 自動フィット（ウィンドウサイズに合わせてスケール計算）
- ズーム：自動/60/75/90/100/125%
- 下部シークバー（プログレスバー、クリックで任意ページへ）
- 左右クリックゾーン（ホバーで矢印出現）
- キーボード操作：← → ↑ ↓ / PageUp / PageDown / Home / End
- スマホスワイプ対応
- ページめくりフェードアニメーション

#### 解像度実装（重要）
```javascript
const DPR = window.devicePixelRatio || 1;

async function renderCanvas(pdfPage, canvas, ctx, scale) {
  const viewport = pdfPage.getViewport({ scale: scale * DPR });
  canvas.width  = viewport.width;   // 物理ピクセル（DPR倍）
  canvas.height = viewport.height;
  canvas.style.width  = (viewport.width  / DPR) + 'px';  // CSS表示サイズ
  canvas.style.height = (viewport.height / DPR) + 'px';
  await pdfPage.render({ canvasContext: ctx, viewport }).promise;
}
```

#### PDFファイル
- ファイル名：`book-preview.pdf`（リポジトリルートに配置）
- 内容：デリバティブ・クリアリングのすべて — 序章 + 第1章（105ページ）
- 元ファイル：`デリバティブクリアリングのすべて_A5_第１章.pdf`

---

## 4. コンテンツ資産

### 著書
| タイトル | 種別 | 出版日 | リンク |
|---|---|---|---|
| デリバティブ・クリアリングのすべて | 専門書 | 2026年2月22日 | https://amzn.asia/d/00Aawrf8 |
| 阿頼耶識の海 | SF長編小説 | 2026年 | 第14回早川SFコンテスト応募作 |

### メディア掲載（確認済み）
| 媒体 | タイトル | 日付 | 種別 |
|---|---|---|---|
| FOW | Japan's Rates Market Sees Liquidity Boost on Policy Shift | 2026年4月9日 | 単独取材 |
| Risk.net | Japan's Yen Swaps Go Global | 2025年12月16日 | 引用（JPX/JSCCスポンサード） |
| Risk.net | US Hedge Funds Eyeing JSCC After Regulations Eased | 2025年10月23日 | 直接引用 |
| Risk.net | JSCC and the Future of Clearing and Settling Yen-Denominated Trades | 2023年3月28日 | 直接引用 |
| Risk.net | LCH Japan Plan Signals New Fight for Global Clearing Model | 2023年1月4日 | 参照 |

### 登壇履歴（主要）
| 日時 | イベント | 役割 |
|---|---|---|
| 2027年1月（予定） | FIA Japan New Year Panel — Spotlight on Japan Rates Markets | モデレーター |
| 2026年5月21日（予定） | Risk Live Japan 2026 — Clearing, Collateral & the Cost of Hedging | パネリスト |
| 2026年1月 | JPXパネル — 円金利市場・財務省他 | モデレーター |
| 2024年 | JPX — CFTC Commissioner Caroline Pham 招聘イベント（200名） | オーガナイザー |
| 2024年 | FIA Japan Board Meeting — CFTC Chairman Rostin Behnam | ホスト |
| 2015年〜 | ISDA Annual Japan Conference（複数回）、FIA Japan Conference 他 | パネリスト/モデレーター |

---

## 5. SEO設定

### メタタグ（index.html `<head>`内）
- `<meta name="description">` — 英語説明文
- `<meta name="keywords">` — OTC Clearing, CCP, JSCC, 柳沢俊 等
- OGP（og:title, og:description, og:url, og:image）
- Twitter Card
- schema.org Person（JSON-LD：著書・所属団体含む）

### schema.org Person 主要フィールド
```json
{
  "@type": "Person",
  "name": "Shun Yanagisawa",
  "alternateName": "柳沢 俊",
  "url": "https://www.shun-yanagisawa.com",
  "sameAs": ["https://www.linkedin.com/in/shun-yanagisawa-579b638/"]
}
```

---

## 6. 今後の作業リスト（TODO）

### 優先度：高
- [ ] **Googleサーチコンソール登録** — `shun-yanagisawa.com` をGoogleにインデックス申請（15分）
- [ ] **LinkedInプロフィール更新** — Website欄にURL追加、Publications欄に著書2冊追加
- [ ] **WAMポータルURLの接続** — ContactセクションのWAM Portal `href="#"` を実際のURLに変更

### 優先度：中
- [ ] **プロフィール写真の追加** — Aboutセクションに顔写真を追加（現在なし）
- [ ] **Risk.net記事の正確なURL確認** — MediaセクションのRisk.net記事にURLを追加（現在はリンクなし）
- [x] **Risk Live Japan 2026（5月）登壇後の更新** — 2026-06-13 登壇済に変更
- [ ] **NY ヘッジファンドミーティングの反映** — 内容確定後に Speaking/About を更新
- [ ] **書籍レビュー・推薦コメント追加** — Publicationsセクションに読者コメントを追加

### 優先度：低
- [x] **エッセイ・コラムセクションの追加** — 2026-06-13 `#essays` セクション + `essays/` 新設（Essay 001 = 学びは贅沢財になった）。新規エッセイは essays/learning-as-a-luxury-good.html をテンプレートに複製し、index.html の `#essays` グリッドへカードを1枚追加
- [ ] **Japan Rates Forum / GMAC日本版ページ** — 構想が具体化したタイミングで追加
- [ ] **講義・教育活動セクション** — 2027年以降の非常勤講師デビュー後に追加
- [ ] **Supabase移行検討** — 現在はGitHub Pages静的サイト、将来的なCMS化

---

## 7. 編集ガイドライン

### バイリンガル対応の追加方法
新しいコンテンツを追加する際は必ず英日両言語で記述する。

```html
<!-- テキストブロックの場合 -->
<p class="en">English text here.</p>
<p class="ja">日本語テキストをここに。</p>

<!-- インラインの場合 -->
<span class="en">English</span>
<span class="ja">日本語</span>
```

### 登壇履歴の追加
`#speaking` セクションのテーブルに行を追加する。新しい登壇は上部（最新が先頭）に追加。

```html
<tr>
  <td class="td-date"><span class="en">Month Year</span><span class="ja">YYYY年MM月</span></td>
  <td>
    <div class="td-title">
      <span class="en">Event Title in English</span>
      <span class="ja">イベントタイトル（日本語）</span>
    </div>
    <div class="td-org">
      <span class="en">Organizer · Venue · City</span>
      <span class="ja">主催 · 会場 · 都市</span>
    </div>
  </td>
  <td class="td-role">
    <span class="role-badge panelist">
      <span class="en">Panelist</span><span class="ja">パネリスト</span>
    </span>
  </td>
</tr>
```

**role-badgeのクラス：**
- `panelist` — ネイビー背景
- `moderator` — ティール背景
- `speaker` — ゴールド背景
- `upcoming` — ゴールドダーク背景

### メディア記事の追加
Featured（大型）の場合は `.media-featured` divを追加。  
グリッド（小型）の場合は `.media-card` divを追加。

### 引用バーへの引用追加
`book.html`のJavaScript内 `const quotes = [...]` 配列にオブジェクトを追加：

```javascript
{
  en: '"English quote text here."',
  ja: '「日本語引用テキスト」',
  src_en: 'Source Name, Date',
  src_ja: '出典名、日付'
}
```

---

## 8. デザインシステム

### カラーパレット
```
--teal-dark: #1d5c5c  メインカラー（書籍表紙ティール）
--teal:      #2a7a7a  サブカラー
--teal-light:#e8f2f2  背景ライト
--gold:      #b5832a  アクセント（書籍表紙ゴールド）
--gold-dark: #8a6020  ゴールドダーク
--gold-light:#f5ead8  ゴールドライト背景
--navy:      #1a2332  ネイビー（ヒーロー/フッター背景）
--white:     #ffffff
--off-white: #f7f6f2  セクション背景（偶数）
--text:      #1a1a1a
--text-mid:  #3d3d3d
--text-muted:#666666
--border:    #ddd9d0
```

### フォントスタック
```
見出し（英）：Playfair Display（セリフ・エレガント）
本文（英）：  Source Sans 3（サンセリフ・読みやすい）
日本語：     Noto Serif JP（セリフ）
等幅：       DM Mono（ラベル・バッジ・コード）
```

---

## 9. 関連プロジェクト

### WAM（Willow Asset Management）ポータル
- **別プロジェクト**として独立して管理
- Cloudflare Pagesでホスティング（willow-asset.com）
- StreamlitベースのWebアプリ（ポートフォリオ管理）
- 詳細は `WAM_Coding_Instructions_v1_1.md` を参照

### 接続予定
- `shun-yanagisawa.com` のContactセクション「WAM Portal →」が `href="#"` のまま
- WAMのURLが確定したら `book.html` と `index.html` の両方を更新する

---

## 10. 変更履歴

| 日付 | 内容 |
|---|---|
| 2026-04-16 | 初版作成。index.html・book.html・book-preview.pdf公開完了 |
| 2026-04-16 | Cloudflare Pages + GitHub連携設定完了 |
| 2026-04-16 | カスタムドメイン shun-yanagisawa.com 接続完了 |
| 2026-04-16 | book.html：Retina解像度対応（devicePixelRatio実装） |
| 2026-04-16 | book.html：見開き2ページ表示・全画面固定ビューア実装 |
| 2026-04-16 | index.html：Publications > 試し読みボタン追加 |
| 2026-04-16 | CLAUDE.md 作成 |
