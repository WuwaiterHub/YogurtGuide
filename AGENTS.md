## Output Style（always applied）

每次回覆前先讀 `.agents/skills/i-have-adhd/SKILL.md` 並照做。

## 版本管理

功能變更、規則變更、架構調整後，commit 前更新 `md/Version.md`。最新一筆放在 `# Version History` 下面的最上方。

```markdown
## vX.Y.Z — YYYY-MM-DD

### Changes
- 做了什麼、為什麼。
```

Patch 用於文件與小修正。Minor 用於新功能或結構調整。Major 用於破壞性變更。

## 網站

正式網址在 Cloudflare : `https://yogurtguide.wuwaiter.com/`。
本機與 GitHub Pages 的 `base` 是 `/YogurtGuide/`。
Cloudflare 建置設了 `WORKERS_CI=1` 時，`base` 是 `/`。
本機預覽是 `http://localhost:4321/YogurtGuide/`。

不要把 Cloudflare API token 放進 GitHub secrets。

## 內容 

頁面讀 `src/content/**/*.md`。改這些檔之後執行 `npm run build`。

批次來源是 `src/content/batches/*.md`。`npm run batch:sqlite` 只從 Markdown 重建 `data/*.sqlite`。頁面不讀 SQLite。

菌粉頁不放店名與連結。沒有評價寫「沒有評價資訊」，沒有菌種寫「沒有菌種資訊」。價格只留金額、幣別、單位、日期。

隔夜燕麥每個食材都要有數量，單位只能是 `g`、`ml`、`顆`、`湯匙`。缺了 `npm run build` 會失敗。

App 讀的資料是建置產出的 `app-content/v1/*.json`。改內容仍改 Markdown，不要手改 `dist/`。

這一期只有網站。`src/config/platforms.ts` 裡的 Android 尚未建置，iOS 不要執行 `cap add ios`。

