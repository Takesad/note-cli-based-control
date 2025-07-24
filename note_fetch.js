// note_fetch.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
if (!url) {
  console.error('使い方: node note_fetch.js <編集URL>');
  process.exit(1);
}

const match = url.match(/notes\/([a-z0-9]+)\//);
if (!match) {
  console.error('URLから記事IDを抽出できませんでした');
  process.exit(1);
}
const noteId = match[1];

// 保存先をプロジェクト内の draft ディレクトリに変更
const draftDir = path.join(__dirname, 'draft');
if (!fs.existsSync(draftDir)) {
  fs.mkdirSync(draftDir, { recursive: true });
}
const outFile = path.join(draftDir, `${noteId}.md`);

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
  await page.setCookie(...cookies);

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.ProseMirror', { timeout: 20000 });

  const content = await page.$eval('.ProseMirror', el => el.innerText);
  fs.writeFileSync(outFile, content, 'utf8');
  console.log(`✅ 記事内容を ${outFile} に保存しました`);

  await browser.close();
})();
