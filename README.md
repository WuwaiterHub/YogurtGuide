# YogurtGuide

優格製程筆記（Yogurt Process Notes）：以優格種類、菌種與製法為軸，記錄可對照、可重複的發酵實驗。

- 正式網站：https://yogurtguide.wuwaiter.com/
- GitHub Pages：https://wuwaiter.github.io/YogurtGuide/

## 資料在哪

| 路徑 | 用途 |
|------|------|
| `src/content.config.ts` | Content Collections 欄位與驗證 |
| `src/content/cultures/*.md` | 優格與相關發酵文化 |
| `src/content/methods/*.md` | 製法 |
| `src/content/batches/*.md` | 批次實驗 |
| `src/content/glossary/*.md` | 詞彙 |
| `src/content/market-yogurts/*.md` | 市售優格 |
| `src/content/powders/*.md` | 發酵菌粉 |
| `src/content/additives/*.md`、`src/content/foods/*.md` | 添加物與搭配食物 |
| `src/data/numbered-strains.ts` | 編號菌株 |

頁面在建置時讀 Markdown。批次的 SQLite 是查詢副本，檔案是 `data/batches.sqlite`、`data/batch_ingredients.sqlite`、`data/batch_photos.sqlite`。改完批次 Markdown 後執行 `npm run batch:sqlite` 重建。

## 本地開發

需要 Node.js 22.12 或更新。

```sh
npm install
npx astro dev --background
```

背景伺服器可用 `npx astro dev status`、`npx astro dev logs`、`npx astro dev stop` 管理。
本機網址是 `http://localhost:4321/YogurtGuide/`。`YogurtGuide` 的大小寫要一致。

## 檢查與部署

`npm install` 會裝上 Git hook。

1. `git commit` 會跑 `npm run test:ci`。失敗就不能 commit。
2. `git push` 會跑 gitignore 檢查與安全掃描。失敗就不能 push。
3. 推到 `main` 之後，GitHub Actions 部署 GitHub Pages。Cloudflare 用自己的 Git 連線建置，並部署到正式網址。兩邊都跑 `npm run check:deploy`。
4. `deploy.yml` 最後的 `verify-cloudflare` 每分鐘讀一次正式網站的 `/build.json`，最多 15 分鐘。裡面的 commit 和這次 push 不同就失敗，代表 Cloudflare 可能沒收到 push。

不要把 Cloudflare API token 放進 GitHub。部署結果看 GitHub 的 Actions，以及 Cloudflare 的 Workers 建置紀錄。
