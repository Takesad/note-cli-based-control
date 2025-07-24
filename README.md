# note-cli-based-control

Emacs 上で Markdown を編集し、その内容を note の下書き記事へ反映できる CLI ツールです。  
**この README.md を読めば、セットアップから使い方、Markdown 記法、注意点、`.gitignore` 設定まで全部わかります。**

---

## 概要

- note の下書き記事を **Markdown** で編集できます。
- Puppeteer で **ブラウザを自動操作** し、記事を取得・更新します。
- marked で **Markdown → HTML** に変換します。

---

## 注意事項

- **必ず `.gitignore` に `cookies.json` を含めてください！**
  - クッキーにはログイン情報が含まれます。  
    誤って公開すると **アカウントが乗っ取られる危険** があります。
- 本家 note の仕様変更で動かなくなる可能性があります。
- 本ツールの利用は **自己責任** でお願いします。

---

## 必要環境

| 必要なもの | バージョン例・備考 |
| ---------- | ---------------- |
| Node.js    | LTS版推奨 (例: v22.x) |
| npm        | Node.js に同梱 |
| Google Chrome | Puppeteer が使用します |
| Emacs または好みのエディタ | 下書きの編集用 |

---

## セットアップ手順

1. **リポジトリをクローン**

```bash
git clone https://github.com/<あなたのユーザー名>/note-cli-based-control.git
cd note-cli-based-control
```

2. **依存パッケージをインストール**

```bash
npm install
```

3. **Cookie を用意する**

- Chrome拡張 [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg?hl=ja) を使い、
  `https://editor.note.com` にログインした状態で Cookie をエクスポート。
- エクスポートしたファイルを `cookies.json` としてこのディレクトリ直下に置きます。

`cookies.json` は **絶対に GitHub で公開しない** でください。

---

## 使い方

### 記事を取得する

```bash
node note_fetch.js https://editor.note.com/notes/<記事ID>/edit/
```

- `draft/` フォルダに `<記事ID>.md` が生成されます。

---

### Emacs で編集する

```bash
emacs draft/<記事ID>.md
```

- 不要な先頭行（例: `;; This buffer is for text...`）は削除してから編集します。
- 保存は `C-x C-s`、終了は `C-x C-c`。

#### Markdown 記法例

| 書き方 | 表示例 | 用途 |
| ------ | ------ | ---- |
| `# 見出し1` | 大見出し | 記事タイトル相当 |
| `## 見出し2` | 小見出し | セクション |
| `**太字**` | **太字** | 強調 |
| `*斜体*` | *斜体* | 装飾 |
| `- 箇条書き` | • 箇条書き | リスト |

例:

```markdown
# 大見出し
## 小見出し
これは **太字** と *斜体* です。

- 箇条書き1
- 箇条書き2
```

---

### 記事を更新する

```bash
node note_update.js draft/<記事ID>.md
```

- ブラウザが自動で起動し、note に反映されます。

---

## ディレクトリ構成

```plaintext
note-cli-based-control/
├── cookies.json       # あなたのCookie（絶対に公開禁止）
├── draft/             # 下書きMarkdownファイル置き場
│   └── <記事ID>.md
├── note_fetch.js      # 記事を取得するスクリプト
├── note_update.js     # 記事を更新するスクリプト
├── package.json
├── package-lock.json
└── README.md
```

---

## 技術スタック

| 技術 | 用途 | 特徴 |
| ---- | ---- | ---- |
| Node.js | JS実行環境 | CLIで動作させる基盤 |
| Puppeteer | ブラウザ自動操作 | headless Chromeで記事取得/更新 |
| marked | Markdownパーサ | Markdown → HTML変換 |
| Emacs | テキストエディタ | 下書きを直接編集可能 |

---

## `.gitignore` サンプル

以下を `.gitignore` に記述してください。

```gitignore
cookies.json
node_modules/
draft/
```

---

## トラブルシューティング

| 問題 | 解決方法 |
| ---- | -------- |
| `emacsclient: can't find socket` | `emacs -nw` で直接開く |
| 見出しが反映されない | Markdown 記法を見直し、`#` や `##` を正しく使う |
| `ProtocolError` が出る | Puppeteer が対象ページを見つけられないとき。URL やログイン状態を確認 |

---

## セキュリティと公開時の注意

**公開してもよいもの**
- `note_fetch.js`, `note_update.js`, `package.json`, `README.md`

**絶対に公開してはいけないもの**
- `cookies.json`
- `draft/` 内の個人記事ファイル

---

## ライセンス

MIT License

---

## 補足

このツールは個人利用を想定しています。  
改善案や不具合報告があれば Issue / Pull Request をお待ちしています。

**Happy Writing!**
