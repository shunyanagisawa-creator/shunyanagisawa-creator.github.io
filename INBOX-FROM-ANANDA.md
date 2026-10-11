# INBOX — Ananda から shun.com への封筒

## [open] きんざい連載の告知を /media に置く — 2026-10-11
既定: 返事が無ければ、10-14 のダイヤモンド転載確認のときに Ananda が Shun に「shun.com のセッションで置きますか」と 1 行聞く（Ananda は shun.com の repo に書かない）
期限: 2026-10-16（第2回が Online に出る前に第1回の告知を置き終える）

**Shun 原文（2026-10-11・Ananda セッション）**:「静かに立ち上がり、通知であれば、Shun.comに連載通知、KINZAIからは取引先などにPDFシェアOKと言われているが、本文全てシェアはまずいので要点だけシェア、本文は金融財政事情にて、という通知がよいかね」→「続けてShun.comの準備」

### 決まっていること
- 連載 = 週刊金融財政事情「連載セミナー　デリバティブ市場を動かすクリアリングと技術」全10回。第1回「デリバティブは約定しても終わらない」= きんざいOnline 2026-10-09 投稿・10月13日号（https://kinzai-online.jp/node/14913 ・会員向け）。
- **本文は載せない。要点（自分の言葉）だけ**を載せ、本文は誌面とリンク先へ送る。誌面の図も載せない（編集部が描き直した版のため）。
- ダイヤモンド・オンラインに 5 日前後で転載される見込み（題は付け替え・冒頭のみ無料公開）。出たら編集部から連絡が来る。リンクはそのとき足す（Ananda 側のカレンダーに 10-14 確認の予定あり）。
- 静かに出す: SNS で告知しない。ページに 1 件足すだけ。以後は各回が Online に出た後（金曜）に 1 行ずつ足す。先回りしない。
- Citi のコンプラ承認は記事本体について取得済み。要点は**掲載本文に書いてある内容の範囲だけ**で言い直す（数字も本文にあるものだけ）。「個人の見解であり所属先の見解ではない」の 1 行を添える（承認申請で明記を約束した文言）。

### 置き場の提案（判断はそちら）
`media.html` の `<div class="page">` の先頭、Risk.net Sep 2026 の `media-featured` より上に、同じ `media-featured` の型で 1 件。「Quoted in」でなく著者として書いたものなので、メタ行を「Serial column by Shun Yanagisawa」にする。新しい section を立てるかどうかはサイトの作法に合わせて。

### 文案（日本語）
- 見出し: 連載セミナー「デリバティブ市場を動かすクリアリングと技術」（全10回）
- メタ: 週刊金融財政事情 · 2026年10月13日号〜 · 柳沢俊 著
- 導入: 約定の後で動き始める清算（クリアリング）の仕組みを、CCP・クリアリングブローカー・市場参加者の三つの立場から読み解く連載。
- 第1回「デリバティブは約定しても終わらない」（10月13日号）の要点:
  - 取引の相手方、証拠金と担保、資金の手当て、破綻時の処理 — 約定の後に決めるべきことを担うのがクリアリングである
  - 金融危機後の改革は市場を縮めたのではなく、取引を CCP に集めて相殺・圧縮する方向へ配線を組み替えた。その結果、CCP がリスクの集中点になった
  - 同じ価格変動が、市場参加者には損益、クリアリングブローカーには与信と資金繰り、CCP には破綻への備えとして現れる
  - 清算の場・参加資格の限定・少数への集約という骨格は、300年前の大坂・堂島にすでにあった
- 結び: 本文は『週刊金融財政事情』およびきんざいOnline にて。記述は個人の見解であり、所属先の見解ではありません。
- リンク: → kinzai-online.jp（会員向け）／ダイヤモンド・オンライン（転載後に追加）

### 文案（英語）
- Heading: Serial Column — "Clearing and Technology: What Moves the Derivatives Market" (10 parts, in Japanese)
- Meta: Weekly Kinyu Zaisei Jijo · from 13 October 2026 · by Shun Yanagisawa
- Intro: A ten-part series in Japan's weekly financial affairs journal on how clearing works after a trade is executed, seen from three positions — the CCP, the clearing broker and the market participant.
- Part 1 — "A Derivative Trade Does Not End at Execution" (13 October 2026 issue):
  - Clearing decides what follows execution: who the counterparty is, what margin and collateral are posted, who funds the gap, and how a default is handled
  - Post-crisis reform did not simply shrink the market; it rewired trades into CCPs where they can be netted and compressed — making the CCP a new point of risk concentration
  - The same price move shows up as P&L for the participant, as credit and funding for the clearing broker, and as default preparedness for the CCP
  - The skeleton of clearing — a dedicated venue, licensed access and consolidation into a few hands — was already present in Osaka's Dojima rice market 300 years ago
- Closing: Full text in Kinyu Zaisei Jijo and on Kinzai Online (Japanese). Views are the author's own and not those of his employer.
- Link: → kinzai-online.jp (subscription required)

※ 英語の連載名は誌面に英題が無いので仮訳。気になれば Shun に 1 行確かめる。

### 今後の回（追記の型）
各回が Online に出た後に、上の箇条書きの下へ「第N回『回題』（○月○日号）」と要点 2〜3 行を足す。掲載予定: 第2回 10/20号・第3回 10/27号・第4回 11/3号・第5回 11/10号・第6回 11/17号・第7回 11/24号・第8回 12/1号・第9回 12/8号・第10回 12/15号（編集部の依頼原文より）。要点の下書きは Ananda が掲載稿を採取した後に封筒で渡す。

返事: 置いたら commit hash を `C:\pg\Ananda\docs\INBOX-FROM-SHUNCOM.md`（無ければ作る）に 1 行。
