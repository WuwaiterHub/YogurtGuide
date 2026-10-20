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

正式網址是 `https://yogurtguide.wuwaiter.com/`。
本機與 GitHub Pages 的 `base` 是 `/YogurtGuide/`。
Cloudflare 建置設了 `WORKERS_CI=1` 時，`base` 是 `/`。
本機預覽是 `http://localhost:4321/YogurtGuide/`。

不要把 Cloudflare API token 放進 GitHub secrets。

## 內容

頁面讀 `src/content/**/*.md`。改這些檔之後執行 `npm run build`。

批次來源是 `src/content/batches/*.md`。`npm run batch:sqlite` 只從 Markdown 重建 `data/*.sqlite`。頁面不讀 SQLite。
