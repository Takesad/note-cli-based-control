const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// ====== 入力ファイルの取得 ======
const file = process.argv[2];
if (!file) {
  console.error('使い方: node note_update.js <ファイルパス>');
  process.exit(1);
}

// ファイル名から記事IDを取得
const match = file.match(/([a-z0-9]+)\.md$/);
if (!match) {
  console.error('ファイル名から記事IDを抽出できません');
  process.exit(1);
}
const noteId = match[1];
const url = `https://editor.note.com/notes/${noteId}/edit/`;

// ====== Markdown ファイルを読み込み、HTML に変換 ======
const markdownContent = fs.readFileSync(path.resolve(file), 'utf8');
const htmlContent = marked.parse(markdownContent);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // ====== Cookie の適用 ======
  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
  await page.setCookie(...cookies);

  // ====== ページへアクセス ======
  console.log(` ${url} にアクセスしています…`);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.ProseMirror');

  // ====== 既存内容を全選択して削除 ======
  await page.click('.ProseMirror');
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');

  // ====== HTML を貼り付け ======
  console.log('✏️ HTML を貼り付けています…');
  await page.evaluate((html) => {
    const editor = document.querySelector('.ProseMirror');
    editor.focus();
    document.execCommand('insertHTML', false, html);
  }, htmlContent);

  console.log('✅ 記事内容を note に反映しました！');
  // 必要ならここで保存ボタンをクリックする処理も追加できます

  // await browser.close(); // 確認したいならコメントアウト
})();
