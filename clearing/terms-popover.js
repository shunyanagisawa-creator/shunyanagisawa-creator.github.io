/* /clearing — 本文の用語リンクをポップオーバーにする（PLAN-20260802 §3）
   外部ライブラリなし・1ファイル・CSS も自前で注入する。記事側の変更は
   <script defer src="/clearing/terms-popover.js"></script> の1行だけ。

   漸進強化: 読み込みに失敗しても、fetch がこけても、id が台帳に無くても、
   リンクは従来どおり /clearing/terms#<id> へ遷移する（劣化なし）。

   このファイルの正本は Ananda repo の docs/projects/clearing/terms-popover.js。
   site repo 側は生成物なので手で直さない。 */
(function () {
  'use strict';

  var JSON_URL = '/clearing/terms.json';
  var SELECTOR = 'a[href*="terms#"]';

  // 用語集ページ自身では出さない（索引の関連語リンクと二重になる）
  if (/^\/clearing\/terms(\.html)?(\/.*)?$/.test(location.pathname)) return;

  var CSS = [
    '.tp-card{position:absolute;z-index:900;max-width:24rem;width:calc(100vw - 2rem);',
    'background:#ffffff;color:#24272e;border:1px solid #1a2332;border-left:4px solid #1d5c5c;',
    'border-radius:2px;box-shadow:0 6px 24px rgba(26,35,50,.22);padding:1rem 1.1rem .85rem;',
    "font-family:'Noto Sans JP',sans-serif;font-size:.9rem;line-height:1.85;text-align:left;}",
    '.tp-card:focus{outline:2px solid #1d5c5c;outline-offset:2px;}',
    '.tp-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:.3rem .6rem;padding-right:1.4rem;}',
    ".tp-key{font-family:'DM Mono',monospace;font-size:.95rem;color:#1a2332;letter-spacing:.03em;}",
    '.tp-en{font-size:.76rem;color:#3d4148;font-style:italic;}',
    '.tp-ja{color:#1a2332;font-size:.92rem;margin-top:.15rem;}',
    '.tp-alt{color:#3d4148;font-size:.82rem;}',
    '.tp-def{margin:.5rem 0 0;color:#24272e;font-size:.87rem;line-height:1.8;}',
    '.tp-acts{margin-top:.7rem;padding-top:.55rem;border-top:1px solid #d3cec3;',
    'display:flex;flex-wrap:wrap;gap:.2rem 1.1rem;font-size:.8rem;}',
    '.tp-acts a{color:#1d5c5c;text-decoration:none;border-bottom:1px solid rgba(29,92,92,.45);}',
    '.tp-close{position:absolute;top:.45rem;right:.55rem;background:none;border:0;cursor:pointer;',
    "font-family:'DM Mono',monospace;font-size:1rem;line-height:1;color:#3d4148;padding:.2rem .3rem;}",
    '.tp-close:hover{color:#1a2332;}',
    '.tp-back{display:none;}',
    '@media (max-width:560px){',
    '.tp-back{display:block;position:fixed;inset:0;z-index:890;background:rgba(26,35,50,.35);}',
    '.tp-card{position:fixed;left:0;right:0;bottom:0;top:auto;width:100%;max-width:none;',
    'border-left:1px solid #1a2332;border-bottom:0;border-radius:6px 6px 0 0;',
    'padding:1.1rem 1.2rem 1.4rem;max-height:70vh;overflow-y:auto;}',
    '}'
  ].join('');

  var terms = null;
  var loading = null;
  var card = null;
  var backdrop = null;
  var opener = null;

  function injectCss() {
    var s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function load() {
    if (terms) return Promise.resolve(terms);
    if (!loading) {
      loading = fetch(JSON_URL, { credentials: 'same-origin' })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (d) {
          terms = (d && d.terms) || {};
          return terms;
        });
    }
    return loading;
  }

  function close() {
    if (card && card.parentNode) card.parentNode.removeChild(card);
    if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    card = null;
    backdrop = null;
    if (opener) {
      opener.focus();
      opener = null;
    }
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function place(link) {
    // モバイルは下シート（CSS で position:fixed に切り替わる）
    if (window.matchMedia('(max-width: 560px)').matches) return;
    var r = link.getBoundingClientRect();
    var h = card.offsetHeight;
    var w = card.offsetWidth;
    var gap = 8;
    var below = window.innerHeight - r.bottom;
    var top = below >= h + gap || below >= r.top ? r.bottom + gap : r.top - h - gap;
    var left = r.left;
    var max = document.documentElement.clientWidth - w - gap;
    if (left > max) left = max;
    if (left < gap) left = gap;
    card.style.top = top + window.scrollY + 'px';
    card.style.left = left + window.scrollX + 'px';
  }

  function open(link, entry) {
    close();
    var html = '<button class="tp-close" type="button" aria-label="閉じる">×</button>';
    html += '<div class="tp-head"><span class="tp-key">' + esc(entry.key) + '</span>';
    if (entry.en && entry.en !== entry.key) html += '<span class="tp-en">' + esc(entry.en) + '</span>';
    html += '</div>';
    if (entry.ja) {
      html += '<div class="tp-ja">' + esc(entry.ja);
      if (entry.alt && entry.alt.length) {
        html += '<span class="tp-alt">／' + esc(entry.alt.join('／')) + '</span>';
      }
      html += '</div>';
    }
    if (entry.def) html += '<p class="tp-def">' + esc(entry.def) + '</p>';
    html += '<div class="tp-acts">';
    if (entry.page) html += '<a href="' + esc(entry.page) + '">詳細ページ →</a>';
    html += '<a href="' + esc(entry.url) + '">用語集で見る →</a></div>';

    backdrop = document.createElement('div');
    backdrop.className = 'tp-back';
    backdrop.addEventListener('click', close);
    document.body.appendChild(backdrop);

    card = document.createElement('div');
    card.className = 'tp-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', entry.key + ' の定義');
    card.setAttribute('tabindex', '-1');
    card.style.visibility = 'hidden';
    card.innerHTML = html;
    card.querySelector('.tp-close').addEventListener('click', close);
    document.body.appendChild(card);

    place(link);
    card.style.visibility = '';
    opener = link;
    card.focus();
  }

  function idOf(href) {
    var m = /terms#([^?&#]+)/.exec(href);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function onClick(ev) {
    var link = ev.target.closest ? ev.target.closest(SELECTOR) : null;
    if (!link) return;
    // カード内の「用語集で見る →」も同じ selector に当たる。握り潰すと遷移できない
    if (card && card.contains(link)) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
    var id = idOf(link.getAttribute('href') || '');
    if (!id) return;
    ev.preventDefault();
    load()
      .then(function (t) {
        var entry = t[id];
        if (!entry) {
          location.href = link.href; // 台帳に無い id — 素直に遷移させる
          return;
        }
        open(link, entry);
      })
      .catch(function () {
        location.href = link.href; // fetch がこけたら従来どおり
      });
  }

  function start() {
    if (!document.querySelector(SELECTOR)) return;
    injectCss();
    document.addEventListener('click', function (ev) {
      if (card && !card.contains(ev.target)) {
        var inside = ev.target.closest && ev.target.closest(SELECTOR);
        if (!inside) close();
      }
      onClick(ev);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && card) close();
    });
    window.addEventListener('resize', function () {
      if (card) close();
    });
    // 先読みしない（記事を読むだけの人に余計な通信をさせない）。初回クリックで取る。
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
